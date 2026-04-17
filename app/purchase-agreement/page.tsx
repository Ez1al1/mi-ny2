"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BurialDay = "" | "weekday" | "saturday" | "sundayHoliday";
type BurialDepth = "" | "single" | "double";

const PLOT_PRICE = 5500;
const HEADSTONE_PRICE = 3500;
const SATURDAY_SURCHARGE = 700;

export default function PurchaseAgreementPage() {
  const [services, setServices] = useState({
    plot: true,
    burial: false,
    headstone: false,
  });

  const [burialDay, setBurialDay] = useState<BurialDay>("");
  const [burialDepth, setBurialDepth] = useState<BurialDepth>("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [acknowledgments, setAcknowledgments] = useState({
    general: false,
    overtime: false,
    noAddOns: false,
    headstoneRules: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const year = useMemo(() => new Date().getFullYear(), []);

  const burialBasePrice = useMemo(() => {
    if (!services.burial) return 0;
    if (burialDepth === "single") return 1800;
    if (burialDepth === "double") return 2000;
    return 0;
  }, [services.burial, burialDepth]);

  const burialDayAdjustment = useMemo(() => {
    if (!services.burial) return 0;
    if (burialDay === "saturday") return SATURDAY_SURCHARGE;
    if (burialDay === "sundayHoliday") return burialBasePrice;
    return 0;
  }, [services.burial, burialDay, burialBasePrice]);

  const total = useMemo(() => {
    return (
      (services.plot ? PLOT_PRICE : 0) +
      (services.headstone ? HEADSTONE_PRICE : 0) +
      burialBasePrice +
      burialDayAdjustment
    );
  }, [services.plot, services.headstone, burialBasePrice, burialDayAdjustment]);

  const isBurialComplete =
    !services.burial || (burialDay !== "" && burialDepth !== "");

  const allAcknowledged =
    acknowledgments.general &&
    acknowledgments.overtime &&
    acknowledgments.noAddOns &&
    acknowledgments.headstoneRules;

  const isFormComplete =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.phone.trim();

  const canSubmit = Boolean(isFormComplete && isBurialComplete && allAcknowledged);

  function updateService<K extends keyof typeof services>(key: K, value: boolean) {
    setServices((prev) => ({ ...prev, [key]: value }));

    if (key === "burial" && !value) {
      setBurialDay("");
      setBurialDepth("");
    }
  }

  function updateAcknowledgment<K extends keyof typeof acknowledgments>(
    key: K,
    value: boolean
  ) {
    setAcknowledgments((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!isFormComplete) {
      alert("Please complete your name, email, and phone number.");
      return;
    }

    if (!isBurialComplete) {
      alert("Please complete the burial details.");
      return;
    }

    if (!allAcknowledged) {
      alert("Please review and accept all required terms.");
      return;
    }

    try {
      const response = await fetch("/api/agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          services,
          burialDay,
          burialDepth,
          total,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Something went wrong submitting the form.");
      }

      setReferenceId(result.referenceId || "");
      setSubmitted(true);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong submitting the form."
      );
    }
  }

  if (submitted) {
    return (
      <div className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                MI
              </div>
              <div>
                <div className="font-semibold tracking-tight text-xs sm:text-sm">
                  MARKAZ E ISLAMI NEW YORK
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500">
                  Roslyn Cemetery · Muslim Burial Services
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
            >
              Back to Home
            </Link>
          </div>
        </header>

        <main className="py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <p className="inline-flex items-center gap-2 text-[11px] font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 mb-4 border border-emerald-100">
                Agreement Submitted
              </p>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-3">
                Thank you
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
                Your purchase agreement details have been submitted successfully.
                A cemetery administrator will review your information and follow up
                regarding next steps.
              </p>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 mb-5">
                <div className="text-[11px] uppercase tracking-wide text-emerald-700 font-medium">
                  Reference ID
                </div>
                <div className="text-lg sm:text-xl font-semibold text-slate-900 mt-1">
                  {referenceId}
                </div>
              </div>

              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  <span className="font-semibold text-slate-900">Contact:</span>{" "}
                  Cemetery Administrator — (516) 445-5549
                </p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow-sm"
                >
                  Return to Homepage
                </Link>
                <a
                  href="tel:5164455549"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-800 bg-white hover:border-emerald-500 hover:text-emerald-700"
                >
                  Call for Help
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-slate-50 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>© {year} Markaz e Islami New York · Non-profit organization.</div>
            <div className="flex flex-wrap items-center gap-3">
              <span>Roslyn Cemetery · Muslim Section</span>
              <span className="hidden sm:inline text-slate-300">·</span>
              <span>MI-NY.net</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 antialiased min-h-screen">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
              MI
            </div>
            <div>
              <div className="font-semibold tracking-tight text-xs sm:text-sm">
                MARKAZ E ISLAMI NEW YORK
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500">
                Roslyn Cemetery · Muslim Burial Services
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-200 text-[11px] sm:text-sm font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
            >
              Back to Home
            </Link>
            <a
              href="tel:5164455549"
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-600 text-white text-[11px] sm:text-sm font-medium hover:bg-emerald-700 shadow-sm"
            >
              Call for Help
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_#bbf7d0_0,_#ecfeff_30%,_#f9fafb_70%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 mb-3 border border-emerald-100">
            Direct agreement page
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
            Purchase agreement
          </h1>
          <p className="text-slate-600 text-[13px] sm:text-sm leading-relaxed max-w-3xl">
            This page can be shared directly with families as a standalone link.
            It uses the same styling and rules as the main MI-NY website.
          </p>
        </div>
      </section>

      <main className="py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10">
          <div className="space-y-6">
            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-4">
                1. Select services
              </h2>

              <div className="space-y-4 text-sm">
                <label className="flex items-start gap-3 cursor-pointer rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50/30">
                  <input
                    type="checkbox"
                    checked={services.plot}
                    onChange={(e) => updateService("plot", e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">Grave Plot</div>
                    <div className="text-slate-500">$5,500</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50/30">
                  <input
                    type="checkbox"
                    checked={services.burial}
                    onChange={(e) => updateService("burial", e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">Burial / Opening Services</div>
                    <div className="text-slate-500">
                      Single depth: $1,800 · Double depth: $2,000
                    </div>
                  </div>
                </label>

                {services.burial && (
                  <div className="grid md:grid-cols-2 gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <div>
                      <label className="block mb-1.5 text-xs font-medium text-slate-700">
                        Burial Depth
                      </label>
                      <select
                        value={burialDepth}
                        onChange={(e) => setBurialDepth(e.target.value as BurialDepth)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select burial depth</option>
                        <option value="single">Single Depth — $1,800</option>
                        <option value="double">Double Depth — $2,000</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1.5 text-xs font-medium text-slate-700">
                        Burial Day
                      </label>
                      <select
                        value={burialDay}
                        onChange={(e) => setBurialDay(e.target.value as BurialDay)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select burial day</option>
                        <option value="weekday">Monday–Friday</option>
                        <option value="saturday">Saturday (+$700)</option>
                        <option value="sundayHoliday">Sunday / Holiday (burial fee doubled)</option>
                      </select>
                    </div>
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50/30">
                  <input
                    type="checkbox"
                    checked={services.headstone}
                    onChange={(e) => updateService("headstone", e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">Standard Headstone Package</div>
                    <div className="text-slate-500">
                      $3,500 · Includes foundation and up to 90 characters
                    </div>
                  </div>
                </label>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-4">
                2. Important restrictions
              </h2>

              <div className="space-y-4 text-sm">
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <div className="font-semibold text-slate-900">No add-ons at burial</div>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    Services cannot be changed or added at the time of burial under
                    any circumstances.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="font-semibold text-slate-900">Overtime charges</div>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    Saturday overtime begins after 12:00 PM at $300 per hour. Delays,
                    including late arrival of the deceased, may result in additional
                    charges.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">Headstone rules</div>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    No ledger stones. One headstone per grave. Wording only. Maximum
                    90 total characters.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-4">
                3. Agreement details
              </h2>

              <div className="max-h-[420px] overflow-y-auto rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  <span className="font-semibold text-slate-900">Grave Purchase:</span>{" "}
                  The price per grave is $5,500. This includes the grave plot and
                  perpetual care. Twenty-five percent of each plot sale is allocated
                  to a perpetual care fund for ongoing cemetery maintenance.
                </p>

                <p>
                  <span className="font-semibold text-slate-900">Burial Pricing:</span>{" "}
                  Monday through Friday pricing is $1,800 for single depth burial and
                  $2,000 for double depth burial. Saturday burial adds $700. Sunday
                  and holiday burial pricing is double the standard burial fee.
                </p>

                <p>
                  <span className="font-semibold text-slate-900">Saturday Overtime:</span>{" "}
                  Overtime begins after 12:00 PM on Saturdays and is charged at $300
                  per hour. The latest Saturday burial time is 3:00 PM unless
                  approved in advance for religious accommodation.
                </p>

                <p>
                  <span className="font-semibold text-slate-900">Headstone Package:</span>{" "}
                  The standard headstone package is $3,500 and includes one
                  headstone, foundation, and up to 90 characters of inscription.
                </p>

                <p>
                  <span className="font-semibold text-slate-900">Headstone Restrictions:</span>{" "}
                  No ledgers are allowed on top of the grave. Only one headstone is
                  allowed per grave. The only permitted customization is wording,
                  limited to 90 total characters.
                </p>

                <p>
                  <span className="font-semibold text-slate-900">Maximum Headstone Size:</span>{" "}
                  36 inches wide, 42 inches high including base, and 12 inches deep.
                </p>

                <p>
                  <span className="font-semibold text-slate-900">No Add-Ons:</span>{" "}
                  Additional requests must be approved in advance. No add-ons or
                  service changes are allowed at the time of burial.
                </p>

                <p>
                  <span className="font-semibold text-slate-900">Contact:</span>{" "}
                  Cemetery Administrator — (516) 445-5549
                </p>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-4">
                4. Purchaser information
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />

                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />

                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-4">
                5. Review and accept
              </h2>

              <div className="space-y-3 text-sm">
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={acknowledgments.general}
                    onChange={(e) => updateAcknowledgment("general", e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-slate-700">
                    I have read and agree to the pricing, terms, and restrictions listed above.
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={acknowledgments.overtime}
                    onChange={(e) => updateAcknowledgment("overtime", e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-slate-700">
                    I understand that overtime charges of $300 per hour may apply if there are delays.
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={acknowledgments.noAddOns}
                    onChange={(e) => updateAcknowledgment("noAddOns", e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-slate-700">
                    I understand that no add-ons or service changes are allowed at the time of burial.
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={acknowledgments.headstoneRules}
                    onChange={(e) => updateAcknowledgment("headstoneRules", e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-slate-700">
                    I understand that only one headstone is allowed, no ledgers are permitted,
                    and inscription wording is limited to 90 characters.
                  </span>
                </label>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={
                    "inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-sm " +
                    (canSubmit
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed")
                  }
                >
                  Submit Agreement
                </button>

                <a
                  href="tel:5164455549"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-800 bg-white hover:border-emerald-500 hover:text-emerald-700"
                >
                  Call for help
                </a>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-slate-900 text-slate-50 rounded-3xl p-5 shadow-sm">
              <div className="text-sm font-semibold mb-1">Pricing summary</div>
              <p className="text-[11px] text-slate-300 mb-4">
                Review your estimated total below. Overtime is not included.
              </p>

              <div className="space-y-3 text-xs">
                {services.plot && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Grave Plot</span>
                    <span>${PLOT_PRICE.toLocaleString()}</span>
                  </div>
                )}

                {services.burial && burialBasePrice > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Burial Services</span>
                    <span>${burialBasePrice.toLocaleString()}</span>
                  </div>
                )}

                {services.burial && burialDay === "saturday" && burialDayAdjustment > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Saturday Surcharge</span>
                    <span>${SATURDAY_SURCHARGE.toLocaleString()}</span>
                  </div>
                )}

                {services.burial &&
                  burialDay === "sundayHoliday" &&
                  burialDayAdjustment > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Sunday / Holiday Adjustment</span>
                      <span>${burialDayAdjustment.toLocaleString()}</span>
                    </div>
                  )}

                {services.headstone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Headstone Package</span>
                    <span>${HEADSTONE_PRICE.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-700 my-4" />

              <div className="flex items-center justify-between">
                <span className="font-medium">Estimated Total</span>
                <span className="text-lg font-semibold text-emerald-400">
                  ${total.toLocaleString()}
                </span>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-slate-300">
                Saturday overtime begins after 12:00 PM at $300 per hour. Sunday
                and holiday burial pricing is double the standard burial fee.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-xs">
              <div className="text-sm font-semibold text-slate-900 mb-2">
                Need help right away?
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                If your family is arranging a burial urgently or needs help
                understanding the process, please call us directly.
              </p>
              <a
                href="tel:5164455549"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow-sm"
              >
                Call (516) 445-5549
              </a>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>© {year} Markaz e Islami New York · Non-profit organization.</div>
          <div className="flex flex-wrap items-center gap-3">
            <span>Roslyn Cemetery · Muslim Section</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span>MI-NY.net</span>
          </div>
        </div>
      </footer>
    </div>
  );
}