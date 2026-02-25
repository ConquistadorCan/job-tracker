function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatSalary(salary, currency) {
  if (!salary) return "-";

  const symbol =
    CONFIG.currencies.find((c) => c.code === currency)?.symbol || "";
  const formatted = Number(salary).toLocaleString("tr-TR");

  return `${formatted}${symbol}`;
}
