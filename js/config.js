const LANG_OPTIONS = [
  { code: "en", label: "English", flag: "gb" },
  { code: "tr", label: "Türkçe", flag: "tr" },
  { code: "es", label: "Español", flag: "es" },
  { code: "de", label: "Deutsch", flag: "de" },
  { code: "it", label: "Italiano", flag: "it" },
  { code: "fr", label: "Français", flag: "fr" },
];

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
    salaryHidden: false,
    theme: "system",
    positionSuggestions: [
      "Software Engineer",
      "Backend Engineer",
      "Frontend Engineer",
      "Full Stack Engineer",
    ],
    citySuggestions: ["İstanbul", "Ankara", "İzmir"],
  },
};
