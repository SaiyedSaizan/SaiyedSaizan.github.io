/* saiyedsaizan.github.io. Case-study pages. No dependencies.
   The site is dark only, matching the homepage shell, so there is no theme
   toggle here any more. Figures still listen for "themechange", so the event
   is dispatched once on load to keep that path exercised. */
(function () {
  "use strict";

  window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: "dark" } }));

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
