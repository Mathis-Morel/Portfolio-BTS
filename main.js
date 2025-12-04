/* ===================== main.js ===================== */

/* --- Loader --- */
const loader = document.getElementById('loader');
function hideLoader() {
    if(loader) loader.classList.add('loaded');
}
window.addEventListener('load', hideLoader);
// Fallback pour cacher le loader après 3s max
setTimeout(hideLoader, 3000);

/* --- Theme clair/sombre --- */
const themeToggleBtns = document.querySelectorAll('#themeToggle'); // tous les boutons
function setTheme(t) {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add('theme-' + t);
    localStorage.setItem('siteTheme', t);
}
const savedTheme = localStorage.getItem('siteTheme') || 'dark';
setTheme(savedTheme);

themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
        setTheme(next);
    });
});

/* --- Sections apparition/disparition au scroll --- */
const sections = document.querySelectorAll('main section.card');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('visible');
        else entry.target.classList.remove('visible');
    });
}, { threshold: 0.2 });
sections.forEach(sec => observer.observe(sec));

/* --- Barre de navigation toujours en haut (sticky) --- */
/* Déjà géré par CSS: nav { position: sticky; top:0; } */

/* --- Back to top button --- */
const backBtn = document.getElementById('backToTop');
function toggleBackBtn() {
    if(!backBtn) return;
    backBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
}
window.addEventListener('scroll', toggleBackBtn);
if(backBtn) backBtn.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:'smooth'});
});

/* --- Smooth scroll centré pour nav links --- */
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if(!target) return;
        window.scrollTo({
            top: target.offsetTop - window.innerHeight/2 + target.offsetHeight/2,
            behavior: 'smooth'
        });
    });
});

/* --- Skill bars animation --- */
const skillBars = document.querySelectorAll('.skill-bar');
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const bar = entry.target;
            const level = bar.getAttribute('data-level') || '0';
            bar.style.setProperty('--level', level + '%');
            bar.classList.add('filled');
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.25 });
skillBars.forEach(b => skillObserver.observe(b));

/* --- Scroll down button (dans header) --- */
const scrollDownBtn = document.getElementById('scrollDown');
if(scrollDownBtn){
    scrollDownBtn.addEventListener('click', () => {
        const first = document.querySelector('main section.card');
        if(first) window.scrollTo({top: first.offsetTop - 40, behavior:'smooth'});
    });
}

/* --- Formulaire contact: modal confirmation --- */
const form = document.getElementById('contactForm');
const modal = document.getElementById('confirmModal');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');

if(form && modal){
    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        fetch(form.action, { method: form.method, body: data, headers: {'Accept':'application/json'} })
        .finally(() => {
            modal.setAttribute('aria-hidden', 'false');
            modal.classList.add('open');
        });
    });
    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }
    modalClose?.addEventListener('click', closeModal);
    modalOk?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
}
