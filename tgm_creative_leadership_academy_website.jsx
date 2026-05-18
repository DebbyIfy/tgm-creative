import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, Crown, GraduationCap, Handshake, Menu, Sparkles, UsersRound } from "lucide-react";
import { motion, useInView } from "framer-motion";
import heroImage from "./src/images/hero-image.png";

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const vp = { once: true, margin: "-80px" };

function Counter({ target, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const modules = [
  "Foundations of Talent Management",
  "Leadership in the Creative Industry",
  "Identity Conversion",
  "Contracting & Negotiation",
  "Brand Strategy & Career Development",
  "Financial Literacy & Fundraising",
  "Industry Structures",
  "Monetization & Sustainability",
  "Networking & Relationship Management",
];

const outcomes = [
  "Understand the structure and business of talent management",
  "Build ethical leadership and decision-making frameworks",
  "Learn negotiation, contracts, and career development basics",
  "Develop strategic thinking for managing creative talent",
  "Join a growing alumni network of creative industry leaders",
];

const steps = [
  "Online application with bio, statement of interest, and career goals",
  "Screening review by the Academy Team",
  "Video interview for top 75 applicants",
  "Final selection of 50 participants",
];

const stats = [
  { target: 6, suffix: " Weeks", label: "Focused leadership and industry training" },
  { target: 50, suffix: " Fellows", label: "A selective first cohort in Lagos" },
  { target: 30, suffix: " Days", label: "Classes, workshops, mentorship, and fireside sessions" },
];

function SectionLabel({ children }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[#c7a45d]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#c7a45d]" />
      {children}
    </div>
  );
}

function PrimaryButton({ children = "Apply Now" }) {
  return (
    <a href="#apply" className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#c7a45d] px-6 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#e1bf75]">
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  );
}

function SecondaryButton({ children }) {
  return (
    <a href="#program" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04]">
      {children}
    </a>
  );
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm transition hover:border-[#c7a45d]/40 hover:bg-white/[0.055]"
    >
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c7a45d]/10 text-[#c7a45d]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
      <p className="leading-7 text-white/62">{body}</p>
    </motion.div>
  );
}

export default function TgmAcademyWebsite() {
  return (
    <main className="min-h-screen bg-[#080808] text-white antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#c7a45d]/10 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-[#1f3a5f]/20 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a45d]/40 bg-[#c7a45d]/10">
              <Crown className="h-5 w-5 text-[#c7a45d]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">TGM Academy</p>
              <p className="text-xs text-white/45">Creative Leadership</p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm text-white/62 md:flex">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#program" className="hover:text-white">Program</a>
            <a href="#experience" className="hover:text-white">Experience</a>
            <a href="#apply" className="hover:text-white">Apply</a>
          </div>

          <div className="hidden md:block">
            <PrimaryButton />
          </div>

          <button className="rounded-full border border-white/10 p-2 md:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <SectionLabel>Presented by That Good Media</SectionLabel>
            <h1 className="text-5xl font-semibold tracking-[-0.055em] text-white md:text-7xl">
              Raising the Leaders Behind the Legends
            </h1>
            <p className="mt-8 text-lg leading-8 text-white/68 md:text-xl md:leading-9">
              TGM Creative Leadership Academy is building the next generation of talent managers equipped to lead, structure, and scale creative careers across Africa's entertainment industry.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <PrimaryButton />
              <SecondaryButton>Explore Program</SecondaryButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <img
              src={heroImage}
              alt="TGM Creative Leadership Academy"
              className="w-full"
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-8 grid gap-4 border-y border-white/10 py-6 md:grid-cols-3 lg:mt-0"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        >
          {stats.map(({ target, suffix, label }) => (
            <motion.div key={label} variants={fadeUp} className="px-1 py-4">
              <p className="text-3xl font-semibold tracking-tight text-white">
                <Counter target={target} suffix={suffix} />
              </p>
              <p className="mt-2 text-sm leading-6 text-white/55">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Industry Gap */}
      <section className="relative border-t border-white/10 bg-white/[0.025] px-5 py-24 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>The Industry Gap</SectionLabel>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Talent is visible. Leadership remains informal.</h2>
          </motion.div>
          <motion.div variants={fadeUp} className="space-y-6 text-lg leading-9 text-white/65">
            <p>
              Africa's creative economy is expanding, but the people responsible for shaping sustainable careers behind the scenes often enter the industry without formal structure, training, or leadership preparation.
            </p>
            <p>
              The academy exists to professionalize talent management by raising ethical, strategic, and globally competitive leaders who can support artists, creatives, and entertainment businesses with clarity and responsibility.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <motion.div
          className="max-w-3xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>About the Academy</SectionLabel>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            A new standard for leadership in talent management.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-7 text-lg leading-9 text-white/65">
            Organized by That Good Media, TGM Creative Leadership Academy is a leadership-focused training program for emerging talent managers and creative industry professionals. Its philosophy is rooted in wholesome, value-based, and ethical leadership.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-5 md:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        >
          <FeatureCard icon={GraduationCap} title="Structured Learning" body="A six-week curriculum designed to blend leadership development with practical creative industry training." />
          <FeatureCard icon={Sparkles} title="Creative Industry Edge" body="Focused on film, music, television, digital storytelling, and the realities of modern talent management." />
          <FeatureCard icon={Handshake} title="Industry Access" body="Fireside conversations, mentorship, networking, and exposure to experienced creative industry leaders." />
        </motion.div>
      </section>

      {/* Program */}
      <section id="program" className="relative border-y border-white/10 bg-[#0d0d0d] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
            >
              <motion.div variants={fadeUp}>
                <SectionLabel>Program Overview</SectionLabel>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Built for depth, discipline, and transformation.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-7 text-lg leading-8 text-white/62">
                The academy runs physically in Lagos for six weeks, Monday to Friday, combining classes, workshops, case studies, mentorship, and weekly industry conversations.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid gap-3 sm:grid-cols-2"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
            >
              {modules.map((module, index) => (
                <motion.div
                  key={module}
                  variants={fadeUp}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <span className="text-sm font-semibold text-[#c7a45d]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm font-medium leading-6 text-white/78">{module}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <motion.div
          className="overflow-hidden rounded-[2rem] border border-[#c7a45d]/20 bg-[#c7a45d]/[0.07] p-8 md:p-12 lg:p-16"
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.div variants={fadeUp}>
                <SectionLabel>Signature Experience</SectionLabel>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Fireside conversations with industry leaders.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-7 max-w-2xl text-lg leading-9 text-white/68">
                Every Friday, fellows learn from experienced professionals through real-world conversations on leadership, career-building, negotiation, industry challenges, and ethical standards.
              </motion.p>
            </motion.div>

            <motion.div
              className="rounded-3xl border border-white/10 bg-black/25 p-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
            >
              <motion.div variants={fadeUp}>
                <CalendarDays className="mb-8 h-8 w-8 text-[#c7a45d]" />
              </motion.div>
              <div className="space-y-4">
                {["Monday–Tuesday: Leadership Classes", "Wednesday: Practical Workshops", "Thursday: Creative Leadership Classes", "Friday: Mentorship, Networking & Fireside Sessions"].map((item) => (
                  <motion.div key={item} variants={fadeUp} className="flex items-start gap-3 text-white/72">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#c7a45d]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Outcomes */}
      <section className="relative border-y border-white/10 bg-white/[0.025] px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
            <motion.div variants={fadeUp}>
              <SectionLabel>Outcomes</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Leave with clarity, confidence, and industry readiness.
            </motion.h2>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {outcomes.map((outcome) => (
              <motion.div key={outcome} variants={fadeUp} className="flex items-start gap-4 border-b border-white/10 pb-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#c7a45d]" />
                <p className="text-lg leading-8 text-white/68">{outcome}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <motion.div
          className="grid gap-5 md:grid-cols-2"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        >
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:p-10"
          >
            <UsersRound className="mb-8 h-8 w-8 text-[#c7a45d]" />
            <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-5xl">For emerging creative industry leaders.</h2>
            <p className="mt-6 text-lg leading-8 text-white/62">
              Open to young professionals and aspiring managers aged 18–35 interested in talent management, artist management, film and television representation, creative entrepreneurship, entertainment law, production management, and creative leadership.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:p-10"
          >
            <Crown className="mb-8 h-8 w-8 text-[#c7a45d]" />
            <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-5xl">A selective fellowship experience.</h2>
            <p className="mt-6 text-lg leading-8 text-white/62">
              The first cohort will welcome 50 selected participants who demonstrate leadership potential, clarity of vision, and commitment to the creative industry.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Apply */}
      <section id="apply" className="relative border-t border-white/10 bg-[#0d0d0d] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="max-w-3xl"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Application Process</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Apply to become a TGM Leadership Fellow.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-7 text-lg leading-9 text-white/65">
              Applications are reviewed through a structured selection process designed to identify committed, high-potential participants ready to grow into creative industry leaders.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-14 grid gap-4 md:grid-cols-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
              >
                <p className="mb-10 text-4xl font-semibold tracking-[-0.04em] text-[#c7a45d]">0{index + 1}</p>
                <p className="text-sm leading-7 text-white/70">{step}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-14 rounded-[2rem] border border-[#c7a45d]/25 bg-[#c7a45d]/[0.08] p-8 md:flex md:items-center md:justify-between md:p-10"
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em]">Ready to lead behind the next generation of legends?</h3>
              <p className="mt-3 text-white/62">Start your application for the first cohort.</p>
            </div>
            <div className="mt-6 md:mt-0">
              <PrimaryButton />
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 TGM Creative Leadership Academy. Presented by That Good Media.</p>
          <div className="flex gap-5">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#program" className="hover:text-white">Program</a>
            <a href="#apply" className="hover:text-white">Apply</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
