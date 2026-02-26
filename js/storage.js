// Applications
function getApplications() {
  const data = localStorage.getItem(CONFIG.storageKey);
  return data ? JSON.parse(data) : [];
}

function saveApplications(applications) {
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(applications));
}

function addApplication(application) {
  const applications = getApplications();
  application.id = crypto.randomUUID();
  application.createdAt = Date.now();
  applications.push(application);
  saveApplications(applications);
}

function deleteApplication(id) {
  const applications = getApplications();
  const filtered = applications.filter((app) => app.id !== id);
  saveApplications(filtered);
}

function updateApplicationStatus(id, newStatus) {
  const applications = getApplications();
  const app = applications.find((a) => a.id === id);
  if (app) {
    app.status = newStatus;
    saveApplications(applications);
  }
}

// Settings
function getSettings() {
  try {
    const data = localStorage.getItem(CONFIG.settingsKey);
    if (data) {
      const settings = JSON.parse(data);
      const merged = { ...CONFIG.defaults, ...settings };
      return merged;
    }
    const defaults = { ...CONFIG.defaults };
    saveSettings(defaults);
    return defaults;
  } catch {
    return { ...CONFIG.defaults };
  }
}

function saveSettings(settings) {
  localStorage.setItem(CONFIG.settingsKey, JSON.stringify(settings));
}
