export const todayDate = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  weekday: "long",
}).format(new Date());

// Output:
// Friday, 11 Jul 2026