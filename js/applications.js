// ─── State ────────────────────────────────────────────────────────────────────

let sortConfig = { column: "dateApplied", direction: "desc" };
let filterQuery = "";
let filterStatus = "";
let salaryHidden = getSettings().salaryHidden;

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
      if (e.target.closest(".status-dropdown-wrapper")) return;
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
  wrapper.className = "status-dropdown-wrapper relative inline-block";

  const button = document.createElement("button");
  button.className = `badge badge-${app.status} cursor-pointer`;
  button.textContent = `${t(app.status)} ▾`;
  wrapper.appendChild(button);

  // Dropdown body'ye portal olarak ekleniyor — overflow-x-auto tarafından kırpılmaması için
  const options = document.createElement("div");
  options.className =
    "status-portal hidden fixed bg-white dark:bg-cb-900 border border-cb-100 dark:border-cb-800 rounded-xl shadow-lg z-[9999] py-1";
  options.innerHTML = statuses
    .map(
      (s) => `
    <div class="px-3 py-1.5 cursor-pointer hover:bg-cb-50 dark:hover:bg-cb-800 flex items-center gap-2 whitespace-nowrap" data-status="${s}">
      <span class="badge badge-${s}">${t(s)}</span>
    </div>
  `,
    )
    .join("");

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !options.classList.contains("hidden");

    // Diğer tüm portalleri kapat ve temizle
    document.querySelectorAll(".status-portal").forEach((o) => {
      o.classList.add("hidden");
      o.remove();
    });

    if (!isOpen) {
      document.body.appendChild(options);
      const rect = button.getBoundingClientRect();
      const vw = window.innerWidth;

      let left = rect.left;
      options.style.top = `${rect.bottom + 4}px`;
      options.style.left = `${left}px`;
      options.style.minWidth = `${rect.width}px`;
      options.classList.remove("hidden");

      // Viewport sağ kenarından taşarsa sola hizala
      const optRect = options.getBoundingClientRect();
      if (optRect.right > vw - 8) {
        options.style.left = `${Math.max(8, rect.right - optRect.width)}px`;
      }
    }
  });

  options.querySelectorAll("[data-status]").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      updateApplicationStatus(app.id, option.dataset.status);
      options.classList.add("hidden");
      options.remove();
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
  setDropdownValue("field-currency", settings.currency);
  setDropdownValue("field-status", settings.status);
  setDropdownValue("field-jobtype", settings.jobType);

  document.getElementById("position-datalist").innerHTML =
    settings.positionSuggestions
      .map((s) => `<option value="${s}"></option>`)
      .join("");
  document.getElementById("city-datalist").innerHTML = settings.citySuggestions
    .map((s) => `<option value="${s}"></option>`)
    .join("");

  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");

  const validFields = ["field-company", "field-position", "field-date"];
  const errorFields = ["error-company", "error-position", "error-date"];

  validFields.forEach((id) => {
    const el = document.getElementById(id);
    el.classList.remove("border-red-400", "focus:ring-red-400");
    el.classList.add("border-cb-200", "focus:ring-cb-400");
  });
  errorFields.forEach((id) =>
    document.getElementById(id).classList.add("hidden"),
  );
}

function clearForm() {
  [
    "field-company",
    "field-position",
    "field-date",
    "field-city",
    "field-salary",
  ].forEach((id) => (document.getElementById(id).value = ""));
  // Custom dropdown'ları default değerlerine sıfırla
  const settings = getSettings();
  setDropdownValue("field-jobtype", settings.jobType);
  setDropdownValue("field-status", settings.status);
  setDropdownValue("field-currency", settings.currency);
}

function submitForm() {
  if (!validateForm()) return;

  const getValue = (id) => document.getElementById(id).value.trim();
  const position = getValue("field-position");
  const city = getValue("field-city");
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
    company: getValue("field-company"),
    position,
    dateApplied: document.getElementById("field-date").value,
    city,
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
    const empty = !input.value.trim();
    input.classList.toggle("border-red-400", empty);
    input.classList.toggle("focus:ring-red-400", empty);
    input.classList.toggle("border-cb-200", !empty);
    input.classList.toggle("focus:ring-cb-400", !empty);
    error.classList.toggle("hidden", !empty);
    if (empty) isValid = false;
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

  // Filter status dropdown labels
  const filterAll = document.getElementById("filter-opt-all");
  if (filterAll) filterAll.textContent = t("filterAll");
  ["pending", "interview", "accepted", "rejected"].forEach((s) => {
    const filterOpt = document.getElementById(`filter-opt-${s}`);
    if (filterOpt) filterOpt.textContent = t(s);
  });
  // Modal label güncellemesi için mevcut değeri okuyarak etiketi yenile
  const filterLbl = document.getElementById("label-filter-status");
  if (filterLbl && filterStatus === "") filterLbl.textContent = t("filterAll");

  // Modal job type dropdown labels
  ["remote", "onsite", "hybrid"].forEach((type) => {
    const opt = document.getElementById(`jobtype-opt-${type}`);
    if (opt) opt.textContent = t(type);
  });

  // Modal status dropdown labels
  ["pending", "interview", "accepted", "rejected"].forEach((s) => {
    const opt = document.getElementById(`status-opt-${s}`);
    if (opt) opt.textContent = t(s);
  });

  renderTable();
}

// ─── DOMContentLoaded ─────────────────────────────────────────────────────────

// ─── Custom Dropdown Helpers ──────────────────────────────────────────────────

function setupAppDropdown(btnId, menuId, hiddenInputId, labelId, onSelect) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  if (!btn || !menu) return;

  // Menüyü body'ye portal olarak taşı — modal overflow'unu etkilemesin
  document.body.appendChild(menu);
  menu.style.position = "fixed";
  menu.style.zIndex = "9999";

  function openMenu() {
    // Diğer açık app menülerini kapat
    document.querySelectorAll(".app-dropdown-menu").forEach((m) => {
      if (m !== menu) m.style.display = "none";
    });

    const rect = btn.getBoundingClientRect();
    menu.style.display = "block";
    menu.style.minWidth = rect.width + "px";
    menu.style.left = rect.left + "px";
    menu.style.top = rect.bottom + 4 + "px";

    // Sağ kenardan taşarsa sola hizala
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth - 8) {
      menu.style.left = Math.max(8, rect.right - menuRect.width) + "px";
    }
    // Alt kenardan taşarsa yukarı aç
    if (menuRect.bottom > window.innerHeight - 8) {
      menu.style.top = rect.top - menuRect.height - 4 + "px";
    }
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.style.display === "block";
    if (isOpen) {
      menu.style.display = "none";
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll(".app-dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const value = item.dataset.value;
      const label = item.textContent.trim();

      if (hiddenInputId) {
        document.getElementById(hiddenInputId).value = value;
      }
      if (labelId) {
        document.getElementById(labelId).textContent = label;
      }
      menu
        .querySelectorAll(".app-dropdown-item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      menu.style.display = "none";
      if (onSelect) onSelect(value);
    });
  });
}

function setDropdownValue(hiddenInputId, value) {
  const input = document.getElementById(hiddenInputId);
  if (!input) return;
  input.value = value;

  // Bağlı menu ve label'ı bul — naming convention: btn-{id}, options-{id}, label-{id}
  const baseId = hiddenInputId; // e.g. "field-status"
  const menu = document.getElementById(`options-${baseId}`);
  const labelEl = document.getElementById(`label-${baseId}`);
  if (!menu) return;

  menu.querySelectorAll(".app-dropdown-item").forEach((item) => {
    const isActive = item.dataset.value === value;
    item.classList.toggle("active", isActive);
    if (isActive && labelEl) labelEl.textContent = item.textContent.trim();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
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

  // Filter status custom dropdown
  setupAppDropdown(
    "btn-filter-status",
    "options-filter-status",
    null,
    "label-filter-status",
    (value) => {
      filterStatus = value;
      renderTable();
    },
  );

  // Modal dropdowns
  setupAppDropdown(
    "btn-field-jobtype",
    "options-field-jobtype",
    "field-jobtype",
    "label-field-jobtype",
  );
  setupAppDropdown(
    "btn-field-currency",
    "options-field-currency",
    "field-currency",
    "label-field-currency",
  );
  setupAppDropdown(
    "btn-field-status",
    "options-field-status",
    "field-status",
    "label-field-status",
  );

  // Sort — ortak helper
  function setupSortHandler(column, iconId, otherIconId) {
    document
      .getElementById(`sort-${column === "dateApplied" ? "date" : column}`)
      .addEventListener("click", () => {
        if (sortConfig.column === column) {
          sortConfig.direction =
            sortConfig.direction === "asc" ? "desc" : "asc";
        } else {
          sortConfig.column = column;
          sortConfig.direction = "asc";
        }
        document.getElementById(iconId).textContent =
          sortConfig.direction === "asc" ? "↑" : "↓";
        document.getElementById(otherIconId).textContent = "↕";
        renderTable();
      });
  }

  setupSortHandler("company", "sort-company-icon", "sort-date-icon");
  setupSortHandler("dateApplied", "sort-date-icon", "sort-company-icon");

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

  // Scroll to top
  const scrollBtn = document.getElementById("scroll-top");
  window.addEventListener("scroll", () => {
    const visible = window.scrollY > 300;
    scrollBtn.classList.toggle("opacity-0", !visible);
    scrollBtn.classList.toggle("pointer-events-none", !visible);
    scrollBtn.classList.toggle("opacity-100", visible);
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Close dropdowns on outside click
  document.addEventListener("click", () => {
    document.querySelectorAll(".status-portal").forEach((o) => {
      o.classList.add("hidden");
      o.remove();
    });
    document.querySelectorAll(".app-dropdown-menu").forEach((m) => {
      m.style.display = "none";
    });
  });
});
