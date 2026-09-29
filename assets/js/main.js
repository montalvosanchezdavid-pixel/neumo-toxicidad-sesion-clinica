(function(){
  "use strict";

  /* ---------- scroll progress bar ---------- */
  var progressBar = document.getElementById('scroll-progress');
  function updateProgressBar(){
    if(!progressBar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgressBar, { passive:true });
  updateProgressBar();

  /* ---------- hero tag pills: jump straight to that case ---------- */
  document.querySelectorAll('.tag-link[data-goto]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = document.getElementById(btn.getAttribute('data-goto'));
      if(target) target.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold:0.15 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------- referencias: tamaño, giro y posición pseudoaleatorios ---------- */
  function seedRnd(n){ var x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); }
  document.querySelectorAll('.ref-list .ref-item').forEach(function(el, i){
    var r1 = seedRnd(i * 3 + 1), r2 = seedRnd(i * 3 + 2), r3 = seedRnd(i * 3 + 3);
    var width = 56 + r1 * 36;
    var rot = (r2 - 0.5) * 4.5;
    var align = r3 < 0.4 ? 'flex-start' : (r3 < 0.78 ? 'flex-end' : 'center');
    el.style.setProperty('--ref-w', width.toFixed(1) + '%');
    el.style.setProperty('--ref-rot', rot.toFixed(2) + 'deg');
    el.style.alignSelf = align;
  });

  /* ---------- case-block accordion ---------- */
  document.querySelectorAll('.case-block').forEach(function(block){
    block.addEventListener('click', function(){ block.classList.toggle('open'); });
  });

  /* ---------- pm-collapse: solo se pliega en modo presentación ---------- */
  document.querySelectorAll('.pm-collapse-head').forEach(function(head){
    head.addEventListener('click', function(){
      head.closest('.pm-collapse').classList.toggle('open');
    });
  });

  /* ---------- lab-card counters (trigger once, on scroll into view) ---------- */
  var labIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var card = entry.target;
      labIo.unobserve(card);
      var target = parseFloat(card.getAttribute('data-target'));
      var decimals = parseInt(card.getAttribute('data-decimals') || '0', 10);
      var counterEl = card.querySelector('.counter');
      var barSpan = card.querySelector('.lab-bar > span');
      var fill = card.getAttribute('data-fill') || '80%';
      if(barSpan) setTimeout(function(){ barSpan.style.width = fill; }, 60);
      if(counterEl && !isNaN(target)){
        var start = null, dur = 650;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          var v = target * eased;
          counterEl.textContent = decimals > 0 ? v.toFixed(decimals) : Math.round(v);
          if(p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    });
  }, { threshold:0.3 });
  document.querySelectorAll('.lab-card[data-target]').forEach(function(c){ labIo.observe(c); });

  /* ---------- quiz: single choice ---------- */
  document.querySelectorAll('.quiz-step:not([data-multi])').forEach(function(step){
    var opts = step.querySelectorAll('.q-opt');
    var feedback = step.querySelector('.q-feedback');
    opts.forEach(function(opt){
      opt.addEventListener('click', function(){
        if(step.classList.contains('answered')) return;
        step.classList.add('answered');
        var isCorrect = opt.getAttribute('data-correct') === 'true';
        opt.classList.add(isCorrect ? 'chosen-right' : 'chosen-wrong');
        opts.forEach(function(o){
          o.classList.add('disabled');
          if(o !== opt && o.getAttribute('data-correct') === 'true') o.classList.add('chosen-right');
        });
        if(feedback) feedback.classList.add('show');
      });
    });
  });

  /* ---------- quiz: multiple choice ---------- */
  document.querySelectorAll('.quiz-step[data-multi]').forEach(function(step){
    var opts = step.querySelectorAll('.q-opt');
    var checkBtn = step.querySelector('.q-check');
    var feedback = step.querySelector('.q-feedback');
    opts.forEach(function(opt){
      opt.addEventListener('click', function(){
        if(step.classList.contains('answered')) return;
        opt.classList.toggle('is-pick');
      });
    });
    if(checkBtn){
      checkBtn.addEventListener('click', function(){
        if(step.classList.contains('answered')) return;
        step.classList.add('answered');
        opts.forEach(function(o){
          var right = o.getAttribute('data-correct') === 'true';
          var picked = o.classList.contains('is-pick');
          o.classList.remove('is-pick');
          o.classList.add('disabled');
          if(right) o.classList.add('chosen-right');
          if(picked && !right) o.classList.add('chosen-wrong');
        });
        checkBtn.hidden = true;
        if(feedback) feedback.classList.add('show');
      });
    }
  });

  /* ---------- wheel of 3: one centered, the other two small and behind ---------- */
  document.querySelectorAll('.wheel3').forEach(function(wheel){
    var items = Array.prototype.slice.call(wheel.querySelectorAll('.wheel3-item'));
    var active = 0;
    function render(){
      items.forEach(function(el, idx){
        el.classList.remove('is-active', 'is-left', 'is-right');
        if(idx === active) el.classList.add('is-active');
        else if(idx === (active + 1) % items.length) el.classList.add('is-right');
        else el.classList.add('is-left');
      });
    }
    items.forEach(function(el, idx){
      el.addEventListener('click', function(){
        if(idx === active) return;
        active = idx; render();
      });
    });
    render();
    /* al salir de la vista (subiendo o bajando), vuelve al estado inicial */
    var wheelIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting && active !== 0){ active = 0; render(); }
      });
    }, { threshold:0 });
    wheelIo.observe(wheel);
  });

  /* ---------- before/after image compare: drag to reveal, click to enlarge ---------- */
  document.querySelectorAll('.compare').forEach(function(box){
    var beforeImg = box.querySelector('.compare-before');
    var afterImg = box.querySelector('.compare-after');
    var handle = box.querySelector('.compare-handle');
    var pct = 50, dragging = false, moved = false, startX = 0, startY = 0;
    function pctFromClientX(clientX){
      var rect = box.getBoundingClientRect();
      return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    }
    function paint(p){
      pct = p;
      beforeImg.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }
    box.addEventListener('pointerdown', function(e){
      dragging = true; moved = false; startX = e.clientX; startY = e.clientY;
      box.setPointerCapture(e.pointerId);
    });
    box.addEventListener('pointermove', function(e){
      if(!dragging) return;
      if(!moved && (Math.abs(e.clientX - startX) > 4 || Math.abs(e.clientY - startY) > 4)) moved = true;
      if(moved) paint(pctFromClientX(e.clientX));
    });
    box.addEventListener('pointerup', function(e){
      if(dragging && !moved){
        var clickPct = pctFromClientX(e.clientX);
        openLightbox(clickPct <= pct ? beforeImg : afterImg);
      }
      dragging = false;
    });
    box.addEventListener('pointercancel', function(){ dragging = false; });
  });

  /* ---------- blind image reveal (caso 2) ---------- */
  document.querySelectorAll('.reveal-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var wrap = btn.closest('.wrap') || document;
      wrap.querySelectorAll('.reveal-label').forEach(function(l){ l.hidden = false; });
      var msg = wrap.querySelector('.reveal-msg');
      if(msg) msg.hidden = false;
      btn.hidden = true;
    });
  });

  /* ---------- comparison table rows ---------- */
  document.querySelectorAll('.cmp-row').forEach(function(row){
    row.addEventListener('click', function(){
      var idx = row.getAttribute('data-detail');
      var detail = document.getElementById('detail-' + idx);
      if(detail) detail.classList.toggle('show');
    });
  });

  /* ---------- flashcards ---------- */
  document.querySelectorAll('.flip-card').forEach(function(card){
    card.addEventListener('click', function(){ card.classList.toggle('flipped'); });
  });

  /* ---------- section dot navigation + keyboard ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section.slide'));
  var nav = document.getElementById('progress-nav');
  var dotButtons = [];
  sections.forEach(function(sec, i){
    var btn = document.createElement('button');
    btn.setAttribute('aria-label', sec.getAttribute('data-title') || ('Sección ' + (i + 1)));
    btn.title = sec.getAttribute('data-title') || '';
    var accent = getComputedStyle(sec).getPropertyValue('--c-case').trim();
    if(accent) btn.style.setProperty('--dot-c', accent);
    btn.addEventListener('click', function(){ sec.scrollIntoView({ behavior:'smooth', block:'start' }); });
    nav.appendChild(btn);
    dotButtons.push(btn);
  });

  function currentIndex(){
    var mid = window.scrollY + window.innerHeight / 2;
    var idx = 0;
    sections.forEach(function(sec, i){ if(sec.offsetTop <= mid) idx = i; });
    return idx;
  }
  function updateDots(){
    var idx = currentIndex();
    dotButtons.forEach(function(b, i){ b.classList.toggle('active', i === idx); });
  }
  function throttle(fn, wait){
    var last = 0;
    return function(){ var now = Date.now(); if(now - last >= wait){ last = now; fn(); } };
  }
  updateDots();
  window.addEventListener('scroll', throttle(updateDots, 100), { passive:true });

  function goToRelative(delta){
    var idx = currentIndex();
    var next = Math.min(Math.max(idx + delta, 0), sections.length - 1);
    sections[next].scrollIntoView({ behavior:'smooth', block:'start' });
  }
  window.addEventListener('keydown', function(e){
    if(e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;
    if(['ArrowDown','ArrowRight','PageDown'].indexOf(e.key) !== -1){ e.preventDefault(); goToRelative(1); }
    else if(['ArrowUp','ArrowLeft','PageUp'].indexOf(e.key) !== -1){ e.preventDefault(); goToRelative(-1); }
    else if(e.key === ' '){ e.preventDefault(); goToRelative(1); }
  });

  /* ---------- presentation mode toggle ---------- */
  var modeBtn = document.getElementById('btn-mode');
  modeBtn.addEventListener('click', function(){
    var on = document.body.classList.toggle('presentation-mode');
    modeBtn.classList.toggle('on', on);
    modeBtn.textContent = on ? 'Modo libre' : 'Modo presentación';
    if(on) fitSlides(); else resetSlideFit();
  });

  /* ---------- ajusta cada diapositiva para que quepa siempre entera en pantalla ---------- */
  var MIN_ZOOM = 0.5;
  function resetSlideFit(){
    document.querySelectorAll('section.slide').forEach(function(sec){
      var wrap = sec.querySelector('.wrap');
      if(wrap) wrap.style.transform = '';
      sec.classList.remove('pm-scroll-fallback');
    });
  }
  function fitSlides(){
    if(!document.body.classList.contains('presentation-mode')) return;
    document.querySelectorAll('section.slide').forEach(function(sec){
      var wrap = sec.querySelector('.wrap');
      if(!wrap) return;
      wrap.style.transform = '';
      sec.classList.remove('pm-scroll-fallback');
      var secStyle = getComputedStyle(sec);
      var available = sec.clientHeight - parseFloat(secStyle.paddingTop) - parseFloat(secStyle.paddingBottom);
      var natural = wrap.getBoundingClientRect().height;
      if(natural > available){
        var z = Math.max(MIN_ZOOM, available / natural);
        wrap.style.transform = 'scale(' + z + ')';
        if(wrap.getBoundingClientRect().height > available + 2){ sec.classList.add('pm-scroll-fallback'); }
      }
    });
  }
  var fitTimer = null;
  function scheduleFit(delay){
    if(!document.body.classList.contains('presentation-mode')) return;
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitSlides, delay || 150);
  }
  window.addEventListener('resize', function(){ scheduleFit(150); });
  /* recalcula si algo dentro de la diapositiva cambia de alto (desplegables, quiz, revelar);
     se espera a que termine la transición del acordeón antes de medir */
  document.addEventListener('click', function(e){
    if(e.target.closest('.pm-collapse-head, .case-block, .q-opt, .q-check, .reveal-btn, .cmp-row, .flip-card')) scheduleFit(450);
  });

  /* ---------- 20-minute timer (visible in top-controls) ---------- */
  var timerBtn = document.getElementById('timer-display');
  var left = 20 * 60, timerId = null;
  function paintTimer(){
    var neg = left < 0, v = Math.abs(left);
    timerBtn.textContent = (neg ? '+' : '') + Math.floor(v / 60) + ':' + String(v % 60).padStart(2, '0');
    timerBtn.setAttribute('data-warn', neg ? '1' : '0');
  }
  timerBtn.addEventListener('click', function(){
    if(timerId){ clearInterval(timerId); timerId = null; return; }
    timerId = setInterval(function(){ left--; paintTimer(); }, 1000);
  });
  paintTimer();

  /* ---------- image fallback: swap broken <img> for a "pendiente" note ---------- */
  document.querySelectorAll('img[data-slot]').forEach(function(img){
    img.addEventListener('error', function(){
      var card = img.closest('.img-card') || img.closest('.reveal-img');
      var name = img.getAttribute('src');
      var note = document.createElement('div');
      note.className = 'img-empty';
      note.innerHTML = 'Hueco para vuestra imagen.<br>Guardadla como <code>' + name + '</code>.';
      if(card){ card.innerHTML = ''; card.appendChild(note); }
    });
  });

  /* ---------- lightbox: click any clinical image to see it full-screen ---------- */
  var lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.innerHTML =
    '<div class="lb-toolbar">' +
      '<input class="lb-pen-size" type="range" min="1" max="10" value="3" step="1" aria-label="Grosor del rotulador" title="Grosor del rotulador">' +
      '<button class="lb-pen" type="button" aria-label="Rotulador" title="Rotulador: pinta sobre la imagen">✏️</button>' +
      '<button class="lb-clear" type="button" aria-label="Borrar trazos" title="Borrar lo pintado">🧹</button>' +
      '<button class="lb-close" aria-label="Cerrar">×</button>' +
    '</div>' +
    '<div class="lb-stage"><img alt=""><canvas class="lb-canvas"></canvas></div>' +
    '<div class="lb-caption"></div>';
  document.body.appendChild(lightbox);
  var lbStage = lightbox.querySelector('.lb-stage');
  var lbImg = lightbox.querySelector('img');
  var lbCanvas = lightbox.querySelector('.lb-canvas');
  var lbCtx = lbCanvas.getContext('2d');
  var lbCaption = lightbox.querySelector('.lb-caption');
  var lbPenBtn = lightbox.querySelector('.lb-pen');
  var lbClearBtn = lightbox.querySelector('.lb-clear');
  var lbSizeInput = lightbox.querySelector('.lb-pen-size');
  var penActive = false, drawing = false, lastX = 0, lastY = 0, penSize = 3;
  var inkHistory = [];

  function sizeCanvasToImage(){
    var r = lbImg.getBoundingClientRect();
    if(!r.width || !r.height) return;
    var dpr = window.devicePixelRatio || 1;
    lbCanvas.width = r.width * dpr;
    lbCanvas.height = r.height * dpr;
    lbCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function setPen(on){
    penActive = on;
    lightbox.classList.toggle('pen-active', penActive);
    lbPenBtn.classList.toggle('active', penActive);
  }
  function clearInk(){ lbCtx.clearRect(0, 0, lbCanvas.width, lbCanvas.height); inkHistory = []; }
  function pushHistory(){
    inkHistory.push(lbCtx.getImageData(0, 0, lbCanvas.width, lbCanvas.height));
    if(inkHistory.length > 25) inkHistory.shift();
  }
  function undoInk(){
    if(!inkHistory.length) return;
    var last = inkHistory.pop();
    lbCtx.putImageData(last, 0, 0);
  }

  function openLightbox(img){
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    lbCaption.innerHTML = img.getAttribute('data-finding') || img.alt || '';
    lightbox.classList.add('show');
    setPen(false);
    lbImg.onload = function(){ sizeCanvasToImage(); clearInk(); };
  }
  function closeLightbox(){
    lightbox.classList.remove('show');
    lbImg.src = '';
    setPen(false);
    clearInk();
  }
  lbStage.addEventListener('click', function(e){ e.stopPropagation(); });
  lightbox.querySelector('.lb-toolbar').addEventListener('click', function(e){ e.stopPropagation(); });
  lightbox.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lb-close').addEventListener('click', function(e){ e.stopPropagation(); closeLightbox(); });
  lbPenBtn.addEventListener('click', function(e){ e.stopPropagation(); setPen(!penActive); });
  lbClearBtn.addEventListener('click', function(e){ e.stopPropagation(); if(lbCanvas.width) pushHistory(); clearInk(); });
  lbSizeInput.addEventListener('input', function(){ penSize = parseFloat(lbSizeInput.value); });
  lbSizeInput.addEventListener('pointerdown', function(e){ e.stopPropagation(); });
  document.addEventListener('click', function(e){
    var img = e.target.closest('.img-card img, .ct-cell img, .reveal-img img');
    if(img){ e.stopPropagation(); openLightbox(img); }
  });
  window.addEventListener('keydown', function(e){
    if(!lightbox.classList.contains('show')) return;
    if(e.key === 'Escape') closeLightbox();
    else if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z'){ e.preventDefault(); undoInk(); }
  });
  window.addEventListener('resize', function(){ if(lightbox.classList.contains('show')) sizeCanvasToImage(); });

  function inkPos(e){
    var r = lbCanvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }
  lbCanvas.addEventListener('pointerdown', function(e){
    if(!penActive) return;
    drawing = true;
    pushHistory();
    var p = inkPos(e); lastX = p[0]; lastY = p[1];
    lbCtx.strokeStyle = 'rgba(255,209,70,.7)';
    lbCtx.lineWidth = penSize;
    lbCtx.lineCap = 'round';
    lbCtx.lineJoin = 'round';
    lbCtx.beginPath();
    lbCtx.moveTo(lastX, lastY);
    lbCtx.lineTo(lastX + 0.01, lastY + 0.01);
    lbCtx.stroke();
    lbCanvas.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });
  lbCanvas.addEventListener('pointermove', function(e){
    if(!drawing) return;
    var p = inkPos(e);
    lbCtx.beginPath();
    lbCtx.moveTo(lastX, lastY);
    lbCtx.lineTo(p[0], p[1]);
    lbCtx.stroke();
    lastX = p[0]; lastY = p[1];
    e.stopPropagation();
  });
  window.addEventListener('pointerup', function(){ drawing = false; });

  /* ---------- SVG hotspots: hover/tap a marked point for a short explanation ---------- */
  document.querySelectorAll('.mech-grid').forEach(function(grid){
    var tip = document.createElement('div');
    tip.className = 'svg-tip';
    grid.appendChild(tip);
    var hotspots = grid.querySelectorAll('.hotspot');
    function showTip(el){
      tip.textContent = el.getAttribute('data-tip');
      var gridRect = grid.getBoundingClientRect();
      var elRect = el.getBoundingClientRect();
      var x = elRect.left - gridRect.left + elRect.width / 2;
      var y = elRect.top - gridRect.top;
      tip.style.left = Math.min(Math.max(x - 90, 4), gridRect.width - 224) + 'px';
      tip.style.top = Math.max(y - 8, 0) + 'px';
      tip.classList.add('show');
    }
    function hideTip(){ tip.classList.remove('show'); }
    hotspots.forEach(function(h){
      h.addEventListener('mouseenter', function(){ showTip(h); });
      h.addEventListener('mouseleave', hideTip);
      h.addEventListener('click', function(e){ e.stopPropagation(); showTip(h); });
    });
    document.addEventListener('click', hideTip);
  });

})();
