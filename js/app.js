function renderTable() {
  const applications = getApplications();
  const tbody = document.getElementById("table-body");

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
    <td class="py-3 px-6">${app.salary}</td>
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
});

document.addEventListener("click", () => {
  document
    .querySelectorAll(".options")
    .forEach((o) => o.classList.add("hidden"));
});

function openModal() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("field-date").value = today;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function submitForm() {
  const application = {
    company: document.getElementById("field-company").value,
    position: document.getElementById("field-position").value,
    dateApplied: document.getElementById("field-date").value,
    city: document.getElementById("field-city").value,
    jobType: document.getElementById("field-jobtype").value,
    salary: document.getElementById("field-salary").value,
    status: document.getElementById("field-status").value,
  };

  addApplication(application);
  closeModal();
  renderTable();

  document.getElementById("field-company").value = "";
  document.getElementById("field-position").value = "";
  document.getElementById("field-date").value = "";
  document.getElementById("field-city").value = "";
  document.getElementById("field-salary").value = "";
  document.getElementById("field-jobtype").selectedIndex = 0;
  document.getElementById("field-status").selectedIndex = 0;
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

function deleteApplication(id) {
  const applications = getApplications();
  const filtered = applications.filter((app) => app.id !== id);
  saveApplications(filtered);
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
