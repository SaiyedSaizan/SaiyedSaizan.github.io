/* saiyedsaizan.github.io — theme + nav. No dependencies. */
(function () {
  "use strict";
  var root = document.documentElement;

  function save(t) { try { localStorage.setItem("theme", t); } catch (e) {} }
  function read()  { try { return localStorage.getItem("theme"); } catch (e) { return null; } }

  function apply(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    var b = document.querySelector(".theme-btn");
    if (b) b.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    // let figures that cache colours know
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".theme-btn");
    if (!b) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next); save(next);
  });

  apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function (ev) { if (!read()) apply(ev.matches ? "dark" : "light"); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
