export const currency = (code) => {
  const currencies = {
    USD: "$ ",      // US Dollar
    PKR: "₨ ",      // Pakistani Rupee
    INR: "₹ ",      // Indian Rupee
    EUR: "€ ",      // Euro
    GBP: "£ ",      // British Pound
    JPY: "¥ ",      // Japanese Yen
    CNY: "¥ ",      // Chinese Yuan
    AED: "د.إ ",    // UAE Dirham
    SAR: "﷼ ",      // Saudi Riyal
    KWD: "د.ك ",    // Kuwaiti Dinar
    QAR: "﷼ ",      // Qatari Riyal
    BDT: "৳ ",      // Bangladeshi Taka
    TRY: "₺ ",      // Turkish Lira
    RUB: "₽ ",      // Russian Ruble
    KRW: "₩ ",      // South Korean Won
    THB: "฿ ",      // Thai Baht
  };

  return currencies[code?.toUpperCase()] || code;
};