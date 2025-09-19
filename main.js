

// year
document.getElementById('year').textContent = new Date().getFullYear();

// reveal on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); observer.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// counters
const counters = document.querySelectorAll('.counter');
const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target; const target = +el.dataset.target; let current = 0;
            const step = Math.ceil(target / 80);
            const id = setInterval(() => { current += step; if (current >= target) { current = target; clearInterval(id); } el.textContent = current.toLocaleString(); }, 20);
            counterObs.unobserve(el);
        }
    });
}, { threshold: .6 });
counters.forEach(c => counterObs.observe(c));

// MOBILE NAV drawer
const drawer = document.getElementById('drawer');
const scrim = document.getElementById('scrim');
const openBtn = document.getElementById('hamburger');
const closeBtn = document.getElementById('closeDrawer');
const toggleDrawer = (open) => { drawer.classList.toggle('open', open); scrim.classList.toggle('show', open); document.body.style.overflow = open ? 'hidden' : 'auto'; };
openBtn.addEventListener('click', () => toggleDrawer(true));
closeBtn.addEventListener('click', () => toggleDrawer(false));
scrim.addEventListener('click', () => toggleDrawer(false));
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));

// FEATURED CAROUSEL controls (scroll-snap based)
const carousel = document.querySelector('.carousel');
const track = carousel.querySelector('.carousel-track');
const prev = carousel.querySelector('.prev');
const next = carousel.querySelector('.next');
const scrollByAmount = () => Math.min(track.clientWidth * 0.95, 800);
prev.addEventListener('click', () => track.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }));
next.addEventListener('click', () => track.scrollBy({ left: scrollByAmount(), behavior: 'smooth' }));

// PARALLAX
const pxSections = document.querySelectorAll('.parallax');
const updateParallax = () => {
    pxSections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const speed = parseFloat(sec.dataset.speed || 0.25);
        const y = (r.top - window.innerHeight) * -speed; // move slower than scroll
        sec.style.setProperty('--py', y.toFixed(2) + 'px');
    });
};
updateParallax();
window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('resize', updateParallax);

// GALLERY: filter + lightbox
const filterButtons = document.querySelectorAll('#gallery .filters .btn');
const gItems = Array.from(document.querySelectorAll('.g-item'));
let activeFilter = 'all';
filterButtons.forEach(btn => btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    gItems.forEach(item => {
        const show = (activeFilter === 'all' || item.dataset.cat === activeFilter);
        item.style.display = show ? 'inline-block' : 'none';
    });
}));

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbClose = document.getElementById('lbClose');
let lbIndex = 0;
const visibleItems = () => gItems.filter(i => i.style.display !== 'none');
const openLb = (idx) => { lbIndex = idx; const items = visibleItems(); lbImg.src = items[lbIndex].querySelector('img').src; lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
const move = (dir) => { const items = visibleItems(); lbIndex = (lbIndex + dir + items.length) % items.length; lbImg.src = items[lbIndex].querySelector('img').src; };
const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = 'auto'; };

gItems.forEach((item) => item.addEventListener('click', () => openLb(visibleItems().indexOf(item))));
lbPrev.addEventListener('click', () => move(-1));
lbNext.addEventListener('click', () => move(1));
lbClose.addEventListener('click', closeLb);
document.addEventListener('keydown', (e) => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') move(-1); if (e.key === 'ArrowRight') move(1); });