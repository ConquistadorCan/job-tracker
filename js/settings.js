// ─── Custom Dropdown Helper ───────────────────────────────────────────────────

function setupDropdown(btnId, optionsId, labelId, onSelect) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(optionsId);
  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = menu.style.display === "block";
    closeAllDropdowns();
    if (!isVisible) menu.style.display = "block";
  });

  menu.addEventListener("click", (e) => e.stopPropagation());

  menu.querySelectorAll("button[data-value]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById(labelId).textContent = item.dataset.label;
      menu
        .querySelectorAll("button")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      menu.style.display = "none";
      if (onSelect) onSelect(item.dataset.value);
    });
  });
}

function closeAllDropdowns() {
  [
    "options-separator",
    "options-currency",
    "options-status",
    "options-jobtype",
    "lang-options-settings",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

// ─── Theme ────────────────────────────────────────────────────────────────────

let selectedTheme = getSettings().theme || "system";

function updateThemeButtons(active) {
  selectedTheme = active;
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    const isActive = btn.dataset.theme === active;
    btn.style.backgroundColor = isActive ? "#395cd7" : "";
    btn.style.color = isActive ? "white" : "";
    btn.style.borderColor = isActive ? "#395cd7" : "";
  });
}

// ─── Language ─────────────────────────────────────────────────────────────────

function updateLangButton(lang) {
  const meta = LANG_OPTIONS.find((l) => l.code === lang) || LANG_OPTIONS[0];
  document.getElementById("lang-flag-settings").src =
    `https://flagcdn.com/${meta.flag}.svg`;
  const labelEl = document.getElementById("lang-label-settings");
  labelEl.textContent = meta.label;
  labelEl.dataset.lang = lang;
  renderLangOptions(lang);
}

function renderLangOptions(currentLang) {
  const el = document.getElementById("lang-options-settings");
  if (!el) return;

  el.innerHTML = LANG_OPTIONS.map(
    (l) => `
    <button type="button" data-lang="${l.code}"
      class="settings-dropdown-item ${l.code === currentLang ? "active" : ""}">
      <div class="w-5 h-3 overflow-hidden rounded-sm flex-shrink-0">
        <img src="https://flagcdn.com/${l.flag}.svg" class="w-full h-full object-cover"/>
      </div>
      <span>${l.label}</span>
    </button>
  `,
  ).join("");

  el.querySelectorAll("button[data-lang]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const lang = btn.dataset.lang;
      updateLangButton(lang);
      saveSettings({ ...getSettings(), language: lang });
      applySettingsTranslations();
      el.style.display = "none";
    });
  });
}

// ─── Load Settings to Form ────────────────────────────────────────────────────

function loadSettingsToForm() {
  const s = getSettings();

  // Separator: label'ı data-label attribute'undan oku
  const separatorBtn = document.querySelector(
    `#options-separator button[data-value="${s.thousandsSeparator}"]`,
  );
  if (separatorBtn) {
    document.getElementById("label-separator").textContent =
      separatorBtn.dataset.label;
    separatorBtn.classList.add("active");
  }

  // Currency
  const currencyBtn = document.querySelector(
    `#options-currency button[data-value="${s.currency}"]`,
  );
  if (currencyBtn) {
    document.getElementById("label-currency").textContent =
      currencyBtn.dataset.label;
    currencyBtn.classList.add("active");
  }

  // Status
  const statusBtn = document.querySelector(
    `#options-status button[data-value="${s.status}"]`,
  );
  if (statusBtn) {
    document.getElementById("label-status").textContent =
      statusBtn.dataset.label;
    statusBtn.classList.add("active");
  }

  // Job Type
  const jobTypeBtn = document.querySelector(
    `#options-jobtype button[data-value="${s.jobType}"]`,
  );
  if (jobTypeBtn) {
    document.getElementById("label-jobtype").textContent =
      jobTypeBtn.dataset.label;
    jobTypeBtn.classList.add("active");
  }

  // Theme
  updateThemeButtons(s.theme || "system");

  // Language
  updateLangButton(s.language || "en");

  applySettingsTranslations();
}

// ─── Suggestions ─────────────────────────────────────────────────────────────

function renderSuggestions(listId, suggestions, type) {
  const list = document.getElementById(listId);
  list.innerHTML = "";

  suggestions.forEach((s, index) => {
    const tag = document.createElement("div");
    tag.className =
      "flex items-center gap-1.5 bg-cb-50 dark:bg-cb-800 border border-cb-200 dark:border-cb-700 rounded-full px-3 py-1 text-sm text-cb-800 dark:text-cb-200";
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

// ─── Translations ─────────────────────────────────────────────────────────────

function applySettingsTranslations() {
  const ids = {
    "settings-back": "settingsBack",
    "settings-title": "settingsTitle",
    "settings-lang-title": "settingsLangTitle",
    "settings-lang-desc": "settingsLangDesc",
    "settings-theme-title": "settingsThemeTitle",
    "settings-theme-desc": "settingsThemeDesc",
    "settings-separator-title": "settingsSeparatorTitle",
    "settings-separator-desc": "settingsSeparatorDesc",
    "settings-currency-title": "settingsCurrencyTitle",
    "settings-currency-desc": "settingsCurrencyDesc",
    "settings-status-title": "settingsStatusTitle",
    "settings-status-desc": "settingsStatusDesc",
    "settings-jobtype-title": "settingsJobTypeTitle",
    "settings-jobtype-desc": "settingsJobTypeDesc",
    "settings-position-title": "settingsPositionTitle",
    "settings-position-desc": "settingsPositionDesc",
    "settings-city-title": "settingsCityTitle",
    "settings-city-desc": "settingsCityDesc",
  };

  Object.entries(ids).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });

  const titleEl = document.querySelector("title");
  if (titleEl)
    titleEl.textContent = `${t("settingsTitle")} | ${CONFIG.appName}`;
}

// ─── DOMContentLoaded ─────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const s = getSettings();

  loadSettingsToForm();

  // Setup custom dropdowns
  setupDropdown("btn-separator", "options-separator", "label-separator");
  setupDropdown("btn-currency", "options-currency", "label-currency");
  setupDropdown("btn-status", "options-status", "label-status");
  setupDropdown("btn-jobtype", "options-jobtype", "label-jobtype");

  // Language dropdown
  document
    .getElementById("btn-lang-settings")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      const el = document.getElementById("lang-options-settings");
      const isVisible = el.style.display === "block";
      closeAllDropdowns();
      if (!isVisible) el.style.display = "block";
    });

  // Theme buttons
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      updateThemeButtons(theme);
      saveSettings({ ...getSettings(), theme });
      applyTheme(theme);
    });
  });

  // Suggestions
  renderSuggestions(
    "position-suggestions-list",
    s.positionSuggestions,
    "position",
  );
  renderSuggestions("city-suggestions-list", s.citySuggestions, "city");
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

  // Geri butonuna basınca ayarları kaydet ve ana sayfaya dön
  document.getElementById("settings-back").addEventListener("click", () => {
    const current = getSettings();
    const selectedLang =
      document.getElementById("lang-label-settings").dataset.lang || "en";

    const dropdownValues = {
      thousandsSeparator:
        document.querySelector("#options-separator button.active")?.dataset
          .value || current.thousandsSeparator,
      currency:
        document.querySelector("#options-currency button.active")?.dataset
          .value || current.currency,
      status:
        document.querySelector("#options-status button.active")?.dataset
          .value || current.status,
      jobType:
        document.querySelector("#options-jobtype button.active")?.dataset
          .value || current.jobType,
    };

    saveSettings({
      ...current,
      ...dropdownValues,
      theme: selectedTheme,
      language: selectedLang,
    });

    window.location.href = "index.html";
  });

  // Close dropdowns on outside click
  document.addEventListener("click", () => closeAllDropdowns());
});
