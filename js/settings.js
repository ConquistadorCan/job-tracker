function loadSettingsToForm() {
  const settings = getSettings();

  document.getElementById("setting-separator").value =
    settings.thousandsSeparator;
  document.getElementById("setting-currency").value = settings.currency;
  document.getElementById("setting-status").value = settings.status;
  document.getElementById("setting-jobtype").value = settings.jobType;
}

document.addEventListener("DOMContentLoaded", () => {
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
