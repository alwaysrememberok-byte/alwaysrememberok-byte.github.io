/* InstiQ Solutions — shared behaviour (v2, Oct 2026) */
(function () {
  var PHONE = '919821825779', EMAIL = 'support@instiq.in';
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav: solid after scroll, mobile menu, current page
  var nav = document.querySelector('.nav');
  function onScroll() { nav && nav.classList.toggle('solid', scrollY > 20 || document.body.classList.contains('light-top')); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var mb = document.querySelector('.menu-btn'), links = document.querySelector('.nav .links');
  if (mb) mb.addEventListener('click', function () { var o = links.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav .links a').forEach(function (a) { if (a.getAttribute('href') === here) a.classList.add('on'); });

  // reveal on scroll
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .14 }) : null;
  document.querySelectorAll('.rv,.tl').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  // cards: light follows the pointer, gentle 3D tilt
  document.querySelectorAll('.card').forEach(function (c) {
    var g = document.createElement('span'); g.className = 'glow'; c.prepend(g);
    if (still || matchMedia('(hover: none)').matches) return;
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      g.style.left = x + 'px'; g.style.top = y + 'px';
      if (c.hasAttribute('data-tilt')) c.style.transform = 'perspective(900px) rotateX(' + ((y / r.height - .5) * -6) + 'deg) rotateY(' + ((x / r.width - .5) * 6) + 'deg) translateY(-4px)';
    });
    c.addEventListener('mouseleave', function () { c.style.transform = ''; });
  });

  // marquee: duplicate for a seamless loop
  document.querySelectorAll('.mq').forEach(function (m) {
    var n = m.children.length; m.innerHTML += m.innerHTML;
    [].slice.call(m.children, n).forEach(function (x) { x.setAttribute('aria-hidden', 'true'); });
  });

  // connected-dots canvas in dark heroes
  document.querySelectorAll('canvas.net').forEach(function (cv) {
    if (still) return;
    var ctx = cv.getContext('2d'), pts = [], W, H, dpr = Math.min(2, devicePixelRatio || 1);
    function size() { W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener('resize', size);
    var N = Math.round(Math.min(70, W / 18));
    for (var i = 0; i < N; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
    var mouse = { x: -999, y: -999 };
    cv.parentElement.parentElement.addEventListener('mousemove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    var visible = true;
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cv);
    (function tick() {
      requestAnimationFrame(tick); if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) { ctx.strokeStyle = 'rgba(143,176,255,' + (1 - d / 130) * .22 + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        var md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (md < 170) { ctx.strokeStyle = 'rgba(34,211,238,' + (1 - md / 170) * .5 + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = 'rgba(199,208,255,.7)'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill();
      }
    })();
  });

  // hero: an idea types itself, then becomes an app
  var demo = document.getElementById('demo');
  if (demo) {
    var ideas = [
      { t: 'An appointment app for my clinic', k: 'clinic', app: 'Clinic Care', a: 'Book a visit', b: "Today's queue", c: 'Patients this week' },
      { t: 'An ERP to run my factory floor', k: 'erp', app: 'Factory ERP', a: 'Production orders', b: 'Stock & materials', c: 'Output this month' },
      { t: 'A booking app for my salon', k: 'salon', app: 'Glow Salon', a: 'Pick a stylist', b: 'Open slots', c: 'Bookings this week' },
      { t: 'A delivery tracker for my shop', k: 'shop', app: 'QuickCart', a: 'New orders', b: 'Out for delivery', c: 'Sales this week' }
    ];
    var typed = demo.querySelector('.typed'), step = demo.querySelector('.ai-step'), devs = demo.querySelector('.devices'), idx = 0;
    function fill(o) {
      demo.querySelectorAll('[data-f]').forEach(function (el) { el.textContent = o[el.getAttribute('data-f')]; });
    }
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    async function run() {
      while (true) {
        var o = ideas[idx++ % ideas.length];
        devs.classList.remove('show'); step.textContent = 'Describe your idea';
        typed.textContent = '';
        await wait(500);
        for (var i = 0; i <= o.t.length; i++) { typed.textContent = o.t.slice(0, i); await wait(still ? 0 : 38); }
        step.textContent = 'Designing screens…'; await wait(900);
        step.textContent = 'Building with AI…'; fill(o); devs.classList.add('show'); await wait(1100);
        step.textContent = 'Tested · Ready to launch ✓'; await wait(3200);
      }
    }
    run();
  }

  // request forms -> WhatsApp or email
  document.querySelectorAll('form.req').forEach(function (f) {
    function bad(el, on) { el.closest('.field').classList.toggle('bad', on); }
    function check() {
      var ok = true, n = f.elements.name, ph = f.elements.phone, need = f.elements.need;
      var nb = n.value.trim().length < 2; bad(n, nb); if (nb) ok = false;
      var d = ph.value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
      var pb = !/^[6-9]\d{9}$/.test(d); bad(ph, pb); if (pb) ok = false;
      var wb = need && need.value.trim().length < 5; if (need) { bad(need, wb); if (wb) ok = false; }
      if (!ok) { (nb ? n : pb ? ph : need).focus(); return null; }
      return d;
    }
    ['name', 'phone', 'need'].forEach(function (k) { var el = f.elements[k]; if (el) el.addEventListener('input', function () { bad(el, false); }); });
    function text(d) {
      var v = function (k) { var el = f.elements[k]; if (!el) return ''; if (el.length && !el.tagName) { var c = [].filter.call(el, function (x) { return x.checked; }).map(function (x) { return x.value; }); return c.join(', '); } return (el.value || '').trim(); };
      var lines = ['Hello InstiQ Solutions, I have a project request.', 'Name: ' + v('name'), 'Mobile: ' + d];
      if (v('company')) lines.push('Business: ' + v('company'));
      if (v('kind')) lines.push('I need: ' + v('kind'));
      if (v('budget')) lines.push('Budget: ' + v('budget'));
      if (v('when')) lines.push('Timeline: ' + v('when'));
      if (v('need')) lines.push('About the idea: ' + v('need'));
      return lines.join('\n');
    }
    f.addEventListener('submit', function (e) { e.preventDefault(); var d = check(); if (d) window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text(d)), '_blank', 'noopener'); });
    var em = f.querySelector('[data-email]');
    if (em) em.addEventListener('click', function () { var d = check(); if (d) location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Project request') + '&body=' + encodeURIComponent(text(d)); });
  });

  // InstiQ price calculator
  var r = document.getElementById('students');
  if (r) {
    var sv = document.getElementById('sv'), pr = document.getElementById('price');
    // Slabs (17 Oct 2026): 1–500 ₹10, 501–1,000 ₹5, above 1,000 ₹3 per student a month.
    var slab = function (n) { return Math.min(n, 500) * 10 + Math.max(0, Math.min(n, 1000) - 500) * 5 + Math.max(0, n - 1000) * 3; };
    var calc = function () { var n = +r.value, p = slab(n); sv.textContent = n.toLocaleString('en-IN'); pr.textContent = '₹' + p.toLocaleString('en-IN') + ' / month'; };
    r.addEventListener('input', calc); calc();
  }

  // InstiQ tabs
  var tabs = [].slice.call(document.querySelectorAll('[role=tab]'));
  tabs.forEach(function (t, i) {
    function sel(x) { tabs.forEach(function (y) { var on = y === x; y.setAttribute('aria-selected', on); y.tabIndex = on ? 0 : -1; var p = document.getElementById(y.getAttribute('aria-controls')); p.hidden = !on; }); }
    t.addEventListener('click', function () { sel(t); });
    t.addEventListener('keydown', function (e) { var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (n) { var nt = tabs[(i + n + tabs.length) % tabs.length]; nt.focus(); nt.click(); } });
  });

  // video modal
  var modal = document.getElementById('modal');
  if (modal) {
    var mv = modal.querySelector('video');
    document.querySelectorAll('[data-video]').forEach(function (b) { b.addEventListener('click', function () { mv.src = b.getAttribute('data-video'); mv.poster = b.getAttribute('data-poster') || ''; modal.classList.add('open'); mv.play().catch(function () {}); }); });
    var close = function () { mv.pause(); modal.classList.remove('open'); };
    modal.querySelector('button').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
