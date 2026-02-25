function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
