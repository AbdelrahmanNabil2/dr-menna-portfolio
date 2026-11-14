/* Behaviour that does not depend on the editable content: shade matcher, before/after sliders, message form.
   content.js builds the page from content/site.json and then calls window.initPage(). */
(function () {
  var ui = {
    stepsFrom: function (n) { return n + (n === 1 ? ' step' : ' steps') + ' from the lightest shade'; },
    lightestShade: 'The lightest shade on the guide', shadeLabel: 'Shade ',
    missing: 'Add your name and a valid email so Dr. Menna can reply.',
    name: 'Name', email: 'Email', topic: 'Topic', msg: 'Message',
    copy: 'Copy message', copied: 'Copied', manual: 'Select the text and copy it'
  };
  function site() { return window.SITE || {}; }

  /* ---------- Shade matcher (VITA Classical order, lightest to darkest) ---------- */
  var shades = [
    ['B1','#F4EFE3'],['A1','#F0E6D0'],['B2','#EBDFC3'],['D2','#E8DCC9'],
    ['A2','#E6D5AE'],['C1','#E3D8BE'],['C2','#D9C9A2'],['D4','#D6C9B2'],
    ['A3','#DEC794'],['D3','#DDCDB0'],['B3','#DCC38C'],['A3.5','#D3B77F'],
    ['B4','#D0B176'],['C3','#CBB38A'],['A4','#C4A56F'],['C4','#B79F78']
  ];
  var scale = document.getElementById('scale');
  var fill = document.getElementById('toothFill');
  var nameEl = document.getElementById('shadeName');
  var infoEl = document.getElementById('shadeInfo');
  var buttons = [];
  function pick(i) {
    fill.setAttribute('fill', shades[i][1]);
    nameEl.textContent = shades[i][0];
    infoEl.textContent = i === 0 ? ui.lightestShade : ui.stepsFrom(i);
    buttons.forEach(function (b, k) {
      b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
      b.setAttribute('aria-label', ui.shadeLabel + shades[k][0]);
    });
  }
  shades.forEach(function (s, i) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.style.background = s[1];
    b.title = s[0];
    b.addEventListener('click', function () { pick(i); });
    li.appendChild(b); scale.appendChild(li); buttons.push(b);
  });
  pick(8);

  /* ---------- Before / after sliders (works for every slider on the page) ---------- */
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches('.ba input[type="range"]')) t.closest('.ba').style.setProperty('--pos', t.value + '%');
  });

  /* ---------- Illustration shown until real case photos are added ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  var widths  = [40,46,44,56,56,44,46,40];
  var heights = [66,74,82,98,98,82,74,66];
  var beforeCols = ['#D0B176','#C4A56F','#D3B77F','#CBB38A','#C9AC72','#C4A56F','#D8BE86','#D0B176'];
  function node(n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; }
  function smile(svg, mode) {
    svg.appendChild(node('rect', { width: 600, height: 260, fill: '#2A161C' }));
    var gap = 4, total = widths.reduce(function (a, b) { return a + b; }, 0) + gap * 7;
    var x = (600 - total) / 2, top = 40;
    widths.forEach(function (w, i) {
      var h = heights[i], r = Math.min(20, w / 2.2), y = top, b = y + h;
      var d = 'M' + x + ' ' + y + 'H' + (x + w) + 'V' + (b - r) + 'Q' + (x + w) + ' ' + b + ' ' + (x + w - r) + ' ' + b +
              'H' + (x + r) + 'Q' + x + ' ' + b + ' ' + x + ' ' + (b - r) + 'Z';
      var col = mode === 'after' ? (i % 2 ? '#F1EADB' : '#F4EFE3') : beforeCols[i];
      svg.appendChild(node('path', { d: d, fill: col }));
      if (mode === 'before') {
        svg.appendChild(node('rect', { x: x, y: y + 18, width: w, height: 26, fill: 'rgba(110,70,15,.22)' }));
        if (i === 4) svg.appendChild(node('path', { d: 'M' + (x + w) + ' ' + (b - 30) + 'L' + (x + w - 17) + ' ' + b + 'L' + (x + w) + ' ' + b + 'Z', fill: '#2A161C' }));
      } else {
        svg.appendChild(node('rect', { x: x + 6, y: y + 24, width: 5, height: h - 54, rx: 2.5, fill: 'rgba(255,255,255,.55)' }));
      }
      x += w + gap;
    });
    svg.appendChild(node('path', { d: 'M0 0H600V70Q540 96 470 82Q400 104 300 104Q200 104 130 82Q60 96 0 70Z', fill: '#C96F7C' }));
    svg.appendChild(node('path', { d: 'M0 0H600V34Q430 72 300 72Q170 72 0 34Z', fill: '#9C4A58' }));
    svg.appendChild(node('path', { d: 'M0 260V214Q170 262 300 262Q430 262 600 214V260Z', fill: '#9C4A58' }));
  }
  function drawSmiles() {
    var b = document.getElementById('beforeSvg'), a = document.getElementById('afterSvg');
    if (b && a && !b.firstChild) { smile(b, 'before'); smile(a, 'after'); }
  }

  /* ---------- Nav highlight while scrolling ---------- */
  function watchSections() {
    var links = {};
    Array.prototype.forEach.call(document.querySelectorAll('#nav a'), function (a) { links[a.getAttribute('href').slice(1)] = a; });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        for (var k in links) links[k].removeAttribute('aria-current');
        if (links[e.target.id]) links[e.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Contact form: builds an email, never claims it was sent ---------- */
  var form = document.getElementById('req'), out = document.getElementById('out');
  var outText = document.getElementById('outText'), outHelp = document.getElementById('outHelp');
  var actions = document.getElementById('outActions'), mailBtn = document.getElementById('mailBtn'), copyBtn = document.getElementById('copyBtn');
  var fName = document.getElementById('fName'), fEmail = document.getElementById('fEmail');
  function sel(id) { var s = document.getElementById(id); return s.options[s.selectedIndex].textContent; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = fName.value.trim(), email = fEmail.value.trim();
    var okEmail = /^\S+@\S+\.\S+$/.test(email);
    fName.setAttribute('aria-invalid', name ? 'false' : 'true');
    fEmail.setAttribute('aria-invalid', okEmail ? 'false' : 'true');
    out.className = 'on';
    if (!name || !okEmail) { outText.textContent = ui.missing; outHelp.style.display = 'none'; actions.style.display = 'none'; return; }
    outHelp.style.display = ''; actions.style.display = ''; copyBtn.textContent = ui.copy;
    var note = document.getElementById('fNote').value.trim();
    var who = site().brand || 'the doctor';
    outText.textContent = 'Message for ' + who + '\n' + ui.name + ': ' + name + '\n' + ui.email + ': ' + email + '\n' +
      ui.topic + ': ' + sel('fTopic') + (note ? '\n' + ui.msg + ': ' + note : '');
    var to = (site().contact && site().contact.email) || '';
    mailBtn.href = 'mailto:' + to + '?subject=' + encodeURIComponent(sel('fTopic') + ' (portfolio message)') + '&body=' + encodeURIComponent(outText.textContent);
  });
  copyBtn.addEventListener('click', function () {
    try {
      navigator.clipboard.writeText(outText.textContent).then(function () { copyBtn.textContent = ui.copied; }, function () { copyBtn.textContent = ui.manual; });
    } catch (err) { copyBtn.textContent = ui.manual; }
  });


  /* mobile menu */
  (function () {
    var btn = document.getElementById('menuBtn'), header = document.querySelector('header.top');
    if (!btn || !header) return;
    function set(open) {
      header.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    btn.addEventListener('click', function () { set(!header.classList.contains('open')); });
    document.getElementById('siteNav').addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && header.classList.contains('open')) { set(false); btn.focus(); } });
    document.addEventListener('click', function (e) { if (!header.contains(e.target)) set(false); });
    window.matchMedia('(min-width: 761px)').addEventListener('change', function () { set(false); });
  })();

  /* photo gallery: case filter + full-screen viewer */
  function initGallery() {
    var grid = document.getElementById('gallery');
    if (!grid) return;
    var dlg = document.getElementById('lightbox'), img = document.getElementById('lbImg');
    var current = 0, shown = [];

    function visibleShots() {
      return Array.prototype.filter.call(grid.querySelectorAll('li'), function (li) { return !li.hidden; })
        .map(function (li) { return li.querySelector('.shot'); });
    }
    document.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var c = chip.getAttribute('data-case');
        document.querySelectorAll('.chip').forEach(function (x) { x.setAttribute('aria-pressed', x === chip ? 'true' : 'false'); });
        grid.querySelectorAll('li').forEach(function (li) { li.hidden = !!c && li.getAttribute('data-case') !== c; });
      });
    });

    function show(i) {
      if (!shown.length) return;
      current = (i + shown.length) % shown.length;
      var b = shown[current], pic = b.querySelector('img'), cap = b.parentNode.querySelector('.shot-cap');
      img.src = pic.currentSrc || pic.src;
      img.alt = pic.alt;
      document.getElementById('lbTitle').textContent = cap.querySelector('b').textContent;
      var sp = cap.querySelector('span'); document.getElementById('lbCase').textContent = sp ? sp.textContent : '';
      document.getElementById('lbCount').textContent = (current + 1) + ' of ' + shown.length;
      var multi = shown.length > 1;
      document.getElementById('lbPrev').hidden = !multi; document.getElementById('lbNext').hidden = !multi;
      if (multi) { new Image().src = shown[(current + 1) % shown.length].querySelector('img').src; }
    }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.shot'); if (!b) return;
      shown = visibleShots(); show(shown.indexOf(b));
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      document.documentElement.classList.add('lb-open');
    });
    function close() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
    dlg.addEventListener('close', function () { document.documentElement.classList.remove('lb-open'); });
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
    var x0 = null, y0 = null, fig = document.getElementById('lbFig');
    fig.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    fig.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  window.initPage = function () { drawSmiles(); watchSections(); initGallery(); };
})();
