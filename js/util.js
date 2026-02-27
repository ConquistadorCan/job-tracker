function capitalize(str) {
  if (!str) return "";

  // Locale-aware first letter uppercasing, especially for Turkish "i"
  const settings = typeof getSettings === "function" ? getSettings() : null;
  const lang = settings?.language || "en";

  const firstChar = str.charAt(0);
  const rest = str.slice(1);

  if (lang === "tr") {
    return firstChar.toLocaleUpperCase("tr-TR") + rest;
  }

  return firstChar.toUpperCase() + rest;
}

function formatSalary(salary, currency) {
  if (!salary) return "—";

  const settings = getSettings();
  const symbol =
    CONFIG.currencies.find((c) => c.code === currency)?.symbol || "";
  const formatted = Number(salary).toLocaleString(
    settings.thousandsSeparator === "." ? "tr-TR" : "en-US",
  );

  return `${formatted} ${symbol}`;
}

function applyTheme(theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = theme === "dark" || (theme === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", shouldBeDark);
}
