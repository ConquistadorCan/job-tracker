function getSettings() {
  try {
    const data = localStorage.getItem(CONFIG.settingsKey);
    return data ? JSON.parse(data) : { ...CONFIG.defaults };
  } catch {
    return { ...CONFIG.defaults };
  }
}

function saveSettings(settings) {
  localStorage.setItem(CONFIG.settingsKey, JSON.stringify(settings));
}

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

  document.getElementById("btn-save").addEventListener("click", () => {
    const settings = {
      thousandsSeparator: document.getElementById("setting-separator").value,
      currency: document.getElementById("setting-currency").value,
      status: document.getElementById("setting-status").value,
      jobType: document.getElementById("setting-jobtype").value,
    };

    saveSettings(settings);
    window.location.href = "index.html";
  });
});
