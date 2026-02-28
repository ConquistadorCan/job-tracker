// ─── Theme helpers ──────────────────────────────────────────────────────────

function isDark() {
  return document.documentElement.classList.contains("dark");
}

const gridColor = () =>
  isDark() ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
const tickColor = () => (isDark() ? "#9ebef2" : "#395cd7");
const labelColor = () => (isDark() ? "#c5d7f8" : "#2d3da0");

// ─── Data helpers ────────────────────────────────────────────────────────────

function getStatusCounts(apps) {
  const counts = { pending: 0, interview: 0, accepted: 0, rejected: 0 };
  apps.forEach((a) => {
    if (counts[a.status] !== undefined) counts[a.status]++;
    else counts.pending++;
  });
  return counts;
}

function getMonthlyData(apps) {
  const buckets = {};

  apps.forEach((app) => {
    if (!app.dateApplied) return;
    const d = new Date(app.dateApplied);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets[key] = (buckets[key] || 0) + 1;
  });

  const keys = Object.keys(buckets).sort();
  const lang = getSettings().language || "en";
  const years = new Set(keys.map((k) => k.slice(0, 4)));
  const multiYear = years.size > 1;

  return keys.map((key) => {
    const [year, month] = key.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    const label = multiYear
      ? d.toLocaleDateString(lang, { month: "short", year: "2-digit" })
      : d.toLocaleDateString(lang, { month: "short" });
    return { key, label, count: buckets[key] };
  });
}

function renderSummaryCards(apps, counts) {
  document.getElementById("stat-total-val").textContent = apps.length;
  document.getElementById("stat-pending-val").textContent = counts.pending;
  document.getElementById("stat-interview-val").textContent = counts.interview;
  document.getElementById("stat-accepted-val").textContent = counts.accepted;
  document.getElementById("stat-rejected-val").textContent = counts.rejected;
}

let donutChart = null;

function renderDonut(counts) {
  const ctx = document.getElementById("donut-chart").getContext("2d");

  const data = [
    counts.pending,
    counts.interview,
    counts.accepted,
    counts.rejected,
  ];
  const total = data.reduce((s, v) => s + v, 0);

  if (donutChart) donutChart.destroy();

  donutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        t("statsPending"),
        t("statsInterview"),
        t("statsAccepted"),
        t("statsRejected"),
      ],
      datasets: [
        {
          data,
          backgroundColor: ["#f59e0b", "#a855f7", "#10b981", "#ef4444"],
          borderColor: isDark() ? "#29377f" : "#ffffff",
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed;
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return ` ${val} (${pct}%)`;
            },
          },
          backgroundColor: isDark() ? "#1d234e" : "#fff",
          titleColor: labelColor(),
          bodyColor: labelColor(),
          borderColor: isDark() ? "#3049c4" : "#c5d7f8",
          borderWidth: 1,
        },
      },
    },
  });

  // Render custom legend
  const legendEl = document.getElementById("donut-legend");
  const colors = ["#f59e0b", "#a855f7", "#10b981", "#ef4444"];
  const labels = [
    { key: "statsPending", count: counts.pending },
    { key: "statsInterview", count: counts.interview },
    { key: "statsAccepted", count: counts.accepted },
    { key: "statsRejected", count: counts.rejected },
  ];
  legendEl.innerHTML = labels
    .map(
      ({ key, count }, i) => `
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-full flex-shrink-0" style="background:${colors[i]}"></span>
        <span class="text-sm text-cb-700 dark:text-cb-300 font-medium">${t(key)}</span>
        <span class="ml-auto text-sm font-bold text-cb-800 dark:text-cb-100">${count}${total > 0 ? ` <span class="text-xs font-normal text-cb-400">(${Math.round((count / total) * 100)}%)</span>` : ""}</span>
      </div>`,
    )
    .join("");
}

let barChart = null;

function renderBar(months) {
  const ctx = document.getElementById("bar-chart").getContext("2d");

  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: months.map((m) => m.label),
      datasets: [
        {
          label: t("statsMonthlyChartTitle"),
          data: months.map((m) => m.count),
          backgroundColor: isDark()
            ? "rgba(78,121,227,0.75)"
            : "rgba(57,92,215,0.80)",
          borderColor: isDark() ? "#4e79e3" : "#395cd7",
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark() ? "#1d234e" : "#fff",
          titleColor: labelColor(),
          bodyColor: labelColor(),
          borderColor: isDark() ? "#3049c4" : "#c5d7f8",
          borderWidth: 1,
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor() },
          ticks: { color: tickColor(), font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: gridColor() },
          ticks: {
            color: tickColor(),
            stepSize: 1,
            precision: 0,
            font: { size: 11 },
          },
        },
      },
    },
  });
}

function renderPage() {
  const apps = getApplications();
  const counts = getStatusCounts(apps);
  const months = getMonthlyData(apps);

  document.getElementById("stats-back-btn").textContent = t("statsBack");
  document.getElementById("stats-title").textContent = t("statsTitle");
  document.getElementById("stats-status-title").textContent = t(
    "statsStatusChartTitle",
  );
  document.getElementById("stats-monthly-title").textContent = t(
    "statsMonthlyChartTitle",
  );
  document.getElementById("stat-total-label").textContent = t("statsTotal");
  document.getElementById("stat-pending-label").textContent = t("statsPending");
  document.getElementById("stat-interview-label").textContent =
    t("statsInterview");
  document.getElementById("stat-accepted-label").textContent =
    t("statsAccepted");
  document.getElementById("stat-rejected-label").textContent =
    t("statsRejected");
  document.title = `${t("statsTitle")} | JAT`;

  if (apps.length === 0) {
    document.getElementById("stats-empty").classList.remove("hidden");
    document.getElementById("stats-empty").textContent = t("statsNoData");
    document.getElementById("stats-content").classList.add("hidden");
    return;
  }

  document.getElementById("stats-empty").classList.add("hidden");
  document.getElementById("stats-content").classList.remove("hidden");

  renderSummaryCards(apps, counts);
  renderDonut(counts);
  renderBar(months);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("stats-back-btn").addEventListener("click", () => {
    history.length > 1 ? history.back() : (location.href = "index.html");
  });

  renderPage();
});
