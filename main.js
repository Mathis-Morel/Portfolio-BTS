/* Loader */
const loader = document.getElementById('loader');
window.addEventListener('load', () => loader?.classList.add('loaded'));

/* Thème */
const root = document.body;
const themeBtns = document.querySelectorAll('#themeToggle');
function setTheme(t){ 
    root.className = 'theme-'+t; 
    localStorage.setItem('siteTheme', t); 
}
setTheme(localStorage.getItem('siteTheme')||'dark');
themeBtns.forEach(b => b.addEventListener('click', () => 
    setTheme(root.classList.contains('theme-dark') ? 'light' : 'dark')
));

/* Progress & BackTop */
const pb = document.getElementById('progressBar'), bt = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{ 
    const s = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    pb && (pb.style.width = s/h*100+'%'); 
    bt && (bt.style.display = s>300 ? 'block' : 'none'); 
});
bt?.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

/* Sections & skill bars */
const sections = document.querySelectorAll('main section.card,.skill-bar');
const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        const el = entry.target;
        if(entry.isIntersecting){
            el.classList.add('visible');
            if(el.classList.contains('skill-bar') && !el.classList.contains('filled')){
                el.style.width = (el.dataset.level||0)+'%';
                el.classList.add('filled');
            }
        } else {
            el.classList.remove('visible');
        }
    });
},{threshold:0.18});
sections.forEach(el => observer.observe(el));

/* Sticky nav */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', ()=>nav?.classList.toggle('sticky', window.scrollY>150));

/* Veille */
const si = document.getElementById("searchInput"),
      ts = document.getElementById("themeSelect"),
      ac = document.getElementById("articlesContainer");
const articles = ac ? Array.from(ac.querySelectorAll(".article-card")) : [];

function updateArticles(){
    if(!articles.length) return;
    const q = si.value.toLowerCase(), t = ts.value;
    const visible = [];
    articles.forEach(a=>{
        const show = a.textContent.toLowerCase().includes(q) && (t==='all' || a.dataset.theme===t);
        a.style.display = show ? "block" : "none";
        if(show) visible.push(a);
    });
    // Trie par date
    visible.sort((a,b)=>new Date(b.querySelector(".article-date").textContent.replace(/‑/g,"-")) - 
                         new Date(a.querySelector(".article-date").textContent.replace(/‑/g,"-")));
    visible.forEach(a=>ac.appendChild(a));
}

// Filtre dynamiquement
if(ts) ts.addEventListener("change", updateArticles);
if(si) si.addEventListener("input", updateArticles);

// Scroll
function scrollToSection(sel, theme="all"){
    const target = document.querySelector(sel); 
    if(!target) return;
    if(target.querySelector("#articlesContainer") && si && ts){
        ts.value = theme; 
        si.value = "";
        updateArticles(); 
        const first = Array.from(ac.querySelectorAll(".article-card")).find(a=>a.style.display!=='none');
        if(first){
            window.scrollTo({top:first.getBoundingClientRect().top + window.scrollY - window.innerHeight/2 + first.offsetHeight/2, behavior:"smooth"});
            return;
        }
    }
    window.scrollTo({top: target.offsetTop - window.innerHeight/2 + target.offsetHeight/2, behavior:"smooth"});
}

// Navigation
document.querySelectorAll('nav a[href^="#"]').forEach(l=>l.addEventListener('click', e=>{
    e.preventDefault();
    const h = l.getAttribute('href');
    scrollToSection(
        h.includes("cybersecurite") || h.includes("reseau") ? "#mes-articles" : h,
        h.includes("cybersecurite") ? "cybersecurite" : h.includes("reseau") ? "reseau" : "all"
    );
}));

document.querySelectorAll(".theme-link").forEach(l=>l.addEventListener('click', e=>{
    e.preventDefault(); 
    scrollToSection("#mes-articles", l.dataset.theme);
}));

window.addEventListener("load", updateArticles);

/* Contact */
const form = document.getElementById('contactForm'), modal = document.getElementById('confirmModal');
if(form && modal){
    const closeBtns = [document.getElementById('modalClose'), document.getElementById('modalOk')];
    form.addEventListener('submit', e=>{
        e.preventDefault();
        fetch(form.action, {method: form.method, body: new FormData(form), headers:{'Accept':'application/json'}})
        .finally(()=>{ modal.setAttribute('aria-hidden','false'); modal.classList.add('open'); });
    });
    closeBtns.forEach(b=>b?.addEventListener('click', ()=>{ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }));
    modal.addEventListener('click', e=>{ if(e.target===modal){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }});
}
