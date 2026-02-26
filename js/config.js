const CONFIG = {
  appName: "JAT",
  storageKey: "job-tracker-applications",
  settingsKey: "job-tracker-settings",
  currencies: [
    { code: "TRY", symbol: "₺" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
  ],
  defaults: {
    thousandsSeparator: ".",
    currency: "TRY",
    status: "pending",
    jobType: "onsite",
    language: "en",
    positionSuggestions: [
      "Software Engineer",
      "Backend Engineer",
      "Frontend Engineer",
      "Full Stack Engineer",
    ],
    citySuggestions: ["İstanbul", "Ankara", "İzmir"],
  },
};
