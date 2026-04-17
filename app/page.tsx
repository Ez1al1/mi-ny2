"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PlotStatus = "available" | "reserved" | "occupied" | "path";

interface Plot {
  id: string;
  label: string;
  status: PlotStatus;
}

const PRICE_PER_PLOT = 6000;
const MAINTENANCE_PER_PLOT = 150;
const PAYMENT_PLAN_MIN_PLOTS = 2;
const PAYMENT_PLAN_MONTHS = 12;

// 5 rows x 8 columns = 40 "cells"
const PLOTS: Plot[] = [
  { id: "A1", label: "A1", status: "available" },
  { id: "A2", label: "A2", status: "available" },
  { id: "A3", label: "A3", status: "available" },
  { id: "A4", label: "A4", status: "reserved" },
  { id: "A5", label: "A5", status: "available" },
  { id: "A6", label: "A6", status: "available" },
  { id: "A7", label: "A7", status: "occupied" },
  { id: "A8", label: "A8", status: "available" },

  { id: "B1", label: "B1", status: "available" },
  { id: "B2", label: "B2", status: "available" },
  { id: "B3", label: "B3", status: "occupied" },
  { id: "PATH1", label: "Path", status: "path" },
  { id: "B4", label: "B4", status: "available" },
  { id: "B5", label: "B5", status: "available" },
  { id: "B6", label: "B6", status: "available" },
  { id: "B7", label: "B7", status: "available" },

  { id: "C1", label: "C1", status: "available" },
  { id: "C2", label: "C2", status: "available" },
  { id: "C3", label: "C3", status: "available" },
  { id: "C4", label: "C4", status: "available" },
  { id: "PATH2", label: "Path", status: "path" },
  { id: "C5", label: "C5", status: "available" },
  { id: "C6", label: "C6", status: "available" },
  { id: "C7", label: "C7", status: "available" },

  { id: "D1", label: "D1", status: "available" },
  { id: "D2", label: "D2", status: "available" },
  { id: "D3", label: "D3", status: "occupied" },
  { id: "D4", label: "D4", status: "occupied" },
  { id: "D5", label: "D5", status: "available" },
  { id: "PATH3", label: "Path", status: "path" },
  { id: "D6", label: "D6", status: "available" },
  { id: "D7", label: "D7", status: "available" },

  { id: "E1", label: "E1", status: "available" },
  { id: "E2", label: "E2", status: "available" },
  { id: "E3", label: "E3", status: "available" },
  { id: "E4", label: "E4", status: "available" },
  { id: "E5", label: "E5", status: "available" },
  { id: "E6", label: "E6", status: "available" },
  { id: "E7", label: "E7", status: "available" },
  { id: "E8", label: "E8", status: "available" },
];

function formatCurrency(num: number) {
  return "$" + num.toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function HomePage() {
  const [selectedPlots, setSelectedPlots] = useState<string[]>([]);
  const [includeMaintenance, setIncludeMaintenance] = useState(false);
  const [donation, setDonation] = useState<number | "">("");
  const [showModal, setShowModal] = useState(false);
  const [deceasedActive, setDeceasedActive] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const year = useMemo(() => new Date().getFullYear(), []);

  const { baseSubtotal, maintenanceSubtotal, total, monthlyPayment } = useMemo(() => {
    const base = selectedPlots.length * PRICE_PER_PLOT;
    const maintenance = includeMaintenance ? selectedPlots.length * MAINTENANCE_PER_PLOT : 0;
    const donationValue = typeof donation === "number" && donation > 0 ? donation : 0;
    const total = base + maintenance + donationValue;

    let monthly = 0;
    if (selectedPlots.length >= PAYMENT_PLAN_MIN_PLOTS && base > 0) {
      monthly = Math.round(base / PAYMENT_PLAN_MONTHS);
    }

    return {
      baseSubtotal: base,
      maintenanceSubtotal: maintenance,
      total,
      monthlyPayment: monthly,
    };
  }, [selectedPlots, includeMaintenance, donation]);

  const handleTogglePlot = (plot: Plot) => {
    if (plot.status !== "available") return;

    setSelectedPlots((prev) =>
      prev.includes(plot.id) ? prev.filter((p) => p !== plot.id) : [...prev, plot.id]
    );
  };

  const handleDonationChange = (value: string) => {
    if (value === "") {
      setDonation("");
      return;
    }
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setDonation(parsed);
  };

  const handleOpenModal = () => {
    if (selectedPlots.length === 0) return;
    setShowModal(true);
  };

  const handleSubmitReservation = () => {
    alert(
      "Thank you. Your reservation request has been recorded. In the live system, this will securely send your details to the MI-NY team, who will verify availability and contact you with next steps."
    );
    setShowModal(false);
  };

  const plotsCountLabel =
    selectedPlots.length + (selectedPlots.length === 1 ? " plot" : " plots");

  const isPaymentPlanEligible = selectedPlots.length >= PAYMENT_PLAN_MIN_PLOTS && baseSubtotal > 0;

  const getPlotClasses = (plot: Plot) => {
    const base =
      "flex items-center justify-center h-8 rounded-md text-[10px] sm:text-[11px] transition-transform";
    if (plot.status === "available") {
      const isSelected = selectedPlots.includes(plot.id);
      if (isSelected) {
        return (
          base +
          " border border-emerald-700 bg-emerald-600 text-white shadow-sm scale-[1.03] cursor-pointer"
        );
      }
      return (
        base +
        " border border-emerald-400 bg-emerald-50 text-slate-900 cursor-pointer hover:border-emerald-500"
      );
    }
    if (plot.status === "reserved") {
      return base + " border border-slate-300 bg-slate-100 text-slate-400";
    }
    if (plot.status === "occupied") {
      return base + " border border-rose-200 bg-rose-50 text-rose-400";
    }
    return base + " border border-sky-200 bg-sky-50 text-slate-500";
  };

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
          <nav className="hidden md:flex items-center gap-6 text-xs">
            <a href="#how-it-works" className="text-slate-700 hover:text-emerald-700">
              How it works
            </a>
            <a href="#plots" className="text-slate-700 hover:text-emerald-700">
              Graves
            </a>
            <a href="#services" className="text-slate-700 hover:text-emerald-700">
              Funeral services
            </a>
            <a href="#testimonials" className="text-slate-700 hover:text-emerald-700">
              Testimonials
            </a>
            <a href="#hours" className="text-slate-700 hover:text-emerald-700">
              Hours &amp; Location
            </a>
            <a href="#support" className="text-slate-700 hover:text-emerald-700">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex px-3 py-1.5 rounded-full border border-slate-200 text-[11px] font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700">
              عربي / اردو (Soon)
            </button>
            <a
              href="#contact"
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-600 text-white text-xs sm:text-sm font-medium hover:bg-emerald-700 shadow-sm"
            >
              Need Help Now
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_#bbf7d0_0,_#ecfeff_30%,_#f9fafb_70%)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 mb-3 border border-emerald-100">
                A project of Markaz e Islami New York
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
                A dignified resting place
                <br className="hidden sm:block" />
                for our Muslim community.
              </h1>
              <p className="text-slate-600 text-[13px] sm:text-sm leading-relaxed mb-4">
                MI-NY.net is a one-stop, Sharia-aligned platform to reserve a grave at our
                dedicated Muslim section in Roslyn Cemetery. Whether you are planning ahead
                or arranging on short notice, we make the process clear, gentle, and organized.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <a
                  href="#plots"
                  className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-emerald-600 text-white text-xs sm:text-sm font-medium hover:bg-emerald-700 shadow-sm"
                >
                  View Available Graves
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 bg-white hover:border-emerald-500 hover:text-emerald-700"
                >
                  Learn how it works
                </a>
                <Link
                  href="/purchase-agreement"
                  className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 bg-white hover:border-emerald-500 hover:text-emerald-700"
                >
                  Review Purchase Agreement
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600 mb-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Islamic burial guidance</div>
                    <div>Coordinated with local imams &amp; community leaders.</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Transparent pricing</div>
                    <div>Clear grave, maintenance, payment plan &amp; donation options.</div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Grave price:</span> $6,000 per grave · 40 total graves
                available · interest-free plans for 2+ graves.
              </p>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Roslyn Cemetery – MI-NY Section
                    </div>
                    <div className="text-[11px] text-slate-500">Aerial overview (video)</div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-medium text-emerald-700">
                    Phase 1 Now Open
                  </span>
                </div>
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/VIDEO_ID"
                      title="Roslyn Cemetery MI-NY Section Aerial View"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
                    <div>Use this video to understand rows, walkways, and family sections.</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-3 h-3 rounded-sm bg-emerald-500/80 border border-emerald-300/40" />
                        <span>Available</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-3 h-3 rounded-sm bg-slate-300" />
                        <span>Reserved</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-3 h-3 rounded-sm bg-rose-200" />
                        <span>Occupied</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 lg:absolute lg:-bottom-6 lg:-right-2 w-full lg:w-56 bg-white rounded-2xl shadow-lg border border-slate-100 p-3 text-[11px]">
                <div className="font-semibold text-slate-800 mb-1">You are not alone.</div>
                <p className="text-slate-500 mb-2">
                  Our volunteers can speak with your family, explain each step, and coordinate with your masjid or funeral home.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700 font-semibold text-[11px]">
                    Urgent line: (555) 555-1212
                  </span>
                  <span className="text-[10px] text-slate-400">Daily · 9am–10pm</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-10 lg:py-14 border-b border-slate-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900 mb-1">
                  A clear, step-by-step process.
                </h2>
                <p className="text-[13px] sm:text-sm text-slate-600 max-w-xl">
                  Whether you are planning years in advance or facing an urgent need, our process is designed to be simple,
                  transparent, and aligned with Islamic burial principles.
                </p>
              </div>
              <div className="text-[11px] text-slate-500 max-w-sm">
                <span className="font-semibold text-slate-700">Note:</span> MI-NY coordinates grave allocation; funeral
                services and janazah arrangements are handled with your chosen masjid and funeral home.
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4 text-xs">
              {[
                {
                  title: "Explore the layout",
                  desc: "Review the aerial video and map to understand rows, orientation, and nearby family sections.",
                },
                {
                  title: "Select your graves",
                  desc: "Choose single, side-by-side, or family plots using our simple à-la-carte selector.",
                },
                {
                  title: "Add maintenance & services",
                  desc: "Include regular upkeep and select optional funeral and religious services as needed.",
                },
                {
                  title: "Verify & complete booking",
                  desc: "Fill out grave holder details, deceased information (if applicable), and choose payment or payment plan.",
                },
              ].map((step, i) => (
                <div
                  key={step.title}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2"
                >
                  <div className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-emerald-600 text-white text-[11px] font-semibold">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">{step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="plots" className="py-10 lg:py-14 bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-10">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                      Available grave sites
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-600">
                      Select one or more plots. You can adjust maintenance, donations, and see payment plan options on the right.
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                    Section A · 40 total plots
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mb-4">
                  <div className="inline-flex items-center gap-1">
                    <span className="w-4 h-4 rounded-md border border-emerald-500 bg-emerald-50" /> Available
                  </div>
                  <div className="inline-flex items-center gap-1">
                    <span className="w-4 h-4 rounded-md border border-slate-300 bg-slate-100" /> Reserved
                  </div>
                  <div className="inline-flex items-center gap-1">
                    <span className="w-4 h-4 rounded-md border border-rose-200 bg-rose-50" /> Occupied
                  </div>
                  <div className="inline-flex items-center gap-1">
                    <span className="w-4 h-4 rounded-md border border-sky-200 bg-sky-50" /> Path / Walkway
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold text-slate-800">Section A – Rows 1–5</div>
                    <div className="text-[11px] text-slate-500">Tap to select · 6K per grave</div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-8 gap-1.5 text-[10px] sm:text-[11px]">
                      {PLOTS.map((plot) => (
                        <button
                          key={plot.id}
                          type="button"
                          className={getPlotClasses(plot)}
                          onClick={() => handleTogglePlot(plot)}
                          disabled={plot.status !== "available"}
                        >
                          {plot.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      For a full, zoomable aerial and detailed map with grave numbers, please contact our team. This
                      layout is a simplified preview synchronized with the video above.
                    </p>
                  </div>
                </div>
              </div>

              <aside className="w-full lg:w-80 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Your selection summary</h3>
                  <p className="text-[11px] text-slate-500">
                    You can finalize online or request a call before making payment. Price per grave:{" "}
                    <span className="font-semibold">$6,000</span>.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800">Selected graves</span>
                      <span className="text-slate-500">{plotsCountLabel}</span>
                    </div>
                    <div className="min-h-[2.25rem] rounded-xl bg-slate-50 border border-slate-200 px-2 py-1.5 flex flex-wrap gap-1 text-[11px] text-slate-700">
                      {selectedPlots.length === 0 ? (
                        <span className="text-slate-400">No plots selected yet.</span>
                      ) : (
                        selectedPlots.map((id) => (
                          <span
                            key={id}
                            className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800"
                          >
                            {id}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Grave price (per plot)</span>
                      <span className="font-semibold text-slate-900">$6,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Grave subtotal</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(baseSubtotal)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        checked={includeMaintenance}
                        onChange={(e) => setIncludeMaintenance(e.target.checked)}
                      />
                      <div className="space-y-0.5">
                        <div className="text-slate-800 font-medium">Include annual maintenance</div>
                        <div className="text-[11px] text-slate-500">
                          +$150 per plot per year · covers basic landscaping, headstone cleaning, and row markers.
                        </div>
                      </div>
                    </label>

                    <div className="space-y-1">
                      <label className="flex items-center justify-between text-slate-800">
                        Additional sadaqah (optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">$</span>
                        <input
                          type="number"
                          min={0}
                          step={10}
                          placeholder="0"
                          value={donation === "" ? "" : donation.toString()}
                          onChange={(e) => handleDonationChange(e.target.value)}
                          className="w-24 px-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <span className="text-[11px] text-slate-500">
                          Helps subsidize graves for families in hardship.
                        </span>
                      </div>
                    </div>
                  </div>

                  {isPaymentPlanEligible && (
                    <div className="border-t border-slate-100 pt-3 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Interest-free plan available</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          2+ graves
                        </span>
                      </div>
                      <p className="text-slate-600">
                        Eligible selections can be split into monthly payments with no interest. Ideal for families planning
                        multiple adjacent plots.
                      </p>
                      <p className="text-slate-700 font-medium">
                        Estimated monthly (12 months): {formatCurrency(monthlyPayment)}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">Estimated total</span>
                    <span className="font-semibold text-emerald-700">{formatCurrency(total)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenModal}
                    disabled={selectedPlots.length === 0}
                    className={
                      "w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow-sm transition " +
                      (selectedPlots.length === 0 ? "opacity-60 cursor-not-allowed" : "")
                    }
                  >
                    Proceed to Secure Reservation
                  </button>

                  <Link
                    href="/purchase-agreement"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-800 bg-white hover:border-emerald-500 hover:text-emerald-700"
                  >
                    Review Purchase Agreement
                  </Link>

                  <p className="text-[11px] text-slate-500">
                    Next step: verify grave holder details, optionally provide deceased information, and choose payment in
                    full or interest-free plan (where eligible).
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="services" className="py-10 lg:py-14 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
              <div className="flex-1 space-y-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">
                  Funeral services &amp; costs
                </h2>
                <p className="text-[13px] sm:text-sm text-slate-600">
                  In addition to grave allocation, we maintain a catalog of commonly requested services. Final pricing may
                  vary by funeral home and masjid, but these ranges help families plan with clarity.
                </p>

                <div className="overflow-x-auto text-xs mt-2">
                  <table className="min-w-full border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Service</th>
                        <th className="px-3 py-2 text-left font-semibold">Description</th>
                        <th className="px-3 py-2 text-right font-semibold">Typical Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="px-3 py-2 font-medium">Grave opening &amp; closing</td>
                        <td className="px-3 py-2 text-slate-600">
                          Cemetery crew to open and close the grave on day of burial.
                        </td>
                        <td className="px-3 py-2 text-right">$1,200–$1,800</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium">Body preparation (ghusl)</td>
                        <td className="px-3 py-2 text-slate-600">
                          Ritual washing and shrouding in accordance with Islamic guidance.
                        </td>
                        <td className="px-3 py-2 text-right">$500–$800</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium">Transportation</td>
                        <td className="px-3 py-2 text-slate-600">
                          Hearse and transport from hospital/home to masjid and cemetery.
                        </td>
                        <td className="px-3 py-2 text-right">$400–$900</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium">Imam / religious services</td>
                        <td className="px-3 py-2 text-slate-600">
                          Janazah prayer, graveside dua; honorarium for imam or scholar.
                        </td>
                        <td className="px-3 py-2 text-right">$200–$500</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-medium">Death certificate &amp; paperwork</td>
                        <td className="px-3 py-2 text-slate-600">
                          Coordination of official documents and required certificates.
                        </td>
                        <td className="px-3 py-2 text-right">$150–$300</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-slate-500">
                  MI-NY does not profit from funeral services. We simply connect families with trusted providers and ensure
                  services align with Islamic principles and cemetery regulations.
                </p>
              </div>

              <div className="w-full lg:w-80 bg-slate-900 text-slate-100 rounded-3xl p-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#22c55e,_transparent_60%)]" />
                <div className="relative space-y-3 text-[11px]">
                  <h3 className="text-sm font-semibold">Future services &amp; add-ons</h3>
                  <p className="text-slate-200">
                    As the community’s needs grow, we are planning additional offerings that remain simple, respectful, and
                    within Islamic guidelines.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px]">
                        •
                      </span>
                      <div>
                        <div className="font-medium text-slate-50">Coffin / casket options</div>
                        <div className="text-slate-200/80">
                          Basic, compliant designs for those whose local regulations require a casket.
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px]">
                        •
                      </span>
                      <div>
                        <div className="font-medium text-slate-50">Headstone &amp; marker catalog</div>
                        <div className="text-slate-200/80">
                          Simple, modest gravestones consistent with cemetery and religious guidelines.
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px]">
                        •
                      </span>
                      <div>
                        <div className="font-medium text-slate-50">Digital grave locator</div>
                        <div className="text-slate-200/80">
                          Map-based search so family abroad can find and view loved ones’ graves.
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px]">
                        •
                      </span>
                      <div>
                        <div className="font-medium text-slate-50">Family section planning</div>
                        <div className="text-slate-200/80">
                          Reserve small clusters of graves for multi-generation family sections.
                        </div>
                      </div>
                    </li>
                  </ul>
                  <p className="pt-2 border-t border-slate-700/60 mt-2">
                    If there is a specific product or service your family would find beneficial, please let us know. This
                    project exists to serve the community with ihsan (excellence).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-10 lg:py-14 bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">
                  Families we’ve supported
                </h2>
                <p className="text-[13px] sm:text-sm text-slate-600">
                  Every family’s situation is unique. Our goal is that no one feels rushed, confused, or alone at a time of
                  loss.
                </p>
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Names and stories below are shared with permission, with personal details simplified to protect privacy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <article className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">S. Khan &amp; Family</div>
                    <div className="text-[11px] text-slate-500">Pre-planning · 2 adjacent graves</div>
                  </div>
                </div>
                <p className="text-slate-600">
                  “We wanted to plan quietly without alarming our children. The team walked us through every step and helped us
                  choose two graves side-by-side with an interest-free plan. It gave us peace of mind.”
                </p>
              </article>

              <article className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">A. &amp; R. Family</div>
                    <div className="text-[11px] text-slate-500">Urgent burial · hardship assistance</div>
                  </div>
                </div>
                <p className="text-slate-600">
                  “Our father passed unexpectedly. We had limited savings. MI-NY helped us secure a grave quickly and guided us
                  to a hardship subsidy for part of the cost. We’ll never forget their kindness.”
                </p>
              </article>

              <article className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                    H
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">H. &amp; Z. Couple</div>
                    <div className="text-[11px] text-slate-500">Planning from abroad</div>
                  </div>
                </div>
                <p className="text-slate-600">
                  “We live overseas but wanted our burial in New York near family. The video, map, and online forms made it
                  possible to complete everything remotely and with full transparency.”
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="support" className="py-10 lg:py-14 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-10">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900 mb-3">
                You and your family are heard and cared for.
              </h2>
              <p className="text-[13px] sm:text-sm text-slate-600 mb-5">
                Planning for burial can feel heavy, especially in moments of loss. Our role is to remove confusion, offer
                clarity, and treat each family with respect and privacy.
              </p>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[15px]">
                    🕊
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Dedicated family liaison</div>
                    <p className="text-slate-600">
                      A real person who can walk you through the process, answer questions about Islamic burial practices, and
                      coordinate with your masjid or funeral home.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[15px]">
                    ⏱
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Urgent and advance planning</div>
                    <p className="text-slate-600">
                      Whether a loved one has just passed or you are planning for the future, our team responds quickly and
                      with discretion.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[15px]">
                    🤝
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Language &amp; cultural support</div>
                    <p className="text-slate-600">
                      Volunteers are available in English, Urdu, Punjabi and other languages, as available.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-xs space-y-3 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Common questions</h3>

              {[
                {
                  q: "Is this purchase Sharia-compliant?",
                  a: "Our contracts and process are structured in consultation with local scholars to avoid interest (riba) and ensure clear, transparent ownership of the grave space within cemetery regulations.",
                },
                {
                  q: "What if I need to arrange burial very quickly?",
                  a: "Call our urgent line listed below. We will prioritize your case, help you select a grave, and coordinate with the cemetery and your funeral home to expedite arrangements.",
                },
                {
                  q: "Can we purchase multiple family plots together?",
                  a: "Yes. Our à-la-carte model allows you to reserve adjacent graves for spouses, siblings, or multi-generation family sections, subject to availability. For 2+ graves, we can arrange interest-free payment plans.",
                },
                {
                  q: "What does maintenance actually include?",
                  a: "Maintenance covers basic landscaping, tidy pathways, and gentle cleaning of the headstone/marker. It does not include elaborate structures or decorations, to remain in line with cemetery and Islamic guidelines.",
                },
                {
                  q: "How are donations used?",
                  a: "Donations first help subsidize graves for families with financial hardship. Additional funds support improvements to the Muslim section, community outreach, and administrative costs.",
                },
              ].map((item) => (
                <details
                  key={item.q}
                  className="group border-b last:border-b-0 border-slate-100 pb-2 last:pb-0"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-medium text-slate-800">{item.q}</span>
                    <span className="text-slate-400 group-open:rotate-90 transition-transform">›</span>
                  </summary>
                  <p className="mt-1.5 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="hours" className="py-10 lg:py-14 bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="space-y-3 text-sm">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">
                Hours &amp; location
              </h2>
              <p className="text-[13px] sm:text-sm text-slate-600">
                Visiting hours and office availability are coordinated with Roslyn Cemetery policies. Please confirm times in
                advance during holidays and severe weather.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5">
                  <div className="font-semibold text-slate-900">Grave site visiting hours</div>
                  <p className="text-slate-600">
                    <span className="font-medium">Daily:</span> 9:00 AM – 5:00 PM
                    <br />
                    <span className="font-medium">Address:</span> Roslyn Cemetery – Muslim Section (MI-NY Allocation)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Please arrive at least 15 minutes before closing time. Gates may close earlier in winter months.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5">
                  <div className="font-semibold text-slate-900">Office &amp; phone hours</div>
                  <p className="text-slate-600">
                    <span className="font-medium">Phone &amp; email:</span> 9:00 AM – 10:00 PM
                    <br />
                    <span className="font-medium">In-person meetings:</span> By appointment.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Urgent burial needs are prioritized. Leave a voicemail or use the urgent line and we will return your call
                    promptly.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Location overview</div>
                  <div className="text-[11px] text-slate-500">Map placeholder · embed coming soon</div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-[10px] text-emerald-700 border border-emerald-100">
                  Google Maps link
                </span>
              </div>
              <div className="aspect-video rounded-2xl bg-slate-900 flex items-center justify-center text-slate-100 text-[11px] text-center px-4">
                A small embedded map or screenshot of Roslyn Cemetery will appear here, with the MI-NY allocated section
                clearly marked.
              </div>
              <p className="text-[11px] text-slate-500">
                For exact pin location and driving directions, please text or email us and we will share a direct Google Maps link.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="py-10 lg:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 text-slate-50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1 space-y-3">
                <h2 className="text-xl sm:text-2xl font-semibold">Need to speak with someone?</h2>
                <p className="text-[13px] sm:text-sm text-slate-200">
                  If you are arranging a funeral on short notice or have questions before making a decision, please reach out.
                  We treat every conversation with discretion and compassion.
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <div className="text-[11px] text-slate-400">Urgent burial line</div>
                      <div className="font-semibold text-slate-50">(555) 555-1212</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">General inquiries</div>
                      <div className="font-semibold text-slate-50">info@mi-ny.net</div>
                    </div>
                  </div>
                </div>
              </div>
              <form className="w-full md:w-80 space-y-3 text-xs">
                <div>
                  <label className="block mb-1 text-slate-100">Your name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Ahmed Khan"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-100">Email or phone</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="We’ll use this to respond"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-100">How can we help?</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Share as much or as little as you feel comfortable."
                  />
                </div>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
                >
                  Request a call back
                </button>
                <p className="text-[11px] text-slate-400">
                  We aim to respond the same day between 9am–10pm ET. For emergencies, please call the urgent line.
                </p>
              </form>
            </div>
          </div>
        </section>
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

      {showModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4 sm:px-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                  Grave reservation details
                </h3>
                <p className="text-[11px] text-slate-500">
                  Please confirm grave holder information and, if applicable, details of the deceased.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">Summary</div>
                  <div className="text-[11px] text-slate-600">
                    Selected graves: {selectedPlots.length} · Estimated total: {formatCurrency(total)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-800">
                  {selectedPlots.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 mb-1"
                    >
                      {id}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Final pricing will be confirmed by our team before any payment is processed.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-[13px] font-semibold text-slate-900">Grave holder information</h4>
                  <div>
                    <label className="block mb-1 text-slate-700">Full name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Person responsible for this reservation"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-700">Relationship to deceased / future occupant</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., Self, spouse, parent, child"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-700">Phone number</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Best number to reach you"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-700">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="For confirmations and receipts"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-700">Preferred masjid / imam (optional)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="If you already have one in mind"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[13px] font-semibold text-slate-900">
                      Deceased information (if applicable)
                    </h4>
                    <label className="inline-flex items-center gap-1 text-[11px] text-slate-700">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        checked={deceasedActive}
                        onChange={(e) => setDeceasedActive(e.target.checked)}
                      />
                      <span>We are reporting a current passing</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    If this is pre-planning, you can leave this section blank and our team will collect details if and when
                    needed.
                  </p>
                  <div
                    className={
                      "space-y-2 " + (deceasedActive ? "" : "opacity-50 pointer-events-none")
                    }
                  >
                    <div>
                      <label className="block mb-1 text-slate-700">Full name of deceased</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="As it will appear on documents"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1 text-slate-700">Date of birth</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-slate-700">Date of passing</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-700">Preferred janazah masjid (if decided)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Name &amp; city"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-700">Funeral home (if applicable)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="If you are already working with one"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-slate-700">Additional notes</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Any timing constraints, travel considerations, or medical details we should be mindful of."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                <h4 className="text-[13px] font-semibold text-slate-900">Payment preference</h4>
                <p className="text-[11px] text-slate-500">
                  No payment is processed on this step. Our team will review your request, verify availability, and then send
                  a secure payment link or schedule a call.
                </p>
                <div className="grid sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentPreference"
                      defaultChecked
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700">Pay in full</span>
                  </label>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentPreference"
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700">Interest-free plan (if eligible)</span>
                  </label>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentPreference"
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700">Discuss options by phone</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-200 mt-1">
                <p className="text-[11px] text-slate-500">
                  By submitting this request, you are not committing to a purchase. A representative will confirm details and
                  next steps.
                </p>
                <button
                  type="button"
                  onClick={handleSubmitReservation}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-700"
                >
                  Submit reservation request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowChat((prev) => !prev)}
        className="fixed z-30 bottom-4 right-4 sm:bottom-6 sm:right-6 h-11 w-11 rounded-full bg-emerald-600 text-white shadow-lg flex items-center justify-center text-xl hover:bg-emerald-700"
        aria-label="Chat with us"
      >
        💬
      </button>

      {showChat && (
        <div className="fixed z-30 bottom-20 right-4 sm:right-6 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 text-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[13px] font-semibold text-slate-900">Ask a quick question</div>
              <div className="text-[11px] text-slate-500">Chat assistant (beta)</div>
            </div>
            <button
              type="button"
              onClick={() => setShowChat(false)}
              className="text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>
          </div>
          <div className="text-[11px] text-slate-600 mb-2">
            This space can be connected to a live chatbot provider (e.g., Intercom, Tidio, or a custom AI assistant). For
            now, you can quickly choose a topic:
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <button className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px]">
              Pricing &amp; payment plans
            </button>
            <button className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px]">
              Urgent burial
            </button>
            <button className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px]">
              Islamic guidelines
            </button>
            <button className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px]">
              Funeral services
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            To integrate a full chatbot, you’ll eventually paste your provider’s embed script here or use a dedicated widget.
          </p>
        </div>
      )}
    </div>
  );
}