function loadSettingsToForm() {
  const settings = getSettings();

  document.getElementById("setting-separator").value =
    settings.thousandsSeparator;
  document.getElementById("setting-currency").value = settings.currency;
  document.getElementById("setting-status").value = settings.status;
  document.getElementById("setting-jobtype").value = settings.jobType;
}

document.addEventListener("DOMContentLoaded", () => {
  applySettingsTranslations();
  loadSettingsToForm();

  const settings = getSettings();
  renderSuggestions(
    "position-suggestions-list",
    settings.positionSuggestions,
    "position",
  );
  renderSuggestions("city-suggestions-list", settings.citySuggestions, "city");

  setupSuggestionInput(
    "input-position-suggestion",
    "position-suggestions-list",
    "position",
  );
  setupSuggestionInput(
    "input-city-suggestion",
    "city-suggestions-list",
    "city",
  );

  document.getElementById("btn-save").addEventListener("click", () => {
    const settings = {
      thousandsSeparator: document.getElementById("setting-separator").value,
      currency: document.getElementById("setting-currency").value,
      status: document.getElementById("setting-status").value,
      jobType: document.getElementById("setting-jobtype").value,
      positionSuggestions: getSettings().positionSuggestions,
      citySuggestions: getSettings().citySuggestions,
    };

    saveSettings(settings);
    window.location.href = "index.html";
  });
});

function applySettingsTranslations() {
  // Page title (tab)
  const titleEl = document.querySelector("title");
  if (titleEl) {
    titleEl.textContent = `${t("settingsTitle")} | ${CONFIG.appName}`;
  }

  // Header
  document.getElementById("settings-back").textContent = t("settingsBack");
  document.getElementById("settings-title").textContent = t("settingsTitle");

  // Sections
  document.getElementById("settings-separator-title").textContent =
    t("settingsSeparatorTitle");
  document.getElementById("settings-separator-desc").textContent =
    t("settingsSeparatorDesc");

  document.getElementById("settings-currency-title").textContent =
    t("settingsCurrencyTitle");
  document.getElementById("settings-currency-desc").textContent =
    t("settingsCurrencyDesc");

  document.getElementById("settings-status-title").textContent =
    t("settingsStatusTitle");
  document.getElementById("settings-status-desc").textContent =
    t("settingsStatusDesc");

  document.getElementById("settings-jobtype-title").textContent =
    t("settingsJobTypeTitle");
  document.getElementById("settings-jobtype-desc").textContent =
    t("settingsJobTypeDesc");

  document.getElementById("settings-position-title").textContent =
    t("settingsPositionTitle");
  document.getElementById("settings-position-desc").textContent =
    t("settingsPositionDesc");

  document.getElementById("settings-city-title").textContent =
    t("settingsCityTitle");
  document.getElementById("settings-city-desc").textContent =
    t("settingsCityDesc");

  // Save button
  document.getElementById("btn-save").textContent = t("btnSaveSettings");
}

function renderSuggestions(listId, suggestions, type) {
  const list = document.getElementById(listId);
  list.innerHTML = "";

  suggestions.forEach((s, index) => {
    const tag = document.createElement("div");
    tag.className =
      "flex items-center gap-1.5 bg-cb-50 border border-cb-200 rounded-full px-3 py-1 text-sm";
    tag.innerHTML = `
      <span>${s}</span>
      <button data-index="${index}" data-type="${type}" class="text-slate-400 hover:text-red-500 cursor-pointer">✕</button>
    `;
    list.appendChild(tag);
  });

  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const settings = getSettings();
      const key =
        btn.dataset.type === "position"
          ? "positionSuggestions"
          : "citySuggestions";
      settings[key].splice(Number(btn.dataset.index), 1);
      saveSettings(settings);
      renderSuggestions(listId, settings[key], btn.dataset.type);
    });
  });
}

function setupSuggestionInput(inputId, listId, type) {
  document.getElementById(inputId).addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = e.target.value.trim();
    if (!value) return;

    const settings = getSettings();
    const key = type === "position" ? "positionSuggestions" : "citySuggestions";

    if (!settings[key].includes(value)) {
      settings[key].push(value);
      saveSettings(settings);
      renderSuggestions(listId, settings[key], type);
    }

    e.target.value = "";
  });
}
