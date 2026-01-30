const loadFonts = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
};

if ("requestIdleCallback" in window) {
  window.requestIdleCallback(loadFonts, { timeout: 2000 });
} else {
  window.setTimeout(loadFonts, 1500);
}
