let sortConfig = { column: "dateApplied", direction: "desc" };
let filterQuery = "";
let filterStatus = "";

function sortApplications(applications) {
  if (!sortConfig.column) return applications;

  return [...applications].sort((a, b) => {
    const valA = a[sortConfig.column];
    const valB = b[sortConfig.column];

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
      <p class="font-semibold text-slate-500">No applications yet</p>
      <p class="text-sm mt-1">
        JAT helps you track your job applications in one place.
      </p>
      <p class="text-sm mt-1">Click + Add to add your first application</p>
    </td>
  </tr>
`;
    return;
  }

  applications.forEach((app) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="py-3 px-6">${app.company}</td>
    <td class="py-3 px-6">${app.position}</td>
    <td class="py-3 px-6">${app.dateApplied}</td>
    <td class="py-3 px-6">${app.city}</td>
    <td class="py-3 px-6"><span class="badge badge-${app.jobType}">${capitalize(app.jobType)}</span></td>
    <td class="py-3 px-6">${formatSalary(app.salary, app.currency)}</td>
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

  const counter = document.getElementById("table-counter");
  const count = applications.length;
  counter.textContent =
    count === 0
      ? "No applications found"
      : count === 1
        ? "Showing 1 Application"
        : `Showing ${count} Applications`;

  updateStats();
}

document.addEventListener("DOMContentLoaded", () => {
  renderTable();

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-submit").addEventListener("click", submitForm);
  document
    .getElementById("confirm-cancel")
    .addEventListener("click", closeConfirmModal);
  document.getElementById("btn-add").addEventListener("click", openModal);
  document.getElementById("app-name").textContent = CONFIG.appName;
  document.getElementById("sort-date-icon").textContent = "↓";

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

  const searchClear = document.getElementById("search-clear");
  document.getElementById("search-input").addEventListener("input", (e) => {
    filterQuery = e.target.value;
    searchClear.classList.toggle("hidden", filterQuery === "");
    renderTable();
  });

  document.getElementById("filter-status").addEventListener("change", (e) => {
    filterStatus = e.target.value;
    renderTable();
  });

  searchClear.addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    filterQuery = "";
    searchClear.classList.add("hidden");
    renderTable();
  });
});

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

document.addEventListener("click", () => {
  document
    .querySelectorAll(".options")
    .forEach((o) => o.classList.add("hidden"));
});

function openModal() {
  const settings = getSettings();
  const today = new Date().toISOString().split("T")[0];

  document.getElementById("field-date").value = today;
  document.getElementById("field-currency").value = settings.currency;
  document.getElementById("field-status").value = settings.status;
  document.getElementById("field-jobtype").value = settings.jobType;

  document.getElementById("modal").classList.remove("hidden");

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

  const application = {
    company: document.getElementById("field-company").value,
    position: document.getElementById("field-position").value,
    dateApplied: document.getElementById("field-date").value,
    city: document.getElementById("field-city").value,
    jobType: document.getElementById("field-jobtype").value,
    salary: document.getElementById("field-salary").value,
    status: document.getElementById("field-status").value,
    currency: document.getElementById("field-currency").value,
  };

  addApplication(application);
  closeModal();
  renderTable();
  clearForm();
}

function clearForm() {
  document.getElementById("field-company").value = "";
  document.getElementById("field-position").value = "";
  document.getElementById("field-date").value = "";
  document.getElementById("field-city").value = "";
  document.getElementById("field-salary").value = "";
  document.getElementById("field-jobtype").selectedIndex = 0;
  document.getElementById("field-status").selectedIndex = 0;
  document.getElementById("field-currency").selectedIndex = 0;
}

function createStatusDropdown(app) {
  const statuses = ["pending", "interview", "accepted", "rejected"];

  const wrapper = document.createElement("div");
  wrapper.className = "relative inline-block";

  wrapper.innerHTML = `
    <button class="badge badge-${app.status} cursor-pointer">
      ${capitalize(app.status)} ▾
    </button>
    <div class="options hidden fixed bg-white border border-cb-100 rounded-xl shadow-lg z-50 py-1">
      ${statuses
        .map(
          (s) => `
        <div class="px-3 py-1.5 cursor-pointer hover:bg-cb-50 flex items-center gap-2" data-status="${s}">
          <span class="badge badge-${s}">${capitalize(s)}</span>
        </div>
      `,
        )
        .join("")}
    </div>
  `;

  const button = wrapper.querySelector("button");
  const options = wrapper.querySelector(".options");

  button.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = !options.classList.contains("hidden");

    document
      .querySelectorAll(".options")
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
