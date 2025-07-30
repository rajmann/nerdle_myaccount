export const isMobile = () => /Mobi/i.test(navigator.userAgent);

export const nth = (n) => ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th"
