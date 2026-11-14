/* Builds the page from content/site.json.
   The doctor edits that file through /admin; nothing here needs to change when content changes. */
(function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Only plain relative paths and http(s) links are allowed for images.
  function url(u) {
    u = String(u || '').trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) && !/^https?:/i.test(u)) return '';
    return u;
  }
  function el(id) { return document.getElementById(id); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function list(a) { return Array.isArray(a) ? a : []; }

  function secHead(d) {
    return '<div class="sec-head"><p class="eyebrow">' + esc(d.eyebrow) + '</p><h2>' + esc(d.heading) + '</h2>' +
      (d.intro ? '<p>' + esc(d.intro) + '</p>' : '') + '</div>';
  }

  function hero(d) {
    var h = d.hero || {};
    el('hero-copy').innerHTML =
      '<p class="eyebrow">' + esc(h.eyebrow) + '</p>' +
      '<h1>' + esc(h.headline) + (h.highlight ? ' <em>' + esc(h.highlight) + '</em>' : '') + '</h1>' +
      '<p class="lede">' + esc(h.lede) + '</p>' +
      '<div class="cta">' +
        (h.primary_button ? '<a class="btn" href="#contact">' + esc(h.primary_button) + '</a>' : '') +
        (h.secondary_button ? '<a class="btn ghost" href="#photography">' + esc(h.secondary_button) + '</a>' : '') +
      '</div>' +
      '<div class="facts">' + list(h.facts).map(function (f) {
        return '<span><b>' + esc(f.strong) + '</b> ' + esc(f.text) + '</span>';
      }).join('') + '</div>';
  }

  function about(d) {
    var a = d.about || {}, paras = list(a.paragraphs);
    var img = url(a.portrait);
    el('about-root').innerHTML =
      '<div class="portrait">' + (img ? '<img src="' + esc(img) + '" alt="' + esc(a.portrait_alt) + '" width="574" height="674">' : '') + '</div>' +
      '<div><p class="eyebrow">' + esc(a.eyebrow) + '</p>' +
      '<h2 class="h2-lg" style="margin:14px 0 22px">' + esc(a.heading) + '</h2>' +
      paras.map(function (p, i) { return '<p' + (i ? ' class="bio"' : '') + '>' + esc(p) + '</p>'; }).join('') +
      '<ul class="creds">' + list(a.details).map(function (x) {
        return '<li><time>' + esc(x.label) + '</time><span>' + esc(x.text) + '</span></li>';
      }).join('') + '</ul></div>';
  }

  function experience(d) {
    var e = d.experience || {};
    el('experience-root').innerHTML = secHead(e) +
      '<div class="ledger">' + list(e.items).map(function (x, i) {
        return '<article class="row"><span class="n">' + pad(i + 1) + '</span>' +
          '<div><h3>' + esc(x.title) + '</h3><p>' + esc(x.description) + '</p></div>' +
          '<div class="time"><b>' + esc(x.label) + '</b><span>' + esc(x.sublabel) + '</span></div></article>';
      }).join('') + '</div>';
  }

  function gallery(items) {
    var cases = [];
    items.forEach(function (g) { if (g.case && cases.indexOf(g.case) < 0) cases.push(g.case); });
    var chips = '';
    if (cases.length > 1) {
      chips = '<div class="chips" role="group" aria-label="Filter photos by case">' +
        '<button type="button" class="chip" data-case="" aria-pressed="true">All <span>' + items.length + '</span></button>' +
        cases.map(function (n) {
          var k = items.filter(function (g) { return g.case === n; }).length;
          return '<button type="button" class="chip" data-case="' + esc(n) + '" aria-pressed="false">' + esc(n) + ' <span>' + k + '</span></button>';
        }).join('') + '</div>';
    }
    return chips + '<ul class="gallery" id="gallery">' + items.map(function (g, i) {
      return '<li data-case="' + esc(g.case) + '"><button type="button" class="shot" data-i="' + i + '" aria-label="View larger: ' + esc(g.title) + '">' +
        '<img src="' + esc(url(g.image)) + '" alt="' + esc(g.alt || g.title) + '" width="1080" height="1350" loading="lazy" decoding="async">' +
        '</button><p class="shot-cap"><b>' + esc(g.title) + '</b>' + (g.case ? '<span>' + esc(g.case) + '</span>' : '') + '</p></li>';
    }).join('') + '</ul>';
  }

  function photography(d) {
    var p = d.photography || {};
    var shots = list(p.gallery).filter(function (g) { return url(g.image); });
    var cases = list(p.cases).filter(function (c) { return url(c.before) && url(c.after); });
    var body = '';
    if (shots.length) body += gallery(shots);
    if (cases.length) {
      body += '<div class="cases">' + cases.map(function (c) {
        var t = esc(c.title);
        return '<article class="case-card">' +
          '<div class="ba" style="--pos:50%">' +
            '<img src="' + esc(url(c.before)) + '" alt="Before: ' + t + '" loading="lazy">' +
            '<div class="after"><img src="' + esc(url(c.after)) + '" alt="After: ' + t + '" loading="lazy"></div>' +
            '<span class="tag l">Before</span><span class="tag r">After</span><div class="bar"></div>' +
            '<input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after: ' + t + '">' +
          '</div>' +
          '<h3>' + t + '</h3>' +
          (c.description ? '<p>' + esc(c.description) + '</p>' : '') +
          (c.details ? '<p class="meta">' + esc(c.details) + '</p>' : '') +
        '</article>';
      }).join('') + '</div>';
    }
    if (!shots.length && !cases.length) {
      body = '<div class="ph"><div class="ba" id="ba" style="--pos:50%">' +
        '<svg id="beforeSvg" viewBox="0 0 600 260" role="img" aria-label="Illustration of a smile before treatment"></svg>' +
        '<div class="after"><svg id="afterSvg" viewBox="0 0 600 260" role="img" aria-label="Illustration of a smile after treatment"></svg></div>' +
        '<span class="tag l">Before</span><span class="tag r">After</span><div class="bar"></div>' +
        '<input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after">' +
        '</div>' + (p.placeholder_caption ? '<p class="cap">' + esc(p.placeholder_caption) + '</p>' : '') + '</div>';
    }
    el('photography-root').innerHTML = secHead(p) + body;
  }

  function skills(d) {
    var s = d.skills || {};
    el('skills-root').innerHTML = secHead({ eyebrow: s.eyebrow, heading: s.heading }) +
      '<div class="skills">' + list(s.groups).map(function (g) {
        return '<div><h3>' + esc(g.title) + '</h3><ul>' + list(g.items).map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>';
  }

  function contact(d) {
    var c = d.contact || {};
    var rows = [];
    if (c.email) rows.push('<li><span>Email</span><a class="ltr" href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></li>');
    if (c.phone) rows.push('<li><span>Phone</span><a class="ltr" href="tel:' + esc(String(c.phone).replace(/\s+/g, '')) + '">' + esc(c.phone) + '</a></li>');
    if (c.location) rows.push('<li><span>Based in</span><span>' + esc(c.location) + '</span></li>');
    if (c.current) rows.push('<li><span>Currently</span><span>' + esc(c.current) + '</span></li>');
    el('contact-info').innerHTML = '<p class="eyebrow">' + esc(c.eyebrow) + '</p>' +
      '<h2 class="h2-lg" style="margin:14px 0 14px">' + esc(c.heading) + '</h2>' +
      (c.intro ? '<p class="intro">' + esc(c.intro) + '</p>' : '') +
      '<ul class="contact-list">' + rows.join('') + '</ul>';
  }

  function render(d) {
    window.SITE = d;
    if (d.seo) {
      if (d.seo.title) document.title = d.seo.title;
      var m = document.querySelector('meta[name="description"]');
      if (m && d.seo.description) m.setAttribute('content', d.seo.description);
    }
    if (d.brand) el('brand-name').textContent = d.brand;
    hero(d); about(d); experience(d); photography(d); skills(d); contact(d);
    if (d.footer) { el('footer-left').textContent = d.footer.left || ''; el('footer-right').textContent = d.footer.right || ''; }
  }

  function fail() {
    el('top').insertAdjacentHTML('afterbegin',
      '<p class="load-error">The page content could not be loaded. If you opened this file directly from your computer, run a local web server in this folder (see README), or upload the site to a host.</p>');
  }

  fetch('content/site.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) { render(d); if (window.initPage) window.initPage(); })
    .catch(fail);
})();
