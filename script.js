// Yamegu sitesi. App Store düğmeleri her zaman açık (29 Ekim 2026'dan beri yayında).
// Oyun Google Play'de herkese açılınca LIVE = true yap: Play düğmeleri mağazaya gider, "Coming soon" yazıları kalkar.
const LIVE = true;

document.addEventListener('DOMContentLoaded', () => {
    // Google Play düğmeleri
    if (!LIVE) {
        // Üst çubukta yer dar: Play açılana kadar yalnız App Store düğmesi
        document.querySelector('[data-play-head]')?.remove();
        document.querySelectorAll('[data-play]').forEach(a => {
            a.setAttribute('aria-disabled', 'true');
            a.removeAttribute('href');
            const small = a.querySelector('[data-play-small]');
            if (small) small.textContent = 'Coming soon to';
            else a.querySelector('[data-play-label]').textContent = 'Coming soon';
        });
    } else {
        const note = document.querySelector('[data-play-note]');
        if (note) note.textContent = 'Free on the App Store and Google Play.';
    }

    // Videolar yalnızca ekrandayken oynar (veri ve pil tasarrufu); hareket azaltma açıksa kendiliğinden başlamaz
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vids = [...document.querySelectorAll('video[data-auto]')];
    if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver(entries => entries.forEach(e => {
            const v = e.target;
            if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
        }), { threshold: 0.35 });
        vids.forEach(v => io.observe(v));
    }

    // Ses düğmesi: aynı anda tek video sesli
    document.querySelectorAll('[data-sound]').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => {
            const v = btn.parentElement.querySelector('video');
            const on = v.muted;
            document.querySelectorAll('[data-sound]').forEach(b => {
                const o = b.parentElement.querySelector('video');
                o.muted = true; b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'Turn sound on');
            });
            if (on) {
                v.muted = false; v.currentTime = 0; v.play().catch(() => {});
                btn.setAttribute('aria-pressed', 'true'); btn.setAttribute('aria-label', 'Turn sound off');
            }
        });
    });

    // Fragman (sitede barındırılan dosya): tıklanınca oynar
    document.querySelectorAll('[data-video]').forEach(box => {
        box.querySelector('button').addEventListener('click', () => {
            const v = document.createElement('video');
            v.src = box.dataset.video; v.controls = true; v.autoplay = true; v.playsInline = true;
            v.poster = box.querySelector('img').src;
            v.setAttribute('aria-label', 'Yamegu: Island Mahjong trailer');
            box.querySelector('button').replaceWith(v);
            v.play().catch(() => {}); v.focus();
        });
    });

    // Fragman: tıklanana kadar YouTube'a bağlanılmaz
    document.querySelectorAll('[data-yt]').forEach(box => {
        box.querySelector('button').addEventListener('click', () => {
            const f = document.createElement('iframe');
            f.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0`;
            f.title = 'Yamegu: Island Mahjong trailer';
            f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            f.allowFullscreen = true;
            box.querySelector('button').replaceWith(f);
            box.querySelector('.yt-note')?.remove();
            f.focus();
        });
    });
});
