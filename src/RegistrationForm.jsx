import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import logoBlue from "./images/tgma-logo-coloured.png";

const REGISTRATION_FEE = 250000;
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
const SUBMIT_ENDPOINT = import.meta.env.VITE_POWER_AUTOMATE_URL || "";
const DISCOUNT_CODE_ENDPOINT = import.meta.env.VITE_DISCOUNT_CODE_POWER_AUTOMATE_URL || "";

const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Rwanda", "Uganda",
  "Tanzania", "Ethiopia", "Cameroon", "Senegal", "Côte d'Ivoire", "Zambia",
  "Zimbabwe", "Botswana", "Namibia", "Morocco", "Algeria", "United Kingdom",
  "United States", "Canada", "United Arab Emirates", "Other",
];

const DESCRIBES_YOU = [
  "Aspiring Talent Manager",
  "Practicing Talent Manager",
  "Artist/Creative",
  "Entertainment Lawyer",
  "Publicist/PR Professional",
  "Brand Manager",
  "Marketing Professional",
  "Entrepreneur",
  "Other",
];

const EXPERIENCE_RANGES = ["Less than 1 year", "1–3 years", "4–6 years", "7–10 years", "Over 10 years"];

const INDUSTRIES = ["Film & TV", "Music", "Sports", "Fashion", "Digital Content", "Advertising", "Other"];

const TALENT_TYPES = [
  "Actors", "Musicians", "Content Creators", "Filmmakers",
  "Sports Personalities", "Influencers", "Models", "Other",
];

const HEAR_ABOUT_OPTIONS = [
  "Instagram", "LinkedIn", "Twitter/X", "TikTok",
  "Friend or Referral", "Google Search", "Email", "Other",
];

const formatNaira = (amount) => `₦${amount.toLocaleString("en-NG")}`;

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  country: "",
  countryOther: "",
  city: "",
  dob: "",
  gender: "",
  describesYou: "",
  describesYouOther: "",
  experience: "",
  industry: "",
  industryOther: "",
  managedTalentBefore: "",
  talentTypes: [],
  talentTypeOther: "",
  motivation: "",
  goals: "",
  hearAbout: "",
  hearAboutOther: "",
  discountCode: "",
};

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#31356E]">
        {label}
        {required && <span className="text-[#EA4D25]"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#363A97]/15 bg-white px-4 py-3 text-sm text-[#31356E] outline-none transition focus:border-[#EA4D25]/50 focus:ring-2 focus:ring-[#EA4D25]/10";

let paystackScriptPromise = null;
function loadPaystackScript() {
  if (window.PaystackPop) return Promise.resolve();
  if (paystackScriptPromise) return paystackScriptPromise;
  paystackScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
  return paystackScriptPromise;
}

export default function RegistrationForm() {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [thankYou, setThankYou] = useState(false);
  const [discountStatus, setDiscountStatus] = useState("idle");
  const [discountInfo, setDiscountInfo] = useState(null);
  const [discountMessage, setDiscountMessage] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTalentType = (type) => {
    setForm((prev) => {
      const has = prev.talentTypes.includes(type);
      return {
        ...prev,
        talentTypes: has
          ? prev.talentTypes.filter((t) => t !== type)
          : [...prev.talentTypes, type],
      };
    });
  };

  const finalAmount = discountInfo
    ? Math.round(REGISTRATION_FEE * (1 - discountInfo.discountPercent / 100))
    : REGISTRATION_FEE;

  const applyDiscountCode = async () => {
    const code = form.discountCode.trim();
    if (!code) return;
    setDiscountStatus("checking");
    setDiscountMessage("");
    setDiscountInfo(null);

    if (!DISCOUNT_CODE_ENDPOINT) {
      setDiscountStatus("invalid");
      setDiscountMessage("Discount codes aren't set up yet. Please contact admissions@tgmacademy.org.");
      return;
    }

    try {
      const res = await fetch(DISCOUNT_CODE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "validate", code }),
      });
      const data = await res.json();
      if (data.valid && data.remainingUses > 0) {
        setDiscountInfo({ code, discountPercent: data.discountPercent, remainingUses: data.remainingUses });
        setDiscountStatus("valid");
        setDiscountMessage(`${data.discountPercent}% off applied — you'll pay ${formatNaira(Math.round(REGISTRATION_FEE * (1 - data.discountPercent / 100)))}.`);
      } else {
        setDiscountStatus("invalid");
        setDiscountMessage(data.message || "This code is invalid or has already been fully redeemed.");
      }
    } catch {
      setDiscountStatus("invalid");
      setDiscountMessage("We couldn't check that code right now. Please try again.");
    }
  };

  const removeDiscountCode = () => {
    setDiscountInfo(null);
    setDiscountStatus("idle");
    setDiscountMessage("");
    update("discountCode", "");
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.country) next.country = "Select your country of residence.";
    if (form.country === "Other" && !form.countryOther.trim()) next.countryOther = "Please specify your country.";
    if (!form.city.trim()) next.city = "City of residence is required.";
    if (!form.dob) next.dob = "Date of birth is required.";
    if (!form.gender) next.gender = "Select a gender.";
    if (!form.describesYou) next.describesYou = "Select the option that best describes you.";
    if (form.describesYou === "Other" && !form.describesYouOther.trim()) next.describesYouOther = "Please specify.";
    if (!form.experience) next.experience = "Select your years of experience.";
    if (!form.industry) next.industry = "Select your industry.";
    if (form.industry === "Other" && !form.industryOther.trim()) next.industryOther = "Please specify.";
    if (!form.managedTalentBefore) next.managedTalentBefore = "Select yes or no.";
    if (form.talentTypes.length === 0) next.talentTypes = "Select at least one type of talent.";
    if (form.talentTypes.includes("Other") && !form.talentTypeOther.trim()) next.talentTypeOther = "Please specify.";
    if (!form.motivation.trim()) next.motivation = "Please share your motivation and goals.";
    if (!form.goals.trim()) next.goals = "Please share what you hope to achieve.";
    if (!form.hearAbout) next.hearAbout = "Select an option.";
    if (form.hearAbout === "Other" && !form.hearAboutOther.trim()) next.hearAboutOther = "Please specify.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const redeemDiscountCode = async (code) => {
    if (!DISCOUNT_CODE_ENDPOINT) return;
    try {
      await fetch(DISCOUNT_CODE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "redeem", code }),
      });
    } catch {
      // Payment already succeeded; a redemption-tracking failure shouldn't block the registrant's confirmation.
    }
  };

  const logRegistration = async (paymentStatus, amountPaid = "", reference = "") => {
    if (!SUBMIT_ENDPOINT) return;
    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      linkedin: form.linkedin,
      country: form.country === "Other" ? form.countryOther : form.country,
      city: form.city,
      dob: form.dob,
      gender: form.gender,
      describesYou: form.describesYou === "Other" ? form.describesYouOther : form.describesYou,
      experience: form.experience,
      industry: form.industry === "Other" ? form.industryOther : form.industry,
      managedTalentBefore: form.managedTalentBefore,
      talentTypes: form.talentTypes.map((t) => (t === "Other" ? form.talentTypeOther : t)),
      motivation: form.motivation,
      goals: form.goals,
      hearAbout: form.hearAbout === "Other" ? form.hearAboutOther : form.hearAbout,
      discountCode: discountInfo?.code || "",
      paymentStatus,
      amountPaid,
      reference,
      submittedAt: new Date().toISOString(),
    };
    try {
      await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Best-effort logging; a failure here shouldn't block the registrant's flow either way.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatus("error");
      setStatusMessage("Please fill in all required fields before continuing.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    logRegistration("Payment Pending");

    try {
      await loadPaystackScript();
    } catch {
      setStatus("error");
      setStatusMessage("We couldn't load the payment window. Please check your connection and try again.");
      return;
    }

    try {
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Math.round(finalAmount * 100),
        currency: "NGN",
        metadata: {
          fullName: form.fullName,
          phone: form.phone,
          discountCode: discountInfo?.code || "",
        },
        callback: function (response) {
          (async () => {
            if (discountInfo) await redeemDiscountCode(discountInfo.code);
            logRegistration("Paid", finalAmount, response.reference);
            setThankYou(true);
            setStatus("idle");
          })();
        },
        onClose: () => {
          setStatus("idle");
        },
      });

      handler.openIframe();
    } catch (err) {
      setStatus("error");
      setStatusMessage("We couldn't open the payment window. Please try again, or contact admissions@tgmacademy.org.");
    }
  };

  if (thankYou) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F7FF] px-5 py-12 text-[#31356E] antialiased lg:px-8" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div className="mx-auto max-w-xl rounded-2xl border border-[#363A97]/10 bg-white p-10 text-center shadow-xl shadow-[#363A97]/10">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#EA4D25]/10">
            <CheckCircle2 className="h-7 w-7 text-[#EA4D25]" />
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-3xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
            You're registered for the Talent Management Accelerator Programme.
          </h1>
          <p className="mt-4 text-base leading-7 text-[#35394D]">
            We've received your registration and payment. A confirmation has been sent to your email, and our admissions team will be in touch with next steps ahead of Cohort 1.
          </p>
          <a href="/" className="mt-8 inline-flex items-center justify-center rounded-full bg-[#EA4D25] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EA4D25]/20 transition hover:bg-[#cf3f1d]">
            Back to TGM Academy
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F7FF] px-5 py-12 text-[#31356E] antialiased lg:px-8" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div className="mx-auto max-w-3xl">
        <a href="/" className="mb-8 flex items-center gap-3">
          <img src={logoBlue} alt="TGM Academy" className="h-10 w-auto" />
        </a>

        <div className="mb-10">
          <h1 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-5xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
            Register for the Talent Management Accelerator Programme
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#35394D]">
            Complete the form below to secure your spot in Cohort 1. Once submitted, you'll pay your programme fee securely through Paystack.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-10 rounded-2xl border border-[#363A97]/10 bg-white p-6 shadow-xl shadow-[#363A97]/10 md:p-10">
          {/* Personal details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Full Name" required>
              <input type="text" className={inputClass} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
              {errors.fullName && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.fullName}</p>}
            </Field>

            <Field label="Email Address" required>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} />
              {errors.email && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.email}</p>}
            </Field>

            <Field label="Phone Number (WhatsApp)" required>
              <input type="tel" className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              {errors.phone && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.phone}</p>}
            </Field>

            <Field label="LinkedIn Profile">
              <input type="url" placeholder="https://linkedin.com/in/..." className={inputClass} value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
            </Field>

            <Field label="Country of Residence" required>
              <select className={inputClass} value={form.country} onChange={(e) => update("country", e.target.value)}>
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.country && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.country}</p>}
              {form.country === "Other" && (
                <input type="text" placeholder="Please specify" className={`${inputClass} mt-2`} value={form.countryOther} onChange={(e) => update("countryOther", e.target.value)} />
              )}
              {errors.countryOther && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.countryOther}</p>}
            </Field>

            <Field label="City of Residence" required>
              <input type="text" className={inputClass} value={form.city} onChange={(e) => update("city", e.target.value)} />
              {errors.city && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.city}</p>}
            </Field>

            <Field label="Date of Birth" required>
              <input type="date" className={inputClass} value={form.dob} onChange={(e) => update("dob", e.target.value)} />
              {errors.dob && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.dob}</p>}
            </Field>

            <Field label="Gender" required>
              <select className={inputClass} value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.gender}</p>}
            </Field>
          </div>

          {/* Professional background */}
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="What best describes you?" required>
              <select className={inputClass} value={form.describesYou} onChange={(e) => update("describesYou", e.target.value)}>
                <option value="">Select an option</option>
                {DESCRIBES_YOU.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.describesYou && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.describesYou}</p>}
              {form.describesYou === "Other" && (
                <input type="text" placeholder="Please specify" className={`${inputClass} mt-2`} value={form.describesYouOther} onChange={(e) => update("describesYouOther", e.target.value)} />
              )}
              {errors.describesYouOther && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.describesYouOther}</p>}
            </Field>

            <Field label="Years of Professional Experience" required>
              <select className={inputClass} value={form.experience} onChange={(e) => update("experience", e.target.value)}>
                <option value="">Select an option</option>
                {EXPERIENCE_RANGES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.experience && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.experience}</p>}
            </Field>

            <Field label="Which industry do you currently work in?" required>
              <select className={inputClass} value={form.industry} onChange={(e) => update("industry", e.target.value)}>
                <option value="">Select an option</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              {errors.industry && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.industry}</p>}
              {form.industry === "Other" && (
                <input type="text" placeholder="Please specify" className={`${inputClass} mt-2`} value={form.industryOther} onChange={(e) => update("industryOther", e.target.value)} />
              )}
              {errors.industryOther && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.industryOther}</p>}
            </Field>

            <Field label="Have you ever managed a talent before?" required>
              <div className="mt-1 flex gap-4">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-[#35394D]">
                    <input
                      type="radio"
                      name="managedTalentBefore"
                      value={opt}
                      checked={form.managedTalentBefore === opt}
                      onChange={(e) => update("managedTalentBefore", e.target.value)}
                      className="h-4 w-4 accent-[#EA4D25]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.managedTalentBefore && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.managedTalentBefore}</p>}
            </Field>
          </div>

          <Field label="What type of talent are you most interested in managing?" required>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TALENT_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 rounded-xl border border-[#363A97]/15 bg-white px-3 py-2.5 text-sm text-[#35394D]">
                  <input
                    type="checkbox"
                    checked={form.talentTypes.includes(type)}
                    onChange={() => toggleTalentType(type)}
                    className="h-4 w-4 accent-[#EA4D25]"
                  />
                  {type}
                </label>
              ))}
            </div>
            {errors.talentTypes && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.talentTypes}</p>}
            {form.talentTypes.includes("Other") && (
              <input type="text" placeholder="Please specify" className={`${inputClass} mt-2`} value={form.talentTypeOther} onChange={(e) => update("talentTypeOther", e.target.value)} />
            )}
            {errors.talentTypeOther && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.talentTypeOther}</p>}
          </Field>

          <Field label="Why do you want to join the Academy? Please share your motivation and goals." required>
            <textarea rows={4} className={inputClass} value={form.motivation} onChange={(e) => update("motivation", e.target.value)} />
            {errors.motivation && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.motivation}</p>}
          </Field>

          <Field label="What do you hope to achieve after completing this programme?" required>
            <textarea rows={4} className={inputClass} value={form.goals} onChange={(e) => update("goals", e.target.value)} />
            {errors.goals && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.goals}</p>}
          </Field>

          <Field label="How did you hear about our academy?" required>
            <select className={inputClass} value={form.hearAbout} onChange={(e) => update("hearAbout", e.target.value)}>
              <option value="">Select an option</option>
              {HEAR_ABOUT_OPTIONS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            {errors.hearAbout && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.hearAbout}</p>}
            {form.hearAbout === "Other" && (
              <input type="text" placeholder="Please specify" className={`${inputClass} mt-2`} value={form.hearAboutOther} onChange={(e) => update("hearAboutOther", e.target.value)} />
            )}
            {errors.hearAboutOther && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.hearAboutOther}</p>}
          </Field>

          {/* Payment */}
          <div className="rounded-2xl border border-[#363A97]/15 bg-[#F3F4FF] p-6">
            <h2 className="text-lg font-bold text-[#31356E]">Programme Fee Payment</h2>
            <p className="mt-2 text-sm leading-6 text-[#35394D]">
              {discountInfo ? (
                <>
                  <span className="line-through text-[#35394D]/50">{formatNaira(REGISTRATION_FEE)}</span>{" "}
                  <span className="font-semibold text-[#31356E]">{formatNaira(finalAmount)}</span> after your {discountInfo.discountPercent}% discount.
                </>
              ) : (
                <>{formatNaira(REGISTRATION_FEE)} for the six-week Talent Management Accelerator Programme.</>
              )}
            </p>

            <Field label="Discount Code (optional)">
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  className={inputClass}
                  value={form.discountCode}
                  disabled={!!discountInfo}
                  onChange={(e) => update("discountCode", e.target.value)}
                />
                {discountInfo ? (
                  <button
                    type="button"
                    onClick={removeDiscountCode}
                    className="shrink-0 rounded-xl border border-[#363A97]/20 px-4 py-3 text-sm font-semibold text-[#363A97] transition hover:bg-[#363A97]/5"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={applyDiscountCode}
                    disabled={discountStatus === "checking" || !form.discountCode.trim()}
                    className="shrink-0 rounded-xl border border-[#363A97]/20 px-4 py-3 text-sm font-semibold text-[#363A97] transition hover:bg-[#363A97]/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {discountStatus === "checking" ? "Checking..." : "Apply"}
                  </button>
                )}
              </div>
              {discountMessage && (
                <p className={`mt-1.5 text-xs ${discountStatus === "valid" ? "text-[#363A97]" : "text-[#EA4D25]"}`}>{discountMessage}</p>
              )}
            </Field>
          </div>

          {status === "error" && (
            <p className="rounded-xl bg-[#EA4D25]/10 px-4 py-3 text-sm font-medium text-[#EA4D25]">{statusMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#EA4D25] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#EA4D25]/20 transition hover:bg-[#cf3f1d] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Register Now
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </>
            )}
          </button>
          <p className="flex items-center gap-2 text-xs text-[#35394D]/70">
            <CheckCircle2 className="h-4 w-4 text-[#363A97]" />
            Payment is processed securely through Paystack.
          </p>
        </form>
      </div>
    </main>
  );
}
