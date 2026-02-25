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

function updateApplicationStatus(id, newStatus) {
  const applications = getApplications();
  const app = applications.find((a) => a.id === id);
  if (app) {
    app.status = newStatus;
    saveApplications(applications);
  }
}
