import { useState, useEffect, useRef } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, GraduationCap, Handshake, HeartHandshake, Menu, Sparkles, UsersRound, Wallet, X } from "lucide-react";
import { motion, useInView } from "framer-motion";
import heroImage from "./images/hero-image.png";
import logoBlue from "./images/tgma-logo-coloured.png";
import cohort1Flyer from "./images/cohort1-flyer.png";

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
  "Foundations of Talent Management & The Creative Industry Landscape",
  "Talent Discovery, Evaluation & Product Value",
  "Branding, PR, Audience Growth and Amplification",
  "Business Models, Financing, Contracts & Negotiation",
  "Ethics, Emotional Intelligence & Crisis Management",
  "Scaling Careers, Teams & The Future of Talent Management",
];

const outcomes = [
  "Understand the creative industry landscape and the business role of a talent manager",
  "Build practical systems for discovering, representing, positioning, and growing talent",
  "Learn contracts, negotiation, monetization, PR, media, communications, and operations",
  "Develop a capstone talent management plan and present it on Demo Day",
  "Access mentorship, industry exposure, alumni support, and opportunity pathways",
];

const steps = [
  "Online application with bio, statement of interest, and career goals",
  "Screening review by the TGM Academy team",
  "Video interview for top 75 applicants",
  "Final selection and onboarding for the first cohort",
];

const stats = [
  { target: 6, suffix: " Weeks", label: "Immersive talent management training" },
  { target: 6, suffix: " Modules", label: "Execution-driven curriculum" },
  { target: 1, suffix: " Demo Day", label: "Capstone presentation and industry exposure" },
];

function SectionLabel({ children }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#363A97]/15 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#363A97]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#363A97]" />
      {children}
    </div>
  );
}

function PrimaryButton({ children = "Apply Now" }) {
  return (
    <a
      href="/register"
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#EA4D25] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EA4D25]/20 transition hover:bg-[#cf3f1d]"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  );
}

function SecondaryButton({ children }) {
  return (
    <a href="#program" className="inline-flex items-center justify-center rounded-full border border-[#363A97]/20 bg-white px-6 py-3 text-sm font-semibold text-[#363A97] transition hover:border-[#EA4D25]/45 hover:bg-[#fff4f0]">
      {children}
    </a>
  );
}

function DonateButton() {
  return (
    <a
      href="/donate"
      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#363A97]/20 bg-white px-6 py-3 text-sm font-semibold text-[#363A97] transition hover:border-[#EA4D25]/45 hover:bg-[#fff4f0]"
    >
      <HeartHandshake className="h-4 w-4" />
      Sponsor a Student
    </a>
  );
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-[#363A97]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#363A97]/25 hover:shadow-xl hover:shadow-[#363A97]/10"
    >
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EA4D25]/10 text-[#EA4D25]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-[#31356E]">{title}</h3>
      <p className="leading-7 text-[#35394D]">{body}</p>
    </motion.div>
  );
}

export default function TgmAcademyWebsite() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <main className="min-h-screen bg-[#F6F7FF] text-[#31356E] antialiased" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-18%] h-[520px] w-[520px] rounded-full bg-[#363A97]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-[#363A97]/10 blur-[150px]" />
      </div>

      <div className="relative z-[60] bg-[#31356E] px-5 py-2.5 text-center lg:px-8">
        <a
          href="#apply"
          className="inline-flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-white hover:underline"
        >
          <span className="inline-flex items-center rounded-full bg-[#EA4D25] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
            Cohort 1
          </span>
          Applications for the Talent Management Accelerator Programme are now open
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#363A97]/10 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" onClick={closeMobileMenu} className="flex items-center gap-3">
            <img src={logoBlue} alt="TGM Academy" className="h-11 w-auto" />
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#35394D] md:flex">
            <a href="#about" className="hover:text-[#363A97]">About</a>
            <a href="#program" className="hover:text-[#363A97]">Programme</a>
            <a href="#experience" className="hover:text-[#363A97]">Experience</a>
            <a href="#apply" className="hover:text-[#363A97]">Apply</a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <DonateButton />
            <PrimaryButton />
          </div>

          <button
            type="button"
            className="rounded-full border border-[#363A97]/15 p-2 text-[#363A97] transition hover:border-[#363A97]/30 hover:bg-[#363A97]/5 md:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="border-t border-[#363A97]/10 bg-white px-5 py-5 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {[
                { href: "#about", label: "About" },
                { href: "#program", label: "Programme" },
                { href: "#experience", label: "Experience" },
                { href: "#apply", label: "Apply" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-[#35394D] transition hover:bg-[#363A97]/5 hover:text-[#363A97]"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3 px-1">
                <PrimaryButton />
                <DonateButton />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="relative mx-auto max-w-7xl px-5 pb-20 pt-18 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <SectionLabel>Presented by That Good Media</SectionLabel>
            <h1 className="text-5xl font-bold leading-[0.96] tracking-[-0.02em] text-[#363A97] md:text-7xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
              TGM Academy
            </h1>
            <p className="mt-8 text-lg leading-8 text-[#35394D] md:text-xl md:leading-9">
              Home of the Talent Management Accelerator Programme, a six-week, execution-driven course that prepares industry-ready talent managers for the realities of Africa's creative economy.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <PrimaryButton />
              <SecondaryButton>Explore Programme</SecondaryButton>
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
              alt="TGM Academy talent management programme"
              className="ml-auto w-full max-w-[560px]"
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-10 grid gap-4 border-y border-[#363A97]/10 py-6 md:grid-cols-3 lg:mt-0"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        >
          {stats.map(({ target, suffix, label }) => (
            <motion.div key={label} variants={fadeUp} className="px-1 py-4">
              <p className="text-3xl font-bold tracking-tight text-[#363A97]">
                <Counter target={target} suffix={suffix} />
              </p>
              <p className="mt-2 text-sm leading-6 text-[#35394D]">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Industry Gap */}
      <section className="relative border-t border-[#363A97]/10 bg-white px-5 py-24 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>The Industry Gap</SectionLabel>
            <h2 className="text-4xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-6xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>Talent is visible. Management remains informal.</h2>
          </motion.div>
          <motion.div variants={fadeUp} className="space-y-6 text-lg leading-9 text-[#35394D]">
            <p>
              Africa's creative economy is expanding, but many of the people responsible for shaping sustainable careers behind the scenes enter the industry without formal training, business structure, or professional support systems.
            </p>
            <p>
              TGM Academy exists to professionalize talent management by raising ethical, strategic, and globally competitive managers who can support artists, creatives, and entertainment businesses with clarity and responsibility.
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
          <motion.h2 variants={fadeUp} className="text-4xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-6xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
            A new standard for leadership in talent management.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-7 text-lg leading-9 text-[#35394D]">
            Organized by That Good Media, TGM Academy is a training and development platform for emerging creative industry professionals. Its flagship course, the Talent Management Accelerator Programme, is built around execution, practical learning, industry access, and value-based representation.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-5 md:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        >
          <FeatureCard icon={GraduationCap} title="6-Module Curriculum" body="A six-week journey from creative industry foundations to talent discovery, branding, business models, ethics, and scaling a talent management career." />
          <FeatureCard icon={Sparkles} title="Execution-Driven Learning" body="Video lessons, live sessions, case studies, assignments, and applied exercises designed around real talent management decisions." />
          <FeatureCard icon={Handshake} title="Industry Access" body="Mentorship, fireside conversations, introductions, networking, and exposure to experienced entertainment and creative business leaders." />
        </motion.div>
      </section>

      {/* Program */}
      <section id="program" className="relative border-y border-[#363A97]/10 bg-[#363A97] px-5 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
            >
              <motion.div variants={fadeUp}>
                <SectionLabel>Programme Overview</SectionLabel>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl font-bold leading-tight tracking-[-0.02em] md:text-6xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
                Talent Management Accelerator Programme.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-7 text-lg leading-8 text-white/72">
                The flagship programme runs for six weeks through a virtual and live delivery model, combining recorded lessons, live sessions, practical assignments, case studies, mentorship, industry conversations, and a capstone Demo Day.
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
                  className="flex gap-4 rounded-2xl border border-white/15 bg-white/[0.08] p-5 transition hover:bg-white/[0.12]"
                >
                  <span className="text-sm font-semibold text-white/55">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm font-semibold leading-6 text-white">{module}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <motion.div
          className="overflow-hidden rounded-[2rem] border border-[#363A97]/10 bg-white p-8 shadow-xl shadow-[#363A97]/10 md:p-12 lg:p-16"
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
              <motion.h2 variants={fadeUp} className="text-4xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-6xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
                Fireside conversations with industry leaders.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-7 max-w-2xl text-lg leading-9 text-[#35394D]">
                Participants learn from experienced professionals through real-world conversations on representation, career-building, negotiation, PR, media, operations, industry challenges, and ethical standards.
              </motion.p>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-[#363A97]/10 bg-[#F6F7FF] p-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
            >
              <motion.div variants={fadeUp}>
                <CalendarDays className="mb-8 h-8 w-8 text-[#363A97]" />
              </motion.div>
              <div className="space-y-4">
                {["Recorded video lessons for module foundations", "Live sessions for discussion, application, and feedback", "Assignments, quizzes, and case studies for practical execution", "Fireside chats, mentorship, networking, and Demo Day exposure"].map((item) => (
                  <motion.div key={item} variants={fadeUp} className="flex items-start gap-3 text-[#35394D]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#363A97]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Outcomes */}
      <section className="relative border-y border-[#363A97]/10 bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
            <motion.div variants={fadeUp}>
              <SectionLabel>Outcomes</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-6xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
              Leave with a practical talent management playbook.
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
              <motion.div key={outcome} variants={fadeUp} className="flex items-start gap-4 border-b border-[#363A97]/10 pb-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#363A97]" />
                <p className="text-lg leading-8 text-[#35394D]">{outcome}</p>
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
            className="rounded-2xl border border-[#363A97]/10 bg-white p-8 shadow-sm md:p-10"
          >
            <UsersRound className="mb-8 h-8 w-8 text-[#363A97]" />
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-5xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>For emerging talent managers.</h2>
            <p className="mt-6 text-lg leading-8 text-[#35394D]">
              Designed for aspiring and early-stage talent managers, artist managers, PR and media professionals, brand and marketing professionals, creative entrepreneurs, business professionals in film, music, sport, fashion, television and digital media, and friends or founders supporting emerging talent.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-2xl border border-[#363A97]/10 bg-[#363A97] p-8 text-white shadow-xl shadow-[#363A97]/20 md:p-10"
          >
            <GraduationCap className="mb-8 h-8 w-8 text-white" />
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.02em] md:text-5xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>A selective accelerator experience.</h2>
            <p className="mt-6 text-lg leading-8 text-white/72">
              The first cohort will welcome selected participants who demonstrate potential, discipline, clarity of vision, and commitment to building sustainable creative careers.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Apply */}
      <section id="apply" className="relative border-t border-[#363A97]/10 bg-[#F3F4FF] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
            >
              <motion.div variants={fadeUp}>
                <SectionLabel>Application Process</SectionLabel>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-6xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
                Apply for the Talent Management Accelerator Programme.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-7 text-lg leading-9 text-[#35394D]">
                This Programme is a premium 6-week learning experience designed to equip aspiring and practicing talent managers with the knowledge, practical skills, and network required to build successful careers in talent management.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-[#363A97]/15 bg-white px-6 py-5 shadow-sm shadow-[#363A97]/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EA4D25]/10">
                  <Wallet className="h-6 w-6 text-[#EA4D25]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#363A97]/60">Programme Fee</p>
                  <p className="text-2xl font-bold leading-tight text-[#31356E]" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
                    ₦250,000
                  </p>
                  <p className="text-sm text-[#35394D]/70">Two Hundred and Fifty Thousand Naira</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-xs lg:max-w-sm"
            >
              <img
                src={cohort1Flyer}
                alt="TGM Academy Cohort 1 application flyer for the Talent Management Accelerator Programme"
                className="w-full rounded-2xl border border-[#363A97]/10 shadow-xl shadow-[#363A97]/15"
              />
            </motion.div>
          </div>

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
                className="rounded-2xl border border-[#363A97]/10 bg-white p-6 shadow-sm"
              >
                <p className="mb-10 text-4xl font-bold tracking-[-0.02em] text-[#363A97]">0{index + 1}</p>
                <p className="text-sm leading-7 text-[#35394D]">{step}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-14 rounded-2xl border border-[#363A97]/10 bg-white p-8 shadow-xl shadow-[#363A97]/10 md:flex md:items-center md:justify-between md:p-10"
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#31356E]">Ready to manage the next generation of creative talent?</h3>
              <p className="mt-3 text-[#35394D]">Start your application for the first Talent Management Accelerator cohort.</p>
            </div>
            <div className="mt-6 md:mt-0">
              <PrimaryButton />
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative border-t border-[#363A97]/10 bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-[#35394D] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={logoBlue} alt="TGM Academy" className="h-9 w-auto" />
            <p>© 2026 TGM Academy. Presented by That Good Media.</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="mailto:admissions@tgmacademy.org" className="hover:text-[#363A97]">admissions@tgmacademy.org</a>
            <a href="#about" className="hover:text-[#363A97]">About</a>
            <a href="#program" className="hover:text-[#363A97]">Programme</a>
            <a href="#apply" className="hover:text-[#363A97]">Apply</a>
            <a href="/donate" className="hover:text-[#363A97]">Donate</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
