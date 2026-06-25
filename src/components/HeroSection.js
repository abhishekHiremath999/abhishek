import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import me from "../assets/me.png";
import hoverImg from "../assets/i.png";
import "./Hero.css";
// import "./Hero.mobile.css";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   TEXT SCRAMBLE ENGINE
══════════════════════════════════════ */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const promise = new Promise((res) => (this.resolve = res));
    this.queue = [...newText].map((to) => ({
      to,
      start: Math.floor(Math.random() * 22),
      end: Math.floor(Math.random() * 22) + Math.floor(Math.random() * 22),
      char: "",
    }));
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "",
      complete = 0;
    for (const item of this.queue) {
      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28)
          item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        output += `<span class="sc">${item.char}</span>`;
      } else output += item.to;
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) this.resolve();
    else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

/* ══════════════════════════════════════
   COMPONENT
══════════════════════════════════════ */
export default function HeroSection() {
  /* ── DOM refs ── */
  const heroRef = useRef();
  const curtainRef = useRef();
  const photoPanelRef = useRef();
  const photoImgRef = useRef();
  const revealImgRef = useRef();
  const portalRef = useRef();
  const glareRef = useRef();
  const nameTopRef = useRef();
  const nameBotRef = useRef();
  const line1Ref = useRef();
  const line2Ref = useRef();

  /* ── Cursor refs (3 rings + dot + RGB ghosts) ── */
  const dotRef = useRef();
  const r1Ref = useRef();
  const r2Ref = useRef();
  const r3Ref = useRef();
  const rgbRRef = useRef();
  const rgbBRef = useRef();

  /* ── Tracked state (no re-renders needed) ── */
  const mouse = useRef({ x: -999, y: -999 });
  const p1 = useRef({ x: -999, y: -999 });
  const p2 = useRef({ x: -999, y: -999 });
  const p3 = useRef({ x: -999, y: -999 });
  const pR = useRef({ x: -999, y: -999 });
  const pB = useRef({ x: -999, y: -999 });
  const tilt = useRef({ x: 0, y: 0 });
  const tiltT = useRef({ x: 0, y: 0 });
  const hue = useRef(180);
  const hueT = useRef(180);
  const raf = useRef();

  const lerp = (a, b, n) => a + (b - a) * n;

  /* ══════════════════════════════════════
     TEXT SCRAMBLE on mount
  ══════════════════════════════════════ */
  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current) return;
    setTimeout(
      () => new TextScramble(line1Ref.current).setText("ABHISHEK"),
      1100,
    );
    setTimeout(
      () => new TextScramble(line2Ref.current).setText("HIREMATH"),
      1650,
    );
  }, []);

  /* ══════════════════════════════════════
     MASTER RAF — all smooth movement
  ══════════════════════════════════════ */
  useEffect(() => {
    const tick = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      /* Ring positions lerp at 3 different speeds */
      p1.current.x = lerp(p1.current.x, mx, 0.24);
      p1.current.y = lerp(p1.current.y, my, 0.24);
      p2.current.x = lerp(p2.current.x, mx, 0.11);
      p2.current.y = lerp(p2.current.y, my, 0.11);
      p3.current.x = lerp(p3.current.x, mx, 0.052);
      p3.current.y = lerp(p3.current.y, my, 0.052);

      /* RGB ghost trails — slightly offset + slower */
      pR.current.x = lerp(pR.current.x, mx, 0.17);
      pR.current.y = lerp(pR.current.y, my, 0.17);
      pB.current.x = lerp(pB.current.x, mx, 0.13);
      pB.current.y = lerp(pB.current.y, my, 0.13);

      /* Hue shift lerp */
      hue.current = lerp(hue.current, hueT.current, 0.07);
      const h = hue.current;

      /* Apply cursor positions */
      if (dotRef.current) {
        dotRef.current.style.left = mx + "px";
        dotRef.current.style.top = my + "px";
        dotRef.current.style.background = `hsl(${h},100%,70%)`;
        dotRef.current.style.boxShadow = `0 0 10px hsl(${h},100%,60%),0 0 24px hsl(${h},100%,40%)`;
      }
      if (r1Ref.current) {
        r1Ref.current.style.left = p1.current.x + "px";
        r1Ref.current.style.top = p1.current.y + "px";
        r1Ref.current.style.borderColor = `hsl(${h},100%,65%)`;
        r1Ref.current.style.boxShadow = `0 0 14px hsl(${h},100%,50%),inset 0 0 8px hsl(${h},100%,20%)`;
      }
      if (r2Ref.current) {
        r2Ref.current.style.left = p2.current.x + "px";
        r2Ref.current.style.top = p2.current.y + "px";
        r2Ref.current.style.borderColor = `hsl(${h},80%,55%)`;
      }
      if (r3Ref.current) {
        r3Ref.current.style.left = p3.current.x + "px";
        r3Ref.current.style.top = p3.current.y + "px";
        r3Ref.current.style.borderColor = `hsl(${h},60%,45%)`;
      }
      if (rgbRRef.current) {
        rgbRRef.current.style.left = pR.current.x + 7 + "px";
        rgbRRef.current.style.top = pR.current.y + "px";
      }
      if (rgbBRef.current) {
        rgbBRef.current.style.left = pB.current.x - 7 + "px";
        rgbBRef.current.style.top = pB.current.y + "px";
      }

      /* 3D tilt lerp */
      tilt.current.x = lerp(tilt.current.x, tiltT.current.x, 0.065);
      tilt.current.y = lerp(tilt.current.y, tiltT.current.y, 0.065);
      if (photoPanelRef.current) {
        photoPanelRef.current.style.transform = `rotateX(${tilt.current.x}deg) rotateY(${tilt.current.y}deg) translateZ(0)`;
      }

      /* Glare follows mouse (local panel coords) */
      if (glareRef.current && photoPanelRef.current) {
        const rect = photoPanelRef.current.getBoundingClientRect();
        glareRef.current.style.setProperty("--gx", mx - rect.left + "px");
        glareRef.current.style.setProperty("--gy", my - rect.top + "px");
      }

      /* Reveal clip + portal ring — local coords inside panel */
      if (photoPanelRef.current) {
        const rect = photoPanelRef.current.getBoundingClientRect();
        const lx = mx - rect.left;
        const ly = my - rect.top;

        if (revealImgRef.current)
          revealImgRef.current.style.clipPath = `circle(145px at ${lx}px ${ly}px)`;

        if (portalRef.current) {
          portalRef.current.style.left = lx + "px";
          portalRef.current.style.top = ly + "px";
          portalRef.current.style.borderColor = `hsl(${h},100%,62%)`;
          portalRef.current.style.boxShadow =
            `0 0 0 2px hsl(${h},100%,45%),` +
            `0 0 50px hsl(${h},100%,30%),` +
            `inset 0 0 50px rgba(0,0,0,0.55)`;
        }
      }

      /* Particle trail */
      if (Math.random() > 0.6) spawnDot(mx, my, h);

      raf.current = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  /* ══════════════════════════════════════
     MOUSE MOVE
  ══════════════════════════════════════ */
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (photoPanelRef.current) {
        const rect = photoPanelRef.current.getBoundingClientRect();
        const inside = e.clientX >= rect.left;
        if (inside) {
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          tiltT.current.x = -ny * 15;
          tiltT.current.y = nx * 15;
        } else {
          tiltT.current.x = 0;
          tiltT.current.y = 0;
        }
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ══════════════════════════════════════
     MAGNETIC HOVER + HUE SHIFT
  ══════════════════════════════════════ */
  useEffect(() => {
    const hueMap = { link: 180, btn: 32, img: 300 };

    const setupMagnets = () => {
      document.querySelectorAll("[data-mag]").forEach((el) => {
        const type = el.dataset.mag;

        el.addEventListener("mouseenter", () => {
          hueT.current = hueMap[type] ?? 180;
          gsap.to([r1Ref.current, r2Ref.current, r3Ref.current], {
            scale: [2.4, 1.7, 1.35][0],
            duration: 0.5,
            ease: "expo.out",
            stagger: 0.04,
          });
        });

        el.addEventListener("mouseleave", () => {
          hueT.current = 180;
          gsap.to([r1Ref.current, r2Ref.current, r3Ref.current], {
            scale: 1,
            duration: 0.5,
            ease: "expo.out",
          });
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1,0.4)",
          });
        });

        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          gsap.to(el, {
            x: dx * 0.28,
            y: dy * 0.28,
            duration: 0.45,
            ease: "power2.out",
          });
        });
      });
    };

    const timer = setTimeout(setupMagnets, 600);
    return () => clearTimeout(timer);
  }, []);

  /* ══════════════════════════════════════
     CLICK BURST
  ══════════════════════════════════════ */
  useEffect(() => {
    const onClick = (e) => {
      /* Ring flash */
      gsap.fromTo(
        r1Ref.current,
        { scale: 1 },
        {
          scale: 3.5,
          opacity: 0,
          duration: 0.55,
          ease: "expo.out",
          onComplete: () => {
            gsap.set(r1Ref.current, { scale: 1, opacity: 1 });
          },
        },
      );
      /* Burst particles */
      for (let i = 0; i < 8; i++) spawnBurst(e.clientX, e.clientY, hue.current);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  /* ══════════════════════════════════════
     GSAP ENTRY TIMELINE
  ══════════════════════════════════════ */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.25 });

    tl.to(curtainRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 1.35,
      ease: "expo.inOut",
    });

    tl.fromTo(
      photoImgRef.current,
      { scale: 1.18, filter: "brightness(0) saturate(0)" },
      {
        scale: 1,
        filter: "brightness(1) saturate(1)",
        duration: 1.7,
        ease: "expo.out",
      },
      "-=0.7",
    );

    tl.from(
      [nameTopRef.current, nameBotRef.current],
      { y: "110%", duration: 1.15, ease: "expo.out", stagger: 0.15 },
      "-=1.2",
    );

    tl.from(
      ".stat-item",
      { y: 30, opacity: 0, stagger: 0.08, duration: 0.7, ease: "expo.out" },
      "-=0.65",
    );
    tl.from(
      ".nav-link",
      { y: -20, opacity: 0, stagger: 0.06, duration: 0.6, ease: "expo.out" },
      "-=0.75",
    );
    tl.from(
      ".hero-role",
      { opacity: 0, x: -24, duration: 0.6, ease: "expo.out" },
      "-=0.5",
    );
    tl.from(".hero-scroll-indicator", { opacity: 0, duration: 0.5 }, "-=0.3");

    gsap.to(photoImgRef.current, {
      yPercent: 14,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.utils.toArray(".section").forEach((s) => {
      gsap.fromTo(
        s.querySelector(".section-inner"),
        { y: 110, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: s,
            start: "top 80%",
            end: "top 40%",
            scrub: 1.3,
          },
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  /* ── Particle helpers ── */
  const spawnDot = (x, y, h) => {
    const p = document.createElement("div");
    p.className = "c-particle";
    const s = Math.random() * 5 + 2;
    p.style.cssText = `
      left:${x + (Math.random() - 0.5) * 18}px;
      top:${y + (Math.random() - 0.5) * 18}px;
      width:${s}px;height:${s}px;
      background:hsl(${h + (Math.random() - 0.5) * 60},100%,65%);
      box-shadow:0 0 ${s * 2}px hsl(${h},100%,55%);
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  };

  const spawnBurst = (x, y, h) => {
    const p = document.createElement("div");
    p.className = "c-burst";
    const a = Math.random() * Math.PI * 2;
    const d = 40 + Math.random() * 70;
    p.style.cssText = `
      left:${x}px;top:${y}px;
      --tx:${Math.cos(a) * d}px;--ty:${Math.sin(a) * d}px;
      background:hsl(${h},100%,65%);
      box-shadow:0 0 10px hsl(${h},100%,55%);
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  };

  const stats = [
    { num: "04+", label: "Years Exp" },
    { num: "32", label: "Projects" },
    { num: "∞", label: "Lines Written" },
  ];

  return (
    <div className="app dark">
      {/* ══ CURSOR SYSTEM ══ */}
      <div ref={dotRef} className="c-dot" />
      <div ref={rgbRRef} className="c-rgb c-rgb-r" />
      <div ref={rgbBRef} className="c-rgb c-rgb-b" />
      <div ref={r1Ref} className="c-ring c-ring-1" />
      <div ref={r2Ref} className="c-ring c-ring-2" />
      <div ref={r3Ref} className="c-ring c-ring-3" />

      {/* ══ HERO ══ */}
      <section className="hero" ref={heroRef}>
        <div className="curtain" ref={curtainRef} />

        {/* ── NAV ── */}
        <nav className="hero-nav">
          <div className="nav-logo" data-mag="link">
            AH<span>.</span>
          </div>
          <ul className="nav-links">
            {["About", "Work", "Stack", "Contact"].map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  className="nav-link"
                  data-mag="link"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-status">
            <span className="status-dot" />
            <span>Available for work</span>
          </div>
        </nav>

        {/* ── 3D PHOTO PANEL ── */}
        <div className="photo-perspective">
          <div className="photo-panel" ref={photoPanelRef} data-mag="img">
            {/* Base image */}
            <img
              ref={photoImgRef}
              src={me}
              alt="Abhishek"
              className="hero-photo base-photo"
            />

            {/* Specular glare */}
            <div className="photo-glare" ref={glareRef} />

            {/* Scanlines */}
            <div className="photo-scanlines" />

            {/* ══ 3D REVEAL WORLD (preserve-3d sublayer) ══ */}
            <div className="reveal-world">
              {/* Hover image — floats at Z+22 */}
              <img
                ref={revealImgRef}
                src={hoverImg}
                alt=""
                className="reveal-photo"
                aria-hidden
              />

              {/* Portal ring — floats at Z+38, tracks cursor */}
              <div ref={portalRef} className="portal-ring">
                <div className="portal-inner" />
                <div className="portal-h" />
                <div className="portal-v" />
                <span className="portal-label">VIEW</span>
              </div>
            </div>

            {/* Gradients */}
            <div className="photo-grad-l" />
            <div className="photo-grad-b" />

            {/* Slash accent */}
            <div className="slash-line" />

            {/* Badge */}
            <div className="photo-badge">
              <span>2025</span>
              <span className="badge-sep">—</span>
              <span>Bengaluru, IN</span>
            </div>

            {/* RGB glitch ghosts */}
            <img src={me} className="g-r" alt="" aria-hidden />
            <img src={me} className="g-b" alt="" aria-hidden />
          </div>
        </div>

        {/* ── GIANT NAME ── */}
        <div className="hero-name-block">
          <div className="nlw">
            <div className="nl" ref={nameTopRef}>
              <span ref={line1Ref}>ABHISHEK</span>
            </div>
          </div>
          <div className="nlw">
            <div className="nl nl2" ref={nameBotRef}>
              <span ref={line2Ref}>HIREMATH</span>
            </div>
          </div>
        </div>

        {/* ── ROLE ── */}
        <div className="hero-role">
          <span className="role-slash">/</span>
          Full Stack Developer
        </div>

        {/* ── SCROLL ── */}
        <div className="hero-scroll-indicator">
          <div className="scroll-line" />
          <span>SCROLL</span>
        </div>

        {/* ── STATS BAR ── */}
        <div className="stats-bar">
          {stats.map(({ num, label }) => (
            <div className="stat-item" key={label} data-mag="btn">
              <span className="stat-num">{num}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
          <div className="stat-divider" />
          <div className="stat-item social-links">
            {["GH", "LI", "TW"].map((s) => (
            <a key={s} href="/" className="social-link" data-mag="link">
  {s}
</a>
            ))}
          </div>
        </div>

        <div className="grain-overlay" aria-hidden />
      </section>

      {/* ══ SECTIONS ══ */}
      <section className="section about-section" id="about">
        <div className="section-inner">
          <span className="section-num">01</span>
          <h2>About Me</h2>
        </div>
      </section>
      <section className="section projects-section" id="work">
        <div className="section-inner">
          <span className="section-num">02</span>
          <h2>Projects</h2>
        </div>
      </section>
      <section className="section contact-section" id="contact">
        <div className="section-inner">
          <span className="section-num">03</span>
          <h2>Contact</h2>
        </div>
      </section>
    </div>
  );
}
