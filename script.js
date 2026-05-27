"use strict";
let isScrollingProgrammatically = false;

// Every DOM Ref
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

// Navbar - sticky scroll + active link
function initNavbar() {
    const navbar = document.getElementById("navbar"); //getting Navbar from HTMl by DOM

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
// understand the part :)

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

// Mobile Menu
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

// Scroll Reveal
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

// SKILL BARS - animate on scroll
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

// Typing Effect - role text cycles

function initTypingEffect() {
    const roleEl = document.querySelector(".role-text");
    if (!roleEl) return;

    const roles = [
        "Front-End Developer",
        "React Specialist",
        // "UI/UX Enthusiast",
        // "Creative Coder",
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

    // Start after initial hero reveal
    setTimeout(type, 1600);
}

// PARALLAX — code floats move on mouse
function initParallaxCode() {
    const hero = document.querySelector(".hero");
    const codes = document.querySelectorAll(".code-float");

    if (!hero || !codes.length) return;

    let ticking = false;

    hero.addEventListener("mousemove", (e) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const rect = hero.getBoundingClientRect();
            const cx = (e.clientX - rect.left) / rect.width - 0.5;
            const cy = (e.clientY - rect.top) / rect.height - 0.5;

            codes.forEach((el, i) => {
                const depth = ((i % 3) + 1) * 6;
                el.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
            });

            ticking = false;
        });
    });

    hero.addEventListener("mouseleave", () => {
        codes.forEach((el) => {
            el.style.transform = "";
        });
    });
}

// CONTACT FORM
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const btn = form.querySelector(".form-submit");
        const original = btn.textContent;

        btn.textContent = "Sending…";
        btn.style.opacity = "0.7";
        btn.disabled = true;

        // Simulate send
        setTimeout(() => {
            btn.textContent = "✓ Message Sent!";
            btn.style.background = "#00a884";
            btn.style.opacity = "1";
            form.reset();

            setTimeout(() => {
                btn.textContent = original;
                btn.style.background = "";
                btn.disabled = false;
            }, 3500);
        }, 1200);
    });

    // Focus glow on inputs
    form.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("focus", () => {
            input.parentElement.style.setProperty("--focus", "1");
        });
        input.addEventListener("blur", () => {
            input.parentElement.style.removeProperty("--focus");
        });
    });
}

// SMOOTH SCROLL for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;
        e.preventDefault();

        const offset = 80;
        const top =
            target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top, behavior: "smooth" });
    });
});

// CURSOR TRAIL — subtle cyan dots
(function initCursorTrail() {
    const isMobile = () => window.innerWidth < 768;
    if (isMobile()) return;

    const dots = [];
    const COUNT = 6;

    for (let i = 0; i < COUNT; i++) {
        const dot = document.createElement("div");
        dot.style.cssText = `
      position: fixed;
      width: ${6 - i}px;
      height: ${6 - i}px;
      border-radius: 50%;
      background: rgba(0,229,192,${0.55 - i * 0.08});
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.05s;
      transform: translate(-50%,-50%);
      mix-blend-mode: screen;
    `;
        document.body.appendChild(dot);
        dots.push({ el: dot, x: 0, y: 0 });
    }

    let mouseX = 0,
        mouseY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animTrail() {
        let px = mouseX,
            py = mouseY;

        dots.forEach((dot, i) => {
            dot.x += (px - dot.x) * (0.35 - i * 0.04);
            dot.y += (py - dot.y) * (0.35 - i * 0.04);
            dot.el.style.left = dot.x + "px";
            dot.el.style.top = dot.y + "px";
            px = dot.x;
            py = dot.y;
        });

        requestAnimationFrame(animTrail);
    }

    animTrail();

    // Hide on interactive elements
    document.querySelectorAll("a, button, input, textarea").forEach((el) => {
        el.addEventListener("mouseenter", () =>
            dots.forEach((d) => (d.el.style.opacity = "0")),
        );
        el.addEventListener("mouseleave", () =>
            dots.forEach((d) => (d.el.style.opacity = "1")),
        );
    });
})();

// STATS COUNTER — animate numbers on scroll
function animateCounter(el, target, duration = 1800) {
    let start = null;

    function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + "+";

        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const nums = entry.target.querySelectorAll(".stat-num");
                nums.forEach((num) => {
                    const val = parseInt(num.textContent);
                    if (!isNaN(val)) animateCounter(num, val);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 },
);

const statsEl = document.querySelector(".hero-stats");
if (statsEl) statsObserver.observe(statsEl);
