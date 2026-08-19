/* ==========================================================================
   viz.js — interactive figures. Vanilla JS, no dependencies.
   Every figure paints through CSS classes, so the theme toggle is free.
   ========================================================================== */
(function () {
"use strict";

/* --------------------------------------------------------------- SHA-256
   Synchronous, so the figures work from file:// too, where crypto.subtle is
   unavailable (file:// is not a secure context). Same digest either way. */
var K = [
0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];

function sha256(msg) {
  function rr(x, n) { return (x >>> n) | (x << (32 - n)); }
  var bytes = [], i, c;
  for (i = 0; i < msg.length; i++) {           // UTF-8 encode
    c = msg.charCodeAt(i);
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0xd800 || c >= 0xe000) bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else { i++; c = 0x10000 + (((c & 1023) << 10) | (msg.charCodeAt(i) & 1023));
           bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
  }
  var bl = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (i = 7; i >= 0; i--) bytes.push((bl / Math.pow(2, i * 8)) & 0xff);

  var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  var w = new Array(64), a, b, cc, d, e, f, g, h, t1, t2, j;

  for (i = 0; i < bytes.length; i += 64) {
    for (j = 0; j < 16; j++)
      w[j] = (bytes[i+j*4] << 24) | (bytes[i+j*4+1] << 16) | (bytes[i+j*4+2] << 8) | bytes[i+j*4+3];
    for (j = 16; j < 64; j++) {
      var s0 = rr(w[j-15],7) ^ rr(w[j-15],18) ^ (w[j-15] >>> 3);
      var s1 = rr(w[j-2],17) ^ rr(w[j-2],19) ^ (w[j-2] >>> 10);
      w[j] = (w[j-16] + s0 + w[j-7] + s1) | 0;
    }
    a=H[0];b=H[1];cc=H[2];d=H[3];e=H[4];f=H[5];g=H[6];h=H[7];
    for (j = 0; j < 64; j++) {
      var S1 = rr(e,6) ^ rr(e,11) ^ rr(e,25);
      var ch = (e & f) ^ (~e & g);
      t1 = (h + S1 + ch + K[j] + w[j]) | 0;
      var S0 = rr(a,2) ^ rr(a,13) ^ rr(a,22);
      var mj = (a & b) ^ (a & cc) ^ (b & cc);
      t2 = (S0 + mj) | 0;
      h=g; g=f; f=e; e=(d+t1)|0; d=cc; cc=b; b=a; a=(t1+t2)|0;
    }
    H[0]=(H[0]+a)|0; H[1]=(H[1]+b)|0; H[2]=(H[2]+cc)|0; H[3]=(H[3]+d)|0;
    H[4]=(H[4]+e)|0; H[5]=(H[5]+f)|0; H[6]=(H[6]+g)|0; H[7]=(H[7]+h)|0;
  }
  var out = "";
  for (i = 0; i < 8; i++) out += ("00000000" + (H[i] >>> 0).toString(16)).slice(-8);
  return out;
}

/* Canonical JSON — sorts keys at every level, like the real canonical.ts.
   Two records with the same fields in a different order must hash the same. */
function canonical(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  return "{" + Object.keys(v).sort().map(function (k) {
    return JSON.stringify(k) + ":" + canonical(v[k]);
  }).join(",") + "}";
}

/* ------------------------------------------------------------- svg helper */
var NS = "http://www.w3.org/2000/svg";
function el(name, attrs, text) {
  var n = document.createElementNS(NS, name);
  for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
  if (text !== undefined) n.textContent = text;
  return n;
}
function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }

/* ==========================================================================
   FIGURE 1 — the audit chain you can forge
   ========================================================================== */
function initChain(root) {
  var svg  = root.querySelector("[data-chain-svg]");
  var term = root.querySelector("[data-chain-term]");
  if (!svg || !term) return;

  var GENESIS = "0".repeat(64);
  var base = [
    { seq: 0, action: "policy.evaluate", actor: "agent-7", amount: 40 },
    { seq: 1, action: "tool.read_ledger", actor: "agent-7", amount: 0 },
    { seq: 2, action: "issue_refund",     actor: "agent-7", amount: 250 },
    { seq: 3, action: "approval.granted", actor: "ops_lead", amount: 250 },
    { seq: 4, action: "execution.ok",     actor: "gateway", amount: 250 }
  ];

  var recs, state = "clean";

  /* Seal the chain the way the runtime does: each record commits to the
     hash of the one before it. */
  function seal() {
    recs = base.map(function (r) { return { body: Object.assign({}, r) }; });
    var prev = GENESIS;
    recs.forEach(function (r) {
      r.prev_hash = prev;
      r.entry_hash = sha256(prev + canonical(r.body));
      prev = r.entry_hash;
    });
  }

  /* The verifier. Reads the log alone — it does not trust anything the
     runtime told it. Four ordered checks, first failure wins. */
  function verify() {
    var out = [], prev = GENESIS, broken = -1, reason = "";
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i], fail = "";
      if (r.body.seq !== i)            fail = "seq " + r.body.seq + " is not index " + i;
      else if (r.prev_hash !== prev)   fail = "prev_hash does not match seq " + (i - 1);
      else if (sha256(prev + canonical(r.body)) !== r.entry_hash) fail = "body does not hash to entry_hash";
      if (fail && broken < 0) { broken = i; reason = fail; }
      out.push({ i: i, ok: broken < 0, orphan: broken >= 0 && i > broken, fail: i === broken ? fail : "" });
      prev = r.entry_hash;
    }
    return { rows: out, broken: broken, reason: reason };
  }

  var W = 760, BW = 132, GAP = 24;

  function draw(v) {
    clear(svg);
    svg.setAttribute("viewBox", "-2 0 " + (W+4) + " 152");

    svg.appendChild(el("text", { x: 0, y: 11, class: "fig-mono f-ink3", "font-size": 9.5,
      "letter-spacing": ".9" }, "APPEND-ONLY AUDIT CHAIN — entry_hash = SHA-256( prev_hash + canonical(body) )"));

    v.rows.forEach(function (row, i) {
      var r = recs[i], x = i * (BW + GAP), bad = !row.ok;
      var g = el("g", {});

      g.appendChild(el("rect", { x: x, y: 26, width: BW, height: 62, "stroke-width": 1.3,
        class: "figbox " + (bad ? "f-accbg s-acc" : "f-bluebg s-blue") + (row.orphan ? " dash" : "") }));

      g.appendChild(el("text", { x: x + 10, y: 44, class: "fig-mono " + (bad ? "f-acc" : "f-blue"),
        "font-size": 10.5, "font-weight": 700 }, "seq " + r.body.seq));
      g.appendChild(el("text", { x: x + 10, y: 59, class: "fig-mono f-ink2", "font-size": 9.5 },
        r.body.action.length > 16 ? r.body.action.slice(0, 15) + "…" : r.body.action));
      g.appendChild(el("text", { x: x + 10, y: 73, class: "fig-mono f-ink3", "font-size": 9 },
        "$" + r.body.amount + " · " + r.entry_hash.slice(0, 6) + "…"));

      if (i === v.broken)
        g.appendChild(el("text", { x: x + BW - 9, y: 44, class: "fig-mono f-acc", "font-size": 8.5,
          "text-anchor": "end", "font-weight": 700 }, "✕ FAIL"));
      else if (row.orphan)
        g.appendChild(el("text", { x: x + BW - 9, y: 44, class: "fig-mono f-ink3", "font-size": 8.5,
          "text-anchor": "end" }, "orphan"));

      if (i < v.rows.length - 1) {
        var linkBad = v.broken >= 0 && i + 1 > v.broken;
        g.appendChild(el("path", { d: "M" + (x + BW) + " 57 h" + GAP, "stroke-width": 1.5,
          class: (linkBad ? "s-acc dash" : "s-blue") }));
        if (i + 1 === v.broken) {
          var cx = x + BW + GAP / 2;
          g.appendChild(el("path", { d: "M" + (cx - 5) + " 50 l10 14 M" + (cx + 5) + " 50 l-10 14",
            "stroke-width": 1.8, class: "s-acc" }));
        }
      }
      svg.appendChild(g);
    });

    var msg = v.broken < 0
      ? "✓ chain intact — all " + recs.length + " records re-derive from genesis"
      : "✕ chain invalid at seq " + v.broken + " — " + v.reason;
    svg.appendChild(el("text", { x: 0, y: 112, class: "fig-mono " + (v.broken < 0 ? "f-blue" : "f-acc"),
      "font-size": 10.5, "font-weight": 600 }, msg));
    svg.appendChild(el("text", { x: 0, y: 130, class: "fig-mono f-ink3", "font-size": 9 },
      "the verifier reads the log alone — no runtime state, no network, nothing taken on trust"));
  }

  function line(cls, txt) { return '<span class="' + cls + '">' + txt + "</span>"; }

  function console_(v) {
    var L = ['<span class="d">$</span> <span class="hi">audit-verify --log ./audit.db --offline</span>', ""];
    v.rows.forEach(function (row, i) {
      var r = recs[i], tag, note;
      if (row.ok)          { tag = line("ok", "ok  "); note = r.entry_hash.slice(0, 12) + "…"; }
      else if (row.fail)   { tag = line("bad", "FAIL"); note = row.fail; }
      else                 { tag = line("bad", "FAIL"); note = "orphaned by seq " + v.broken; }
      L.push(tag + '  <span class="d">seq=' + i + "</span>  " +
             (r.body.action + "          ").slice(0, 18) + note);
    });
    L.push("");
    L.push(v.broken < 0
      ? line("ok", "chain valid") + '<span class="d"> · ' + recs.length + " records · exit 0</span>"
      : line("bad", "chain invalid") + '<span class="d"> · ' + v.broken + " verified, " +
        (recs.length - v.broken) + " rejected · exit 2</span>");
    term.innerHTML = L.join("\n");
  }

  function render() { var v = verify(); draw(v); console_(v); syncBtns(); }

  function syncBtns() {
    root.querySelectorAll("[data-chain-act]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-chain-act") === state && state !== "clean"));
    });
  }

  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-chain-act]");
    if (!b) return;
    var act = b.getAttribute("data-chain-act");
    seal();
    if (act === "tamper") {
      recs[2].body.amount = 25000;              // edit the row, leave hashes alone
      state = "tamper";
    } else if (act === "reseal") {
      recs[2].body.amount = 25000;              // edit the row AND recompute its hash
      recs[2].entry_hash = sha256(recs[2].prev_hash + canonical(recs[2].body));
      state = "reseal";
    } else state = "clean";
    render();
  });

  seal(); render();
}

/* ==========================================================================
   FIGURE 2 — 40 concurrent writers, one contiguous chain
   ========================================================================== */
function initRace(root) {
  var svg = root.querySelector("[data-race-svg]");
  var cap = root.querySelector("[data-race-status]");
  if (!svg) return;

  var N = 40, guarded = true, t = 0, timer = null;

  function draw() {
    clear(svg);
    svg.setAttribute("viewBox", "0 0 620 168");

    svg.appendChild(el("text", { x: 0, y: 10, class: "fig-mono f-ink3", "font-size": 9.5, "letter-spacing": ".9" },
      guarded ? "40 SIMULTANEOUS APPENDS · BEGIN IMMEDIATE + COMPARE-AND-SWAP"
              : "40 SIMULTANEOUS APPENDS · NO WRITE LOCK"));

    for (var i = 0; i < N; i++) {
      var y = 22 + i * 2.9, arrived = (i / N) <= t;
      svg.appendChild(el("path", { d: "M0 " + y.toFixed(1) + " h56", "stroke-width": 1.4,
        class: arrived ? "s-blue" : "s-rule2", opacity: arrived ? .75 : .35 }));
    }
    svg.appendChild(el("text", { x: 0, y: 152, class: "fig-mono f-ink3", "font-size": 9 }, "40 writers"));

    svg.appendChild(el("path", { d: "M60 22 L116 60 L116 92 L60 138 Z", "stroke-width": 1,
      class: (guarded ? "f-surf s-blue" : "f-surf s-acc") }));
    svg.appendChild(el("text", { x: 88, y: 72, class: "fig-mono " + (guarded ? "f-blue" : "f-acc"),
      "font-size": 8.5, "text-anchor": "middle" }, guarded ? "CAS" : "race"));
    svg.appendChild(el("text", { x: 88, y: 83, class: "fig-mono f-ink3", "font-size": 8.5,
      "text-anchor": "middle" }, guarded ? "gate" : "open"));

    var slots = 20, done = Math.round(t * slots);
    for (var j = 0; j < slots; j++) {
      var x = 130 + j * 24, filled = j < done;
      /* Unguarded, two writers occasionally claim the same seq — the fork. */
      var dup = !guarded && filled && (j === 6 || j === 13);
      svg.appendChild(el("rect", { x: x, y: 68, width: 19, height: 22, "stroke-width": 1,
        class: !filled ? "f-none s-rule2 dash" : dup ? "f-accbg s-acc" : "f-bluebg s-blue" }));
      if (dup) {
        svg.appendChild(el("rect", { x: x + 3, y: 62, width: 19, height: 22, "stroke-width": 1, class: "f-accbg s-acc" }));
        svg.appendChild(el("text", { x: x + 12, y: 56, class: "fig-mono f-acc", "font-size": 7.5,
          "text-anchor": "middle" }, "dup"));
      }
      if (j < slots - 1 && filled && !dup)
        svg.appendChild(el("path", { d: "M" + (x + 19) + " 79 h5", "stroke-width": 1.2, class: "s-blue" }));
    }
    svg.appendChild(el("text", { x: 130, y: 60, class: "fig-mono f-ink3", "font-size": 8.5 }, "append-only log"));

    var ok = guarded;
    svg.appendChild(el("text", { x: 130, y: 106, class: "fig-mono " + (ok ? "f-blue" : "f-acc"), "font-size": 9.5 },
      ok ? "✓ one contiguous chain · seq 1..40 · no gaps, no forks"
         : "✕ two writers claimed the same seq · the chain forks"));

    svg.appendChild(el("path", { d: "M130 122 H616", class: "s-rule" }));
    svg.appendChild(el("text", { x: 130, y: 140, class: "fig-mono f-ink3", "font-size": 9 }, "2 racing approvers →"));
    svg.appendChild(el("text", { x: 252, y: 140, class: "fig-mono " + (ok ? "f-blue" : "f-acc"),
      "font-size": 9, "font-weight": 700 }, ok ? "exactly 1 execution" : "2 executions"));
    svg.appendChild(el("text", { x: 366, y: 140, class: "fig-mono f-ink3", "font-size": 9 },
      ok ? "· 1 rejected NOT_PENDING · 0 double-dispatch" : "· the refund goes out twice"));

    if (cap) cap.textContent = guarded
      ? "BEGIN IMMEDIATE takes the write lock up front; sequence allocation happens inside it."
      : "Without the lock, two writers read the same tail and both claim it.";
  }

  function play() {
    if (timer) clearInterval(timer);
    t = 0; draw();
    timer = setInterval(function () {
      t += .045;
      if (t >= 1) { t = 1; clearInterval(timer); timer = null; }
      draw();
    }, 34);
  }

  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-race-act]");
    if (!b) return;
    var a = b.getAttribute("data-race-act");
    if (a === "replay") play();
    else { guarded = (a === "guarded"); play(); }
    root.querySelectorAll("[data-race-act]").forEach(function (x) {
      var v = x.getAttribute("data-race-act");
      if (v === "guarded" || v === "unguarded")
        x.setAttribute("aria-pressed", String((v === "guarded") === guarded));
    });
  });

  t = 1; draw();
  if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if ("IntersectionObserver" in window) {
      var seen = false;
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting && !seen) { seen = true; play(); }
      }, { threshold: .35 }).observe(svg);
    }
  }
}

/* ==========================================================================
   FIGURE 3 — the cross-video race (AI Watch)
   ========================================================================== */
function initAwait(root) {
  var svg = root.querySelector("[data-await-svg]");
  var note = root.querySelector("[data-await-note]");
  if (!svg) return;

  var guarded = true, step = 5;
  var STEPS = [
    { at: 0,   label: "read stored session",      t: 62 },
    { at: 1,   label: "fetch tab url",            t: 150 },
    { at: 2,   label: "resolve transcript",       t: 250 },
    { at: 3,   label: "call the model",           t: 360 },
    { at: 4,   label: "write answer back",        t: 470 }
  ];
  var NAV = 2;   // the user navigates to a different video after boundary 2

  function draw() {
    clear(svg);
    svg.setAttribute("viewBox", "0 0 560 162");
    var LY = 44, RY = 104;

    svg.appendChild(el("text", { x: 0, y: 10, class: "fig-mono f-ink3", "font-size": 9.5, "letter-spacing": ".9" },
      "ONE TAB · answerQuestion() · 5 AWAIT BOUNDARIES"));

    svg.appendChild(el("text", { x: 0, y: LY - 12, class: "fig-mono f-ink2", "font-size": 9 }, "video A  (question asked here)"));
    svg.appendChild(el("text", { x: 0, y: RY - 12, class: "fig-mono f-ink2", "font-size": 9 }, "video B  (user navigates here)"));
    svg.appendChild(el("path", { d: "M0 " + LY + " H548", class: "s-rule" }));
    svg.appendChild(el("path", { d: "M0 " + RY + " H548", class: "s-rule" }));

    STEPS.forEach(function (s, i) {
      var reached = i <= step;
      var afterNav = i > NAV;
      var lane = (afterNav && !guarded) ? RY : LY;
      var stopped = guarded && afterNav && step >= i;

      if (i > 0) {
        var p = STEPS[i - 1];
        var pl = (p.at > NAV && !guarded) ? RY : LY;
        if (reached && !(guarded && p.at >= NAV + 1))
          svg.appendChild(el("path", { d: "M" + p.t + " " + pl + " L" + s.t + " " + lane,
            "stroke-width": 1.4, class: (afterNav && !guarded) ? "s-acc dash" : "s-blue" }));
      }

      if (reached && !(guarded && afterNav)) {
        svg.appendChild(el("circle", { cx: s.t, cy: lane, r: 4.5, class: "f-blue" }));
      } else if (reached && guarded && afterNav) {
        svg.appendChild(el("circle", { cx: s.t, cy: LY, r: 4.5, class: "f-none s-acc", "stroke-width": 1.5 }));
        svg.appendChild(el("path", { d: "M" + (s.t - 3.2) + " " + (LY - 3.2) + " l6.4 6.4 M" +
          (s.t + 3.2) + " " + (LY - 3.2) + " l-6.4 6.4", "stroke-width": 1.4, class: "s-acc" }));
      } else {
        svg.appendChild(el("circle", { cx: s.t, cy: LY, r: 4.5, class: "f-none s-rule2", "stroke-width": 1.2 }));
      }

      svg.appendChild(el("text", { x: s.t, y: 138, class: "fig-mono " + (reached ? "f-ink3" : "f-rule"),
        "font-size": 7.5, "text-anchor": "middle" }, "await " + (i + 1)));
    });

    // the navigation event
    var nx = (STEPS[NAV].t + STEPS[NAV + 1].t) / 2;
    svg.appendChild(el("path", { d: "M" + nx + " 22 V126", "stroke-width": 1, class: "s-acc dash" }));
    svg.appendChild(el("text", { x: nx + 5, y: 20, class: "fig-mono f-acc", "font-size": 8.5 }, "SPA navigation"));

    var msg, cls;
    if (step < NAV + 1) { msg = "in flight — same video, nothing to detect yet"; cls = "f-ink3"; }
    else if (guarded)   { msg = "✓ identity re-checked after the await → request aborted, no answer sent"; cls = "f-blue"; }
    else                { msg = "✕ video A's transcript answers video B's question"; cls = "f-acc"; }
    svg.appendChild(el("text", { x: 0, y: 152, class: "fig-mono " + cls, "font-size": 9.5, "font-weight": 600 }, msg));

    if (note) note.textContent = guarded
      ? "Tab URL, videoId and sessionId are re-read after every await; storage — not worker memory — is the source of truth."
      : "The worker keeps the identity it captured before the first await. Every later boundary is a window for the page to change underneath it.";

    root.querySelectorAll("[data-await-act]").forEach(function (x) {
      var v = x.getAttribute("data-await-act");
      if (v === "on" || v === "off") x.setAttribute("aria-pressed", String((v === "on") === guarded));
    });
  }

  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-await-act]");
    if (!b) return;
    var a = b.getAttribute("data-await-act");
    if (a === "on" || a === "off") guarded = (a === "on");
    else if (a === "step") step = step >= STEPS.length - 1 ? 0 : step + 1;
    else if (a === "reset") step = STEPS.length - 1;
    draw();
  });

  draw();
}

/* ------------------------------------------------------------------ boot */
function boot() {
  document.querySelectorAll("[data-viz='chain']").forEach(initChain);
  document.querySelectorAll("[data-viz='race']").forEach(initRace);
  document.querySelectorAll("[data-viz='await']").forEach(initAwait);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

})();
