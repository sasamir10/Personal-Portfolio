"use strict";

// ── DOM READY ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initScrollReveal();
    initSkillBars();
    initNavLinks();
    initMobileMenu();
    initContactForm();
    initTypingEffect();
    initParallaxCode();
});

// ═══════════════════════════════════════════════════════
// NAVBAR — sticky scroll + active link
// ═══════════════════════════════════════════════════════
function initNavbar() {
    const navbar = document.getElementById("navbar");

    window.addEventListener(
        "scroll",
        () => {
            if (window.scrollY > 60) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        },
        { passive: true },
    );
}

function initNavLinks() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav-link");

    const onScroll = () => {
        const scrollY = window.pageYOffset;

        sections.forEach((section) => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollY >= top && scrollY < bottom) {
                links.forEach((l) => l.classList.remove("active"));
                const active = document.querySelector(
                    `.nav-link[href="#${id}"]`,
                );
                if (active) active.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
}

// ═══════════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════════
function initMobileMenu() {
    const toggle = document.getElementById("navToggle");
    const navLinks = document.querySelector(".nav-links");

    if (!toggle || !navLinks) return;

    toggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        const isOpen = navLinks.classList.contains("open");
        toggle.setAttribute("aria-expanded", isOpen);

        // Animate hamburger → X
        const spans = toggle.querySelectorAll("span");
        if (isOpen) {
            spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
            spans[1].style.opacity = "0";
            spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
        } else {
            spans.forEach((s) => {
                s.style.transform = "";
                s.style.opacity = "";
            });
        }
    });

    // Close on link click
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            const spans = toggle.querySelectorAll("span");
            spans.forEach((s) => {
                s.style.transform = "";
                s.style.opacity = "";
            });
        });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
            navLinks.classList.remove("open");
            const spans = toggle.querySelectorAll("span");
            spans.forEach((s) => {
                s.style.transform = "";
                s.style.opacity = "";
            });
        }
    });
}

// ═══════════════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════════════
function initScrollReveal() {
    const targets = document.querySelectorAll(
        "[data-reveal], [data-reveal-right]",
    );

    if (!targets.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger siblings
                    const siblings = [
                        ...entry.target.parentElement.querySelectorAll(
                            "[data-reveal], [data-reveal-right]",
                        ),
                    ];
                    const idx = siblings.indexOf(entry.target);

                    setTimeout(() => {
                        entry.target.classList.add("visible");
                    }, idx * 100);

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -60px 0px",
        },
    );

    targets.forEach((el) => observer.observe(el));

    // Hero elements appear immediately on load
    setTimeout(() => {
        document
            .querySelectorAll(".hero [data-reveal], .hero [data-reveal-right]")
            .forEach((el) => {
                el.classList.add("visible");
            });
    }, 200);
}

// ═══════════════════════════════════════════════════════
// SKILL BARS — animate on scroll
// ═══════════════════════════════════════════════════════
function initSkillBars() {
    const fills = document.querySelectorAll(".skill-fill");

    if (!fills.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animated");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 },
    );

    fills.forEach((fill) => observer.observe(fill));
}

// ═══════════════════════════════════════════════════════
// TYPING EFFECT — role text cycles
// ═══════════════════════════════════════════════════════
function initTypingEffect() {
    const roleEl = document.querySelector(".role-text");
    if (!roleEl) return;

    const roles = [
        "Front-End Developer",
        // "UI/UX Enthusiast",
        // "React Specialist",
        "Creative Coder",
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function type() {
        const current = roles[roleIdx];

        if (!deleting) {
            roleEl.textContent = current.slice(0, charIdx + 1);
            charIdx++;

            if (charIdx === current.length) {
                // Pause then delete
                setTimeout(() => {
                    deleting = true;
                }, 2400);
                setTimeout(type, 2800);
                return;
            }
        } else {
            roleEl.textContent = current.slice(0, charIdx - 1);
            charIdx--;

            if (charIdx === 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
            }
        }

        const speed = deleting ? 40 : 80;
        setTimeout(type, speed);
    }

    // Start once hero-left reveal has finished (opacity transition), so we never
    // replace a full HTML string with a single letter. Fallback if no transition fires.