// ─── State ────────────────────────────────────────────────────────────────────

let sortConfig = { column: "dateApplied", direction: "desc" };
let filterQuery = "";
let filterStatus = "";
let salaryHidden = getSettings().salaryHidden;

const LANG_OPTIONS = [
  { code: "en", label: "English", flag: "gb" },
  { code: "tr", label: "Türkçe", flag: "tr" },
  { code: "es", label: "Español", flag: "es" },
  { code: "de", label: "Deutsch", flag: "de" },
  { code: "it", label: "Italiano", flag: "it" },
  { code: "fr", label: "Français", flag: "fr" },
];

// ─── Table ────────────────────────────────────────────────────────────────────

function sortApplications(applications) {
  if (!sortConfig.column) return applications;

  return [...applications].sort((a, b) => {
    if (sortConfig.column === "dateApplied") {
      const dateResult = new Date(a.dateApplied) - new Date(b.dateApplied);
      if (dateResult !== 0)
        return sortConfig.direction === "asc" ? dateResult : -dateResult;
      const createdA = a.createdAt || 0;
      const createdB = b.createdAt || 0;
      return sortConfig.direction === "asc"
        ? createdA - createdB
        : createdB - createdA;
    }

    const valA = a[sortConfig.column] || "";
    const valB = b[sortConfig.column] || "";
    const result = valA.localeCompare(valB, "tr", { sensitivity: "base" });
    return sortConfig.direction === "asc" ? result : -result;
  });
}

function renderTable() {
  const allApplications = getApplications();
  const tbody = document.getElementById("table-body");

  const filtered = allApplications.filter((app) => {
    const matchesQuery = app.company
      .toLowerCase()
      .includes(filterQuery.toLowerCase());
    const matchesStatus = filterStatus === "" || app.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  const applications = sortApplications(filtered);
  tbody.innerHTML = "";

  if (applications.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-16 text-center text-slate-400">
          <p class="text-4xl mb-3">📭</p>
          <p class="font-semibold text-slate-500">${t("emptyTitle")}</p>
          <p class="text-sm mt-1">${t("emptySubtitle")}</p>
          <p class="text-sm mt-1">${t("emptyAction")}</p>
        </td>
      </tr>
    `;
    document.getElementById("table-counter").textContent = t("noApplications");
    updateStats();
    return;
  }

  applications.forEach((app) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-3 px-6">${app.company}</td>
      <td class="py-3 px-6">${app.position}</td>
      <td class="py-3 px-6">${app.dateApplied}</td>
      <td class="py-3 px-6">${app.city || ""}</td>
      <td class="py-3 px-6"><span class="badge badge-${app.jobType}">${t(app.jobType)}</span></td>
      <td class="py-3 px-6">${salaryHidden ? "******" : formatSalary(app.salary, app.currency)}</td>
    `;

    const statusTd = document.createElement("td");
    statusTd.className = "py-3 px-6 min-w-36";
    statusTd.appendChild(createStatusDropdown(app));
    row.appendChild(statusTd);

    row.style.cursor = "pointer";
    row.addEventListener("click", (e) => {
      if (e.target.closest(".relative")) return;
      openConfirmModal(app.id);
    });

    tbody.appendChild(row);
  });

  const count = applications.length;
  document.getElementById("table-counter").textContent =
    count === 1 ? t("showingOne") : t("showingMany", count);

  updateStats();
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function createStatusDropdown(app) {
  const statuses = ["pending", "interview", "accepted", "rejected"];

  const wrapper = document.createElement("div");
  wrapper.className = "relative inline-block";
  wrapper.innerHTML = `
    <button class="badge badge-${app.status} cursor-pointer">
      ${t(app.status)} ▾
    </button>
    <div class="status-options hidden fixed bg-white border border-cb-100 rounded-xl shadow-lg z-50 py-1">
      ${statuses
        .map(
          (s) => `
        <div class="px-3 py-1.5 cursor-pointer hover:bg-cb-50 flex items-center gap-2" data-status="${s}">
          <span class="badge badge-${s}">${t(s)}</span>
        </div>
      `,
        )
        .join("")}
    </div>
  `;

  const button = wrapper.querySelector("button");
  const options = wrapper.querySelector(".status-options");

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !options.classList.contains("hidden");
    document
      .querySelectorAll(".status-options")
      .forEach((o) => o.classList.add("hidden"));
    if (!isOpen) {
      const rect = button.getBoundingClientRect();
      options.style.top = `${rect.bottom + 4}px`;
      options.style.left = `${rect.left}px`;
      options.style.minWidth = `${rect.width}px`;
      options.classList.remove("hidden");
    }
  });

  wrapper.querySelectorAll("[data-status]").forEach((option) => {
    option.addEventListener("click", () => {
      updateApplicationStatus(app.id, option.dataset.status);
      renderTable();
    });
  });

  return wrapper;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function updateStats() {
  const applications = getApplications();
  document.getElementById("stat-total").textContent = applications.length;
  document.getElementById("stat-interviews").textContent = applications.filter(
    (app) => app.status === "interview",
  ).length;
  document.getElementById("stat-rejected").textContent = applications.filter(
    (app) => app.status === "rejected",
  ).length;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function openModal() {
  const settings = getSettings();
  const today = new Date().toISOString().split("T")[0];

  document.getElementById("field-date").value = today;
  document.getElementById("field-currency").value = settings.currency;
  document.getElementById("field-status").value = settings.status;
  document.getElementById("field-jobtype").value = settings.jobType;

  const positionList = document.getElementById("position-datalist");
  const cityList = document.getElementById("city-datalist");
  positionList.innerHTML = settings.positionSuggestions
    .map((s) => `<option value="${s}"></option>`)
    .join("");
  cityList.innerHTML = settings.citySuggestions
    .map((s) => `<option value="${s}"></option>`)
    .join("");

  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  ["field-company", "field-position", "field-date"].forEach((id) => {
    document
      .getElementById(id)
      .classList.remove("border-red-400", "focus:ring-red-400");
    document
      .getElementById(id)
      .classList.add("border-cb-200", "focus:ring-cb-400");
  });
  ["error-company", "error-position", "error-date"].forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });
}

function clearForm() {
  [
    "field-company",
    "field-position",
    "field-date",
    "field-city",
    "field-salary",
  ].forEach((id) => (document.getElementById(id).value = ""));
  document.getElementById("field-jobtype").selectedIndex = 0;
  document.getElementById("field-status").selectedIndex = 0;
  document.getElementById("field-currency").selectedIndex = 0;
}

function submitForm() {
  if (!validateForm()) return;

  const position = document.getElementById("field-position").value.trim();
  const city = document.getElementById("field-city").value.trim();
  const settings = getSettings();

  if (position && !settings.positionSuggestions.includes(position)) {
    settings.positionSuggestions.push(position);
    saveSettings(settings);
  }
  if (city && !settings.citySuggestions.includes(city)) {
    settings.citySuggestions.push(city);
    saveSettings(settings);
  }

  addApplication({
    company: document.getElementById("field-company").value.trim(),
    position: document.getElementById("field-position").value.trim(),
    dateApplied: document.getElementById("field-date").value,
    city: document.getElementById("field-city").value.trim(),
    jobType: document.getElementById("field-jobtype").value,
    salary: document.getElementById("field-salary").value,
    status: document.getElementById("field-status").value,
    currency: document.getElementById("field-currency").value,
  });

  closeModal();
  clearForm();
  renderTable();
}

function validateForm() {
  const fields = [
    { id: "field-company", errorId: "error-company" },
    { id: "field-position", errorId: "error-position" },
    { id: "field-date", errorId: "error-date" },
  ];

  let isValid = true;

  fields.forEach(({ id, errorId }) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!input.value.trim()) {
      input.classList.add("border-red-400", "focus:ring-red-400");
      input.classList.remove("border-cb-200", "focus:ring-cb-400");
      error.classList.remove("hidden");
      isValid = false;
    } else {
      input.classList.remove("border-red-400", "focus:ring-red-400");
      input.classList.add("border-cb-200", "focus:ring-cb-400");
      error.classList.add("hidden");
    }
  });

  return isValid;
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function openConfirmModal(id) {
  document.getElementById("confirm-modal").classList.remove("hidden");
  document.getElementById("confirm-delete").onclick = () => {
    deleteApplication(id);
    closeConfirmModal();
    renderTable();
  };
}

function closeConfirmModal() {
  document.getElementById("confirm-modal").classList.add("hidden");
}

// ─── Language ─────────────────────────────────────────────────────────────────

function renderLangOptions() {
  const currentLang = getSettings().language || "en";
  const html = LANG_OPTIONS.filter((l) => l.code !== currentLang)
    .map(
      (l) => `
      <button type="button" data-lang="${l.code}" class="w-full flex items-center gap-2 px-3 py-1.5 text-cb-700 cursor-pointer hover:bg-cb-50 rounded-lg">
        <div class="w-5 h-3 overflow-hidden rounded-sm flex-shrink-0">
          <img src="https://flagcdn.com/${l.flag}.svg" alt="${l.code.toUpperCase()}" class="w-full h-full object-cover"/>
        </div>
        <span>${l.label}</span>
      </button>
    `,
    )
    .join("");

  ["lang-options-desktop", "lang-options-mobile"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = html;
    el.querySelectorAll("button[data-lang]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const settings = getSettings();
        settings.language = btn.dataset.lang;
        saveSettings(settings);
        closeLangDropdowns();
        updateLangButton();
        applyTranslations();
      });
    });
  });
}

function updateLangButton() {
  const lang = getSettings().language || "en";
  const meta = LANG_OPTIONS.find((l) => l.code === lang) || LANG_OPTIONS[0];

  ["-desktop", "-mobile"].forEach((suffix) => {
    const flagEl = document.getElementById(`lang-flag${suffix}`);
    const labelEl = document.getElementById(`lang-label${suffix}`);
    if (flagEl) flagEl.src = `https://flagcdn.com/${meta.flag}.svg`;
    if (labelEl) labelEl.textContent = meta.code.toUpperCase();
  });

  renderLangOptions();
}

function closeLangDropdowns() {
  document.getElementById("lang-options-desktop")?.classList.add("hidden");
  document.getElementById("lang-options-mobile")?.classList.add("hidden");
}

// ─── Translations ─────────────────────────────────────────────────────────────

function applyTranslations() {
  const ids = {
    "stat-total-label": "statTotal",
    "stat-interviews-label": "statInterviews",
    "stat-rejected-label": "statRejected",
    "table-title": "tableTitle",
    "modal-title": "modalTitle",
    "modal-submit": "btnSave",
    "confirm-title": "confirmTitle",
    "confirm-message": "confirmMessage",
    "confirm-cancel": "btnCancel",
    "confirm-delete": "btnDelete",
    "error-company": "errorCompany",
    "error-position": "errorPosition",
    "error-date": "errorDate",
    "col-company": "colCompany",
    "col-position": "colPosition",
    "col-dateApplied": "colDateApplied",
    "col-city": "colCity",
    "col-jobType": "colJobType",
    "col-salary": "colSalary",
    "col-status": "colStatus",
    "btn-add": "btnAdd",
  };

  Object.entries(ids).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });

  const placeholders = {
    "search-input": "searchPlaceholder",
    "field-company": "placeholderCompany",
    "field-position": "placeholderPosition",
    "field-city": "placeholderCity",
    "field-salary": "placeholderSalary",
  };

  Object.entries(placeholders).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = t(key);
  });

  const filterSelect = document.getElementById("filter-status");
  if (filterSelect) {
    filterSelect.querySelector('option[value=""]').textContent = t("filterAll");
    ["pending", "interview", "accepted", "rejected"].forEach((s) => {
      const opt = filterSelect.querySelector(`option[value="${s}"]`);
      if (opt) opt.textContent = t(s);
    });
  }

  ["remote", "onsite", "hybrid"].forEach((type) => {
    const opt = document.querySelector(
      `#field-jobtype option[value="${type}"]`,
    );
    if (opt) opt.textContent = t(type);
  });

  ["pending", "interview", "accepted", "rejected"].forEach((s) => {
    const opt = document.querySelector(`#field-status option[value="${s}"]`);
    if (opt) opt.textContent = t(s);
  });

  renderTable();
}

// ─── DOMContentLoaded ─────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  updateLangButton();
  document.getElementById("sort-date-icon").textContent = "↓";

  // Modal
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-submit").addEventListener("click", submitForm);
  document.getElementById("btn-add").addEventListener("click", openModal);

  // Confirm modal
  document
    .getElementById("confirm-cancel")
    .addEventListener("click", closeConfirmModal);

  // Search
  const searchClear = document.getElementById("search-clear");
  document.getElementById("search-input").addEventListener("input", (e) => {
    filterQuery = e.target.value;
    searchClear.classList.toggle("hidden", filterQuery === "");
    renderTable();
  });
  searchClear.addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    filterQuery = "";
    searchClear.classList.add("hidden");
    renderTable();
  });

  // Filter
  document.getElementById("filter-status").addEventListener("change", (e) => {
    filterStatus = e.target.value;
    renderTable();
  });

  // Sort
  document.getElementById("sort-company").addEventListener("click", () => {
    if (sortConfig.column === "company") {
      sortConfig.direction = sortConfig.direction === "asc" ? "desc" : "asc";
    } else {
      sortConfig.column = "company";
      sortConfig.direction = "asc";
    }
    document.getElementById("sort-company-icon").textContent =
      sortConfig.direction === "asc" ? "↑" : "↓";
    document.getElementById("sort-date-icon").textContent = "↕";
    renderTable();
  });

  document.getElementById("sort-date").addEventListener("click", () => {
    if (sortConfig.column === "dateApplied") {
      sortConfig.direction = sortConfig.direction === "asc" ? "desc" : "asc";
    } else {
      sortConfig.column = "dateApplied";
      sortConfig.direction = "asc";
    }
    document.getElementById("sort-date-icon").textContent =
      sortConfig.direction === "asc" ? "↑" : "↓";
    document.getElementById("sort-company-icon").textContent = "↕";
    renderTable();
  });

  // Salary toggle
  function updateSalaryToggleIcon() {
    document
      .getElementById("icon-salary-visible")
      .classList.toggle("hidden", salaryHidden);
    document
      .getElementById("icon-salary-hidden")
      .classList.toggle("hidden", !salaryHidden);
  }

  updateSalaryToggleIcon();

  document
    .getElementById("btn-toggle-salary")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      salaryHidden = !salaryHidden;
      const settings = getSettings();
      settings.salaryHidden = salaryHidden;
      saveSettings(settings);
      updateSalaryToggleIcon();
      renderTable();
    });

  // Language dropdowns
  ["btn-lang-desktop", "btn-lang-mobile"].forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const optionsId =
      id === "btn-lang-desktop"
        ? "lang-options-desktop"
        : "lang-options-mobile";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const options = document.getElementById(optionsId);
      if (!options) return;
      const isHidden = options.classList.contains("hidden");
      closeLangDropdowns();
      if (isHidden) options.classList.remove("hidden");
    });
  });

  // Scroll to top
  const scrollBtn = document.getElementById("scroll-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.remove("opacity-0", "pointer-events-none");
      scrollBtn.classList.add("opacity-100");
    } else {
      scrollBtn.classList.remove("opacity-100");
      scrollBtn.classList.add("opacity-0", "pointer-events-none");
    }
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Close dropdowns on outside click
  document.addEventListener("click", (e) => {
    document
      .querySelectorAll(".status-options")
      .forEach((o) => o.classList.add("hidden"));
    if (
      !e.target.closest("#btn-lang-desktop") &&
      !e.target.closest("#lang-options-desktop")
    ) {
      document.getElementById("lang-options-desktop")?.classList.add("hidden");
    }
    if (
      !e.target.closest("#btn-lang-mobile") &&
      !e.target.closest("#lang-options-mobile")
    ) {
      document.getElementById("lang-options-mobile")?.classList.add("hidden");
    }
  });
});
