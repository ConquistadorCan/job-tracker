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
  saveApplications(getApplications().filter((app) => app.id !== id));
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
      const saved = JSON.parse(data);
      // Merge sadece eksik key varsa yap
      const hasAllKeys = Object.keys(CONFIG.defaults).every((k) => k in saved);
      if (!hasAllKeys) {
        const merged = { ...CONFIG.defaults, ...saved };
        saveSettings(merged);
        return merged;
      }
      return saved;
    }
  } catch {
    // ignore
  }
  const defaults = { ...CONFIG.defaults };
  saveSettings(defaults);
  return defaults;
}

function saveSettings(settings) {
  localStorage.setItem(CONFIG.settingsKey, JSON.stringify(settings));
}
