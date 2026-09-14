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

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold:0.15 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------- case-block accordion ---------- */
  document.querySelectorAll('.case-block').forEach(function(block){
    block.addEventListener('click', function(){ block.classList.toggle('open'); });
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

})();
