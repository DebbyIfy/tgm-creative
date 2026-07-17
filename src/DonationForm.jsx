import { useState } from "react";
import { CheckCircle2, Copy, HeartHandshake, Loader2 } from "lucide-react";
import logoBlue from "./images/tgma-logo-coloured.png";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
const SUBMIT_ENDPOINT = import.meta.env.VITE_DONATION_POWER_AUTOMATE_URL || "";
const DISCOUNT_CODE_ENDPOINT = import.meta.env.VITE_DISCOUNT_CODE_POWER_AUTOMATE_URL || "";

const REGISTRATION_FEE = 250000;

const TIERS = [
  { label: "Supporter", amount: 500000 },
  { label: "Bronze Supporter", amount: 1000000 },
  { label: "Silver Supporter", amount: 5000000 },
  { label: "Gold Supporter", amount: 25000000 },
  { label: "Platinum Supporter", amount: 50000000 },
];

const DISCOUNT_TIERS = [100, 75, 50];

const MIN_CUSTOM_AMOUNT = 1000;

const formatNaira = (amount) =>
  `₦${amount.toLocaleString("en-NG")}`;

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  organisation: "",
  anonymous: "",
  message: "",
};

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#31356E]">
        {label}
        {required && <span className="text-[#EA4D25]"> *</span>}
        {hint && <span className="ml-2 text-xs font-normal text-[#35394D]/60">{hint}</span>}
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

export default function DonationForm() {
  const [form, setForm] = useState(initialFormState);
  const [selectedTier, setSelectedTier] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [sponsor, setSponsor] = useState(false);
  const [discountTier, setDiscountTier] = useState(null);
  const [preferredCode, setPreferredCode] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [thankYou, setThankYou] = useState(false);
  const [sponsorResult, setSponsorResult] = useState(null);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const getAmount = () => {
    if (useCustomAmount) {
      const parsed = Number(customAmount);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return selectedTier ? selectedTier.amount : 0;
  };

  const getMaxUses = () => {
    if (!sponsor || !discountTier) return 0;
    const costPerRedemption = REGISTRATION_FEE * (discountTier / 100);
    return Math.floor(getAmount() / costPerRedemption);
  };

  const validate = () => {
    const next = {};
    const amount = getAmount();
    if (!amount || amount < MIN_CUSTOM_AMOUNT) next.amount = `Select an amount or enter at least ${formatNaira(MIN_CUSTOM_AMOUNT)}.`;
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.anonymous) next.anonymous = "Select yes or no.";
    if (sponsor) {
      if (!discountTier) next.discountTier = "Select a discount tier to sponsor.";
      else if (getMaxUses() < 1) {
        next.discountTier = `This amount can't fund even one registration at ${discountTier}% off. Choose a higher amount or a smaller discount.`;
      }
      if (!preferredCode.trim()) next.preferredCode = "Enter a code you'd like to share with your sponsored registrants.";
    }
    if (!understood) next.understood = "Please confirm you understand this is a voluntary donation.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const logDonation = async (amount, reference, sponsorCode) => {
    if (!SUBMIT_ENDPOINT) return;
    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      organisation: form.organisation,
      anonymous: form.anonymous,
      message: form.message,
      amount,
      reference,
      sponsoring: sponsor,
      discountCode: sponsorCode?.code || "",
      discountPercent: sponsorCode?.discountPercent || "",
      maxUses: sponsorCode?.maxUses || "",
      submittedAt: new Date().toISOString(),
    };
    try {
      await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Payment already succeeded; a logging failure here shouldn't block the donor's confirmation.
    }
  };

  const createSponsorCode = async () => {
    const code = preferredCode.trim();
    const maxUses = getMaxUses();
    const result = { code, discountPercent: discountTier, maxUses };
    if (DISCOUNT_CODE_ENDPOINT) {
      try {
        await fetch(DISCOUNT_CODE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "create",
            code,
            discountPercent: discountTier,
            maxUses,
            donorName: form.fullName,
            donorEmail: form.email,
          }),
        });
      } catch {
        // The donation still succeeded; the code is shown to the donor regardless.
      }
    }
    return result;
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

    try {
      await loadPaystackScript();
    } catch {
      setStatus("error");
      setStatusMessage("We couldn't load the payment window. Please check your connection and try again.");
      return;
    }

    const amount = getAmount();

    try {
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Math.round(amount * 100),
        currency: "NGN",
        metadata: {
          fullName: form.fullName,
          phone: form.phone,
          organisation: form.organisation,
          anonymous: form.anonymous,
          message: form.message,
          sponsoring: sponsor,
        },
        callback: function (response) {
          (async () => {
            let sponsorCode = null;
            if (sponsor) {
              sponsorCode = await createSponsorCode();
              setSponsorResult(sponsorCode);
            }
            logDonation(amount, response.reference, sponsorCode);
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
            <HeartHandshake className="h-7 w-7 text-[#EA4D25]" />
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-3xl" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}>
            Thank you for supporting the TGM Talent Management Academy.
          </h1>
          <p className="mt-4 text-base leading-7 text-[#35394D]">
            Your generosity is helping shape the next generation of Talent Managers and creative professionals. A confirmation has been sent to your email. We sincerely appreciate your support.
          </p>

          {sponsorResult && (
            <div className="mt-6 rounded-2xl border border-[#363A97]/15 bg-[#F3F4FF] p-6 text-left">
              <p className="text-sm font-semibold text-[#31356E]">Your sponsor code</p>
              <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-[#363A97]/15 bg-white px-4 py-3">
                <span className="font-mono text-lg font-bold tracking-wide text-[#EA4D25]">{sponsorResult.code}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(sponsorResult.code)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#363A97]/20 px-3 py-1.5 text-xs font-semibold text-[#363A97] hover:bg-[#363A97]/5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#35394D]">
                Share this with up to <strong>{sponsorResult.maxUses}</strong> {sponsorResult.maxUses === 1 ? "person" : "people"} — each gets <strong>{sponsorResult.discountPercent}% off</strong> their ₦250,000 registration fee at checkout.
              </p>
            </div>
          )}

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
            Support the TGM Talent Management Academy
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#35394D]">
            Thank you for choosing to invest in the future of Africa's creative industry. Your contribution will help provide training, mentorship, scholarships, and career development opportunities for emerging talents through the TGM Talent Management Academy.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-10 rounded-2xl border border-[#363A97]/10 bg-white p-6 shadow-xl shadow-[#363A97]/10 md:p-10">
          <div>
            <span className="mb-3 block text-sm font-semibold text-[#31356E]">
              Donation Amount<span className="text-[#EA4D25]"> *</span>
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              {TIERS.map((tier) => {
                const isSelected = !useCustomAmount && selectedTier?.label === tier.label;
                return (
                  <button
                    type="button"
                    key={tier.label}
                    onClick={() => {
                      setSelectedTier(tier);
                      setUseCustomAmount(false);
                    }}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-[#EA4D25] bg-[#fff4f0] ring-2 ring-[#EA4D25]/20"
                        : "border-[#363A97]/15 bg-white hover:border-[#363A97]/30"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#31356E]">{formatNaira(tier.amount)}</p>
                    <p className="text-xs text-[#35394D]/70">{tier.label}</p>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setUseCustomAmount(true)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  useCustomAmount
                    ? "border-[#EA4D25] bg-[#fff4f0] ring-2 ring-[#EA4D25]/20"
                    : "border-[#363A97]/15 bg-white hover:border-[#363A97]/30"
                }`}
              >
                <p className="text-sm font-semibold text-[#31356E]">Other Amount</p>
                <p className="text-xs text-[#35394D]/70">Enter your own amount</p>
              </button>
            </div>
            {useCustomAmount && (
              <input
                type="number"
                min={MIN_CUSTOM_AMOUNT}
                placeholder={`Enter amount in Naira (min. ${formatNaira(MIN_CUSTOM_AMOUNT)})`}
                className={`${inputClass} mt-3`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
            )}
            {errors.amount && <p className="mt-2 text-xs text-[#EA4D25]">{errors.amount}</p>}
          </div>

          <div className="rounded-2xl border border-[#363A97]/15 bg-[#F3F4FF] p-6">
            <label className="flex items-start gap-3 text-sm font-semibold text-[#31356E]">
              <input
                type="checkbox"
                checked={sponsor}
                onChange={(e) => {
                  setSponsor(e.target.checked);
                  if (!e.target.checked) setDiscountTier(null);
                }}
                className="mt-0.5 h-4 w-4 accent-[#EA4D25]"
              />
              I'd like this donation to fund discounted registrations for others
            </label>

            {sponsor && (
              <div className="mt-4">
                <span className="mb-2 block text-sm font-medium text-[#35394D]">Choose a discount tier to sponsor</span>
                <div className="grid grid-cols-3 gap-3">
                  {DISCOUNT_TIERS.map((tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setDiscountTier(tier)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                        discountTier === tier
                          ? "border-[#EA4D25] bg-white text-[#EA4D25] ring-2 ring-[#EA4D25]/20"
                          : "border-[#363A97]/15 bg-white text-[#31356E] hover:border-[#363A97]/30"
                      }`}
                    >
                      {tier}% off
                    </button>
                  ))}
                </div>
                {errors.discountTier && <p className="mt-2 text-xs text-[#EA4D25]">{errors.discountTier}</p>}
                {discountTier && getAmount() > 0 && getMaxUses() >= 1 && (
                  <p className="mt-3 text-sm leading-6 text-[#35394D]">
                    Your {formatNaira(getAmount())} donation will fund <strong>{getMaxUses()}</strong> registration{getMaxUses() === 1 ? "" : "s"} at {discountTier}% off — each person pays {formatNaira(REGISTRATION_FEE * (1 - discountTier / 100))} themselves.
                  </p>
                )}

                <div className="mt-4">
                  <Field label="Preferred Custom Discount Code" hint="e.g. Tolu001TGM — share this with the people you're sponsoring">
                    <input type="text" className={inputClass} value={preferredCode} onChange={(e) => setPreferredCode(e.target.value)} />
                  </Field>
                  {errors.preferredCode && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.preferredCode}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Full Name" required>
              <input type="text" className={inputClass} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
              {errors.fullName && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.fullName}</p>}
            </Field>

            <Field label="Email Address" required>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} />
              {errors.email && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.email}</p>}
            </Field>

            <Field label="Phone Number" hint="optional but recommended">
              <input type="tel" className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </Field>

            <Field label="Organisation/Company" hint="optional">
              <input type="text" className={inputClass} value={form.organisation} onChange={(e) => update("organisation", e.target.value)} />
            </Field>

            <Field label="Would you like to remain anonymous?" required>
              <div className="mt-1 flex gap-4">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-[#35394D]">
                    <input
                      type="radio"
                      name="anonymous"
                      value={opt}
                      checked={form.anonymous === opt}
                      onChange={(e) => update("anonymous", e.target.value)}
                      className="h-4 w-4 accent-[#EA4D25]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.anonymous && <p className="mt-1.5 text-xs text-[#EA4D25]">{errors.anonymous}</p>}
            </Field>
          </div>

          <Field label="Message of Support" hint="optional">
            <textarea rows={4} className={inputClass} value={form.message} onChange={(e) => update("message", e.target.value)} />
          </Field>

          <label className="flex items-start gap-3 text-sm text-[#35394D]">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#EA4D25]"
            />
            I understand that this contribution is a voluntary donation in support of the TGM Talent Management Academy.
          </label>
          {errors.understood && <p className="-mt-6 text-xs text-[#EA4D25]">{errors.understood}</p>}

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
                Processing...
              </>
            ) : (
              "Donate Now"
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
