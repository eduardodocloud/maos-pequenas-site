/* =======================================
 MÃOS PEQUENAS — JS Principal
======================================= */

document.addEventListener('DOMContentLoaded', function () {

 /* --- Menu Mobile --- */
 const hamburger = document.getElementById('hamburger');
 const nav = document.getElementById('main-nav');
 if (hamburger && nav) {
 hamburger.addEventListener('click', function () {
 const isOpen = nav.classList.toggle('open');
 hamburger.setAttribute('aria-expanded', isOpen);
 });
 // Fechar ao clicar fora
 document.addEventListener('click', function (e) {
 if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
 nav.classList.remove('open');
 hamburger.setAttribute('aria-expanded', 'false');
 }
 });
 }

 /* --- Header scroll shadow --- */
 const header = document.getElementById('site-header');
 if (header) {
 window.addEventListener('scroll', function () {
 header.style.boxShadow = window.scrollY > 20
 ? '0 4px 24px rgba(0,0,0,0.12)'
 : '0 2px 16px rgba(0,0,0,0.08)';
 });
 }

 /* --- Smooth scroll para âncoras --- */
 document.querySelectorAll('a[href*="#"]').forEach(function (link) {
 link.addEventListener('click', function (e) {
 const href = link.getAttribute('href');
 const hash = href.split('#')[1];
 if (!hash) return;
 const target = document.getElementById(hash);
 if (target) {
 e.preventDefault();
 const offset = 90;
 const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
 window.scrollTo({ top: top, behavior: 'smooth' });
 }
 });
 });

 /* --- Contador de números animado --- */
 function animateCounter(el) {
 const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, '')) || 0;
 const suffix = el.textContent.replace(/\d/g, '').replace('+','').replace('%','');
 const prefix = el.textContent.includes('+') ? '+' : (el.textContent.includes('%') ? '' : '');
 const pct = el.textContent.includes('%') ? '%' : '';
 const duration = 1800;
 const steps = 60;
 const step = target / steps;
 let current = 0;
 const timer = setInterval(function () {
 current += step;
 if (current >= target) {
 current = target;
 clearInterval(timer);
 }
 el.textContent = prefix + Math.floor(current) + pct;
 }, duration / steps);
 }

 const counters = document.querySelectorAll('.impact-number');
 if (counters.length && 'IntersectionObserver' in window) {
 const io = new IntersectionObserver(function (entries) {
 entries.forEach(function (entry) {
 if (entry.isIntersecting) {
 animateCounter(entry.target);
 io.unobserve(entry.target);
 }
 });
 }, { threshold: 0.4 });
 counters.forEach(function (c) { io.observe(c); });
 }

 /* --- Formulário de Contato (AJAX) --- */
 const contactForm = document.getElementById('contactForm');
 if (contactForm) {
 contactForm.addEventListener('submit', function (e) {
 e.preventDefault();
 const btn = document.getElementById('contact-submit');
 const feedback = document.getElementById('form-feedback');
 const data = new FormData(contactForm);
 data.append('action', 'mp_contact');
 data.append('nonce', contactForm.querySelector('[name="_mp_nonce"]')?.value || '');

 btn.disabled = true;
 btn.textContent = 'Enviando…';

 fetch(mpData?.ajaxUrl || '/wp-admin/admin-ajax.php', {
 method: 'POST',
 body: data,
 })
 .then(function (r) { return r.json(); })
 .then(function (res) {
 feedback.style.display = 'block';
 feedback.style.background = res.success ? '#D4EDDA' : '#F8D7DA';
 feedback.style.color = res.success ? '#155724' : '#721C24';
 feedback.textContent = res.data;
 if (res.success) contactForm.reset();
 })
 .catch(function () {
 feedback.style.display = 'block';
 feedback.style.background = '#F8D7DA';
 feedback.style.color = '#721C24';
 feedback.textContent = 'Erro ao enviar. Tente pelo WhatsApp.';
 })
 .finally(function () {
 btn.disabled = false;
 btn.textContent = 'Enviar Mensagem';
 });
 });
 }

 /* --- Copiar chave PIX --- */
 document.querySelectorAll('.pix-box .cnpj').forEach(function (el) {
 el.style.cursor = 'pointer';
 el.title = 'Clique para copiar';
 el.addEventListener('click', function () {
 navigator.clipboard.writeText(el.textContent.trim()).then(function () {
 const orig = el.textContent;
 el.textContent = 'Copiado!';
 setTimeout(function () { el.textContent = orig; }, 2000);
 });
 });
 });

 /* --- Hero slider rotativo --- */
 const slider = document.querySelector('[data-slider]');
 if (slider) {
 const slides = slider.querySelectorAll('.hero-slide');
 const dots = slider.querySelectorAll('.hero-dot');
 if (slides.length > 1) {
 let current = 0;
 function showSlide(i) {
 slides.forEach(function (s, idx) {
 s.classList.toggle('is-active', idx === i);
 });
 dots.forEach(function (d, idx) {
 d.classList.toggle('is-active', idx === i);
 d.setAttribute('aria-selected', idx === i ? 'true' : 'false');
 });
 current = i;
 }
 dots.forEach(function (d, idx) {
 d.addEventListener('click', function () { showSlide(idx); restart(); });
 });
 let timer;
 function next() { showSlide((current + 1) % slides.length); }
 function start() { timer = setInterval(next, 6500); }
 function restart() { clearInterval(timer); start(); }
 start();
 // Pausa ao passar mouse
 slider.addEventListener('mouseenter', function () { clearInterval(timer); });
 slider.addEventListener('mouseleave', start);
 }
 }

 /* --- Form Voluntário --- */
 function bindAjaxForm(formId, action, submitText) {
 const form = document.getElementById(formId);
 if (!form) return;
 form.addEventListener('submit', function (e) {
 e.preventDefault();
 const btn = form.querySelector('[type="submit"]');
 const feedback = form.querySelector('.form-feedback');
 const origTxt = btn.textContent;
 const data = new FormData(form);
 data.append('action', action);
 data.append('nonce', form.querySelector('[name="_mp_nonce"]')?.value || '');
 btn.disabled = true;
 btn.textContent = 'Enviando…';
 fetch(mpData?.ajaxUrl || '/wp-admin/admin-ajax.php', { method:'POST', body:data })
 .then(function(r){ return r.json(); })
 .then(function(res){
 if (feedback) {
 feedback.style.display = 'block';
 feedback.style.background = res.success ? '#D4EDDA' : '#F8D7DA';
 feedback.style.color = res.success ? '#155724' : '#721C24';
 feedback.textContent = res.data;
 }
 if (res.success) form.reset();
 })
 .catch(function(){
 if (feedback) {
 feedback.style.display = 'block';
 feedback.style.background = '#F8D7DA';
 feedback.style.color = '#721C24';
 feedback.textContent = 'Erro de conexão. Tente novamente.';
 }
 })
 .finally(function(){
 btn.disabled = false;
 btn.textContent = submitText || origTxt;
 });
 });
 }
 bindAjaxForm('voluntarioForm', 'mp_voluntario', 'Enviar Inscrição');
 bindAjaxForm('parceiroForm', 'mp_parceiro', 'Enviar Proposta');

  /* --- Modal de visualização de documento (view-only) ---
     Usa PDF.js (Mozilla) hospedado localmente em /assets/pdfjs/web/viewer.html.
     PDF.js renderiza o PDF em canvas — não depende do plugin nativo do browser
     que estava sendo bloqueado pelo Chrome. */
  const docModal = document.getElementById('docModal');
  if (docModal) {
    const docBody    = document.getElementById('docModalBody');
    const docTitle   = document.getElementById('docModalTitle');
    const pdfJsViewer = (window.mpData && window.mpData.pdfjsViewer) || '/wp-content/themes/maos-pequenas/assets/pdfjs/web/viewer.html';

    function openDoc(url, title) {
      docTitle.textContent = title || 'Documento';
      docBody.innerHTML = '<div class="doc-loading">Carregando documento…</div>';

      // Aponta o viewer do PDF.js para o nosso endpoint /doc/{slug}/
      // Parâmetros do hash escondem botões de download/print/open
      const viewerUrl = pdfJsViewer
        + '?file=' + encodeURIComponent(url)
        + '#zoom=page-width';

      docBody.innerHTML =
        '<iframe src="' + viewerUrl + '" ' +
        'title="' + (title||'Documento') + '" ' +
        'allowfullscreen></iframe>';

      docModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeDoc() {
      docModal.setAttribute('aria-hidden', 'true');
      docBody.innerHTML = '';
      document.body.style.overflow = '';
    }
    document.querySelectorAll('button.doc-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const url = btn.dataset.docUrl;
        const ttl = btn.dataset.docTitle;
        if (url) openDoc(url, ttl);
      });
    });
    docModal.querySelectorAll('[data-doc-close]').forEach(function (el) {
      el.addEventListener('click', closeDoc);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && docModal.getAttribute('aria-hidden') === 'false') closeDoc();
    });
    docModal.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && ['s','p','S','P'].includes(e.key)) {
        e.preventDefault();
      }
    });
  }

 /* --- Fade-in suave APENAS para elementos abaixo da fold inicial --- */
 if ('IntersectionObserver' in window) {
 const fadeTargets = document.querySelectorAll(
 '.section-title, .section-desc, .section-label, ' +
 '.how-card, .help-card, .blog-card, .doc-card, .parceiro-logo, ' +
 '.about-home-content > *, .impact-item'
 );
 const viewportH = window.innerHeight;
 fadeTargets.forEach(el => {
 const rect = el.getBoundingClientRect();
 // Se já visível no carregamento → não anima
 if (rect.top < viewportH - 50) return;
 el.style.opacity = '0';
 el.style.transform = 'translateY(14px)';
 el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
 el.dataset.fade = '1';
 });
 const obs = new IntersectionObserver((entries) => {
 entries.forEach((e, i) => {
 if (e.isIntersecting && e.target.dataset.fade) {
 setTimeout(() => {
 e.target.style.opacity = '1';
 e.target.style.transform = 'translateY(0)';
 }, (i % 3) * 70);
 obs.unobserve(e.target);
 }
 });
 }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
 fadeTargets.forEach(el => { if (el.dataset.fade) obs.observe(el); });
 }

});
