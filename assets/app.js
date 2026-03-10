const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

function trapFocus(container) {
  const items = $$('a,button,input,[tabindex]:not([tabindex="-1"])', container)
    .filter(el => !el.disabled && el.offsetParent !== null);
  if (!items.length) return () => {};
  const first = items[0];
  const last = items[items.length - 1];
  const handler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', handler);
  first.focus();
  return () => container.removeEventListener('keydown', handler);
}

function initLanguageMenus() {
  $$('.lang').forEach((wrap) => {
    const btn = $('.lang-toggle', wrap);
    btn?.addEventListener('click', () => wrap.classList.toggle('open'));
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang')) $$('.lang').forEach(l => l.classList.remove('open'));
  });
}

function initDrawer() {
  const drawer = $('.drawer');
  if (!drawer) return;
  const openBtn = $('.burger');
  const closeBtn = $('.drawer-close');
  const backdrop = $('.drawer-backdrop');
  let releaseTrap = () => {};

  const close = () => {
    drawer.classList.remove('open');
    document.body.classList.remove('lock');
    releaseTrap();
  };
  const open = () => {
    drawer.classList.add('open');
    document.body.classList.add('lock');
    releaseTrap = trapFocus($('.drawer-panel'));
  };

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  drawer.addEventListener('click', (e) => {
    if (e.target.matches('.drawer-nav a,.drawer .btn-primary')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      closeModal();
    }
  });
}

function initFaq() {
  $$('.faq-item').forEach((item) => {
    $('.faq-q', item)?.addEventListener('click', () => {
      $$('.faq-item').forEach(i => i.classList.remove('open'));
      item.classList.add('open');
    });
  });
}

const modal = () => $('#privacy-modal');
function closeModal(){
  const m = modal();
  if (!m) return;
  m.classList.remove('show');
  document.body.classList.remove('lock');
}
function initModal() {
  const m = modal();
  if (!m) return;
  const openers = $$('[data-open-privacy]');
  openers.forEach(o => o.addEventListener('click', (e) => {
    e.preventDefault();
    m.classList.add('show');
    document.body.classList.add('lock');
  }));
  $$('.modal-close-x,[data-close-modal],.modal-backdrop', m).forEach(c => c.addEventListener('click', closeModal));
}

function initReveal(){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.transform='translateY(0)';
        entry.target.style.opacity='1';
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});

  $$('[data-reveal]').forEach(el=>{
    el.style.transform='translateY(16px)';
    el.style.opacity='0';
    el.style.transition='opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
}

initLanguageMenus();
initDrawer();
initFaq();
initModal();
initReveal();
