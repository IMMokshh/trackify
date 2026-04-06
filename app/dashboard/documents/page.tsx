"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText, Download, Eye, Shield, Users, Gavel, Calendar,
  AlertTriangle, Car, IndianRupee, Droplets, Wrench, UserCheck, Vote, BookUser,
} from "lucide-react";
import jsPDF from "jspdf";
import { supabase } from "@/lib/supabase";

const SOCIETY_NAME = "Greenwood Heights Co-operative Housing Society";
const SOCIETY_REG = "MH/MUM/HSG/TC-II/12847/2019";
const SOCIETY_ADDRESS = "Plot No. 14, Sector 7, Kharghar, Navi Mumbai - 410210";

type DocDef = {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  icon: any;
  color: string;
  generate: (sigChairwoman?: string, sigSecretary?: string) => jsPDF;
};

// -- PDF base helpers --

function makeDoc(): jsPDF {
  const doc = new jsPDF();
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(SOCIETY_NAME, 105, 12, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(SOCIETY_ADDRESS, 105, 20, { align: "center" });
  doc.setTextColor(0, 0, 0);
  return doc;
}

function addFooter(doc: jsPDF, page = 1) {
  doc.setFillColor(240, 240, 255);
  doc.rect(0, 282, 210, 15, "F");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 120);
  doc.text(`${SOCIETY_NAME} | Reg. No: ${SOCIETY_REG}`, 105, 289, { align: "center" });
  doc.text(`Page ${page}`, 195, 289, { align: "right" });
  doc.setTextColor(0, 0, 0);
}

function sectionTitle(doc: jsPDF, text: string, y: number) {
  doc.setFillColor(238, 242, 255);
  doc.rect(14, y - 5, 182, 10, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text(text, 18, y + 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
}

// -- Signature compression cache --
const sigCache: Record<string, string> = {};

/**
 * Loads an image onto a canvas and returns a compressed JPEG data URL.
 * ~15-25 KB output vs ~470 KB original. Results are cached per src.
 */
async function compressSig(src: string, maxW = 280): Promise<string> {
  if (sigCache[src]) return sigCache[src];
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff"; // white bg for transparent PNGs
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      sigCache[src] = dataUrl;
      resolve(dataUrl);
    };
    img.onerror = () => resolve(""); // graceful fallback - no sig shown
    img.src = src;
  });
}

/**
 * Draws a circular society stamp using jsPDF primitives.
 * cx, cy = center in mm.
 */
function drawStamp(doc: jsPDF, cx: number, cy: number) {
  doc.setDrawColor(30, 80, 180);
  doc.setLineWidth(1.2);
  doc.circle(cx, cy, 18);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, 14);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 80, 180);
  doc.text("GREENWOOD HEIGHTS CHS", cx, cy - 2, { align: "center" });
  doc.setFontSize(6.5);
  doc.text("AUTHORIZED", cx, cy + 4, { align: "center" });
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("NAVI MUMBAI", cx, cy + 9, { align: "center" });
  doc.setTextColor(0, 0, 0);
}

/**
 * Adds both signature images + labels + circular stamp at the bottom of the page.
 * y = starting Y for the signature row. Falls back to underline if no image data.
 */
function addSignaturesAndStamp(
  doc: jsPDF,
  sigChairwoman: string,
  sigSecretary: string,
  y: number
) {
  const sigW = 45;
  const sigH = 18;

  // Chairwoman - left
  if (sigChairwoman) {
    doc.addImage(sigChairwoman, "JPEG", 18, y, sigW, sigH);
  } else {
    doc.setDrawColor(100); doc.setLineWidth(0.4);
    doc.line(18, y + sigH, 18 + sigW, y + sigH);
  }
  doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(40, 40, 40);
  doc.text("Ms. Purva Chavan", 18, y + sigH + 5);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  doc.text("Chairwoman & Treasurer", 18, y + sigH + 10);

  // Secretary - right
  if (sigSecretary) {
    doc.addImage(sigSecretary, "JPEG", 140, y, sigW, sigH);
  } else {
    doc.setDrawColor(100); doc.setLineWidth(0.4);
    doc.line(140, y + sigH, 140 + sigW, y + sigH);
  }
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
  doc.text("Mr. Moksh Sonar", 140, y + sigH + 5);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  doc.text("Honorary Secretary", 140, y + sigH + 10);

  // Circular stamp - center, overlapping sigs slightly
  drawStamp(doc, 105, y + sigH - 2);

  // "Digitally Verified" badge - centered below stamp, stamp-like feel
  // Slight rotation gives it an authentic approval-mark appearance
  doc.saveGraphicsState();
  (doc as any).setGState(new (doc as any).GState({ opacity: 0.82 }));
  doc.setFillColor(22, 163, 74);   // green-700
  doc.roundedRect(80, y + sigH + 2, 50, 9, 2, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("DIGITALLY VERIFIED", 105, y + sigH + 7.8, { align: "center", angle: -2 });
  doc.restoreGraphicsState();
  doc.setTextColor(0, 0, 0);

  // System-generated notice
  doc.setFontSize(7); doc.setTextColor(130, 130, 130);
  doc.text(
    "This is a system-generated document. Verify authenticity with the Society office.",
    105, y + sigH + 16, { align: "center" }
  );
  doc.setTextColor(0, 0, 0);
}

// -- Document generators --

function genRegistrationCert(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("SOCIETY REGISTRATION CERTIFICATE", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(79, 70, 229); doc.setLineWidth(1.5);
  doc.roundedRect(14, 48, 182, 120, 4, 4);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  const lines = [
    ["Registration Number", SOCIETY_REG],
    ["Society Name", SOCIETY_NAME],
    ["Type", "Co-operative Housing Society"],
    ["Registered Under", "Maharashtra Co-operative Societies Act, 1960"],
    ["Date of Registration", "14th February 2019"],
    ["Area of Operation", "Navi Mumbai, Maharashtra"],
    ["Registered Address", SOCIETY_ADDRESS],
    ["Total Members", "120 Residential Units"],
    ["Financial Year", "April to March"],
  ];
  let y = 60;
  lines.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold"); doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal"); doc.text(value, 80, y);
    y += 11;
  });
  doc.setFontSize(9); doc.setTextColor(80, 80, 80);
  doc.text("This is to certify that the above-named society has been duly registered under the provisions of the", 105, 178, { align: "center" });
  doc.text("Maharashtra Co-operative Societies Act, 1960 and is entitled to all rights and privileges thereof.", 105, 185, { align: "center" });
  doc.setTextColor(0, 0, 0);
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, 220);
  addFooter(doc);
  return doc;
}

function genBylaws(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("SOCIETY BYE-LAWS & RULES", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Adopted at the Special General Meeting held on 20th March 2019", 105, 50, { align: "center" });
  let y = 62;
  const sections = [
    { title: "1. NAME & ADDRESS", body: `The Society shall be known as "${SOCIETY_NAME}" and its registered office shall be situated at ${SOCIETY_ADDRESS}.` },
    { title: "2. OBJECTS OF THE SOCIETY", body: "The objects of the Society are to provide and manage residential accommodation for its members, maintain common areas, collect maintenance charges, and promote harmonious community living." },
    { title: "3. MEMBERSHIP", body: "Membership is open to all flat owners in the society premises. Each flat owner shall be entitled to one vote. Membership is non-transferable except upon sale of the flat." },
    { title: "4. MANAGING COMMITTEE", body: "The Society shall be managed by a Managing Committee of 9 elected members including Chairman, Secretary, and Treasurer. The committee shall meet at least once every two months." },
    { title: "5. MAINTENANCE CHARGES", body: "Monthly maintenance charges shall be fixed by the Managing Committee and approved at the AGM. Current rate: Rs. 2,500/month per flat. Charges are due by the 10th of each month." },
    { title: "6. GENERAL MEETINGS", body: "Annual General Meeting (AGM) shall be held within 3 months of the close of each financial year. Special General Meetings may be called by the Committee or on requisition of 1/5th of members." },
    { title: "7. DISPUTE RESOLUTION", body: "All disputes between members or between members and the Society shall be referred to the Co-operative Court as per Section 91 of the Maharashtra Co-operative Societies Act." },
  ];
  sections.forEach((s) => {
    sectionTitle(doc, s.title, y); y += 12;
    const wrapped = doc.splitTextToSize(s.body, 174);
    doc.setFontSize(9); doc.text(wrapped, 18, y);
    y += wrapped.length * 5 + 6;
  });
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 4);
  addFooter(doc);
  return doc;
}

function genAGMMinutes(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("MINUTES OF ANNUAL GENERAL MEETING", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Financial Year 2024-25 | Held on: Sunday, 15th June 2025 at 11:00 AM", 105, 50, { align: "center" });
  doc.text("Venue: Society Clubhouse, Ground Floor", 105, 56, { align: "center" });
  let y = 68;
  sectionTitle(doc, "ATTENDANCE", y); y += 12;
  doc.setFontSize(9);
  doc.text("Total Members: 120  |  Members Present: 87  |  Quorum: Present", 18, y); y += 12;
  sectionTitle(doc, "OFFICE BEARERS PRESENT", y); y += 12;
  ["Ms. Purva Chavan (B-303) - Chairman & Treasurer",
   "Mr. Moksh Sonar (A-301) - Secretary",
   "Mr. Yash Bandawane (A-302) - Committee Member",
   "Mr. Tanmay Kolekar (A-204) - Committee Member",
   "Mr. Aryan Chauhan (A-604) - Committee Member",
  ].forEach((b) => { doc.text(`- ${b}`, 20, y); y += 7; });
  y += 4;
  sectionTitle(doc, "AGENDA & RESOLUTIONS", y); y += 12;
  const agenda = [
    ["1", "Confirmation of previous AGM minutes", "Unanimously confirmed"],
    ["2", "Audited accounts for FY 2024-25", "Approved with 82 votes in favour"],
    ["3", "Maintenance charge revision to Rs. 2,500/month", "Approved - effective April 2025"],
    ["4", "Terrace waterproofing project (Rs. 8.5 Lakhs)", "Approved - work to begin July 2025"],
    ["5", "CCTV upgrade for all 4 wings", "Approved - budget Rs. 1.2 Lakhs"],
    ["6", "Election of new committee members", "3 new members elected unopposed"],
  ];
  agenda.forEach(([no, item, resolution]) => {
    doc.setFont("helvetica", "bold"); doc.text(`${no}. ${item}`, 18, y);
    doc.setFont("helvetica", "normal"); doc.setTextColor(60, 120, 60);
    doc.text(`   -> ${resolution}`, 18, y + 5); doc.setTextColor(0, 0, 0);
    y += 14;
  });
  y += 4;
  doc.setFont("helvetica", "bold"); doc.text("Meeting adjourned at 1:30 PM.", 18, y);
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 14);
  addFooter(doc);
  return doc;
}

function genMaintenanceSchedule(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("MAINTENANCE SCHEDULE 2025-26", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Approved by Managing Committee | Effective: April 2025", 105, 50, { align: "center" });
  let y = 62;
  sectionTitle(doc, "MONTHLY MAINTENANCE CHARGES BREAKDOWN", y); y += 14;
  const charges = [
    ["Service", "Amount (Rs.)", "Frequency"],
    ["Building Maintenance & Repairs", "800", "Monthly"],
    ["Common Area Electricity", "400", "Monthly"],
    ["Water Charges", "350", "Monthly"],
    ["Security Staff (4 guards)", "500", "Monthly"],
    ["Housekeeping & Sanitation", "250", "Monthly"],
    ["Lift Maintenance (AMC)", "150", "Monthly"],
    ["Sinking Fund Contribution", "50", "Monthly"],
    ["TOTAL", "2,500", "Per Flat/Month"],
  ];
  charges.forEach((row, i) => {
    const isH = i === 0; const isT = i === charges.length - 1;
    if (isH || isT) { doc.setFillColor(isT ? 79 : 200, isT ? 70 : 210, isT ? 229 : 255); doc.rect(14, y - 5, 182, 9, "F"); doc.setTextColor(isT ? 255 : 0, isT ? 255 : 0, isT ? 255 : 0); }
    doc.setFont("helvetica", isH || isT ? "bold" : "normal"); doc.setFontSize(9);
    doc.text(row[0], 18, y); doc.text(row[1], 140, y, { align: "right" }); doc.text(row[2], 190, y, { align: "right" });
    doc.setTextColor(0, 0, 0); y += 10;
  });
  y += 6; sectionTitle(doc, "ANNUAL MAINTENANCE WORKS CALENDAR", y); y += 14;
  const works = [
    ["April 2025", "Terrace waterproofing - A & B Wing"],
    ["May 2025", "External painting - C & D Wing"],
    ["June 2025", "Monsoon drain cleaning & pump servicing"],
    ["August 2025", "CCTV system upgrade - all wings"],
    ["October 2025", "Diwali lighting & common area decoration"],
    ["December 2025", "Annual fire safety audit & extinguisher refill"],
    ["February 2026", "Lift AMC renewal & inspection"],
    ["March 2026", "Year-end accounts audit & AGM preparation"],
  ];
  works.forEach(([month, work]) => {
    doc.setFont("helvetica", "bold"); doc.text(month, 18, y);
    doc.setFont("helvetica", "normal"); doc.text(work, 70, y); y += 9;
  });
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 4);
  addFooter(doc);
  return doc;
}

function genNOC(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("NO OBJECTION CERTIFICATE", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Ref: GH/NOC/2025-26/047", 105, 50, { align: "center" });
  doc.setFontSize(10); let y = 65;
  doc.text("Date: 10th January 2026", 160, y); y += 12;
  doc.text("To,", 18, y); y += 7;
  doc.text("The Branch Manager,", 18, y); y += 7;
  doc.text("State Bank of India,", 18, y); y += 7;
  doc.text("Kharghar Branch, Navi Mumbai.", 18, y); y += 14;
  doc.setFont("helvetica", "bold");
  doc.text("Sub: No Objection Certificate for Home Loan - Flat No. A-301", 18, y);
  doc.setFont("helvetica", "normal"); y += 14;
  const body = `This is to certify that ${SOCIETY_NAME} (Reg. No. ${SOCIETY_REG}) has NO OBJECTION to the mortgage/hypothecation of Flat No. A-301, situated at ${SOCIETY_ADDRESS}, in favour of State Bank of India for the purpose of availing a Home Loan.\n\nThe flat owner, Mr. Moksh Sonar, is a bonafide member of this Society. As per our records, all maintenance dues and other charges payable to the Society are cleared up to date.\n\nThe Society confirms that:\n  1. The flat is free from any encumbrance from the Society's side.\n  2. No dues are pending against the said flat as on date.\n  3. The Society has no objection to the said flat being mortgaged to your bank.\n\nThis NOC is issued at the request of the flat owner and is valid for a period of 6 months from the date of issue.`;
  const wrapped = doc.splitTextToSize(body, 174);
  doc.text(wrapped, 18, y); y += wrapped.length * 5.5 + 10;
  doc.text("Yours faithfully,", 18, y);
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 10);
  addFooter(doc);
  return doc;
}

function genFireSafety(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(220, 50, 50);
  doc.text("FIRE SAFETY AUDIT REPORT 2025", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Conducted by: Maharashtra Fire Safety Services Pvt. Ltd. | Date: 5th December 2025", 105, 50, { align: "center" });
  let y = 62;
  sectionTitle(doc, "AUDIT SUMMARY", y); y += 14;
  const summary = [
    ["Audit Reference No.", "MFSS/GH/2025/1189"],
    ["Property", SOCIETY_NAME],
    ["Total Floors", "G + 14 (4 Wings - A, B, C, D)"],
    ["Total Units", "120 Residential Flats"],
    ["Audit Date", "5th December 2025"],
    ["Overall Status", "COMPLIANT"],
  ];
  summary.forEach(([k, v]) => {
    doc.setFont("helvetica", "bold"); doc.text(`${k}:`, 18, y);
    doc.setFont("helvetica", "normal"); doc.text(v, 85, y); y += 9;
  });
  y += 4; sectionTitle(doc, "EQUIPMENT STATUS", y); y += 14;
  const equipment = [
    ["Fire Extinguishers (CO2)", "48 units", "Serviced", "Dec 2026"],
    ["Hose Reels", "16 units", "Operational", "Jun 2026"],
    ["Smoke Detectors", "240 units", "Functional", "Dec 2026"],
    ["Sprinkler System", "All floors", "Operational", "Dec 2026"],
    ["Emergency Exit Lights", "32 units", "Functional", "Jun 2026"],
    ["Fire Alarm Panel", "1 unit (Central)", "Operational", "Dec 2026"],
  ];
  doc.setFont("helvetica", "bold"); doc.setFillColor(200, 210, 255);
  doc.rect(14, y - 5, 182, 9, "F");
  doc.text("Equipment", 18, y); doc.text("Qty", 90, y); doc.text("Status", 120, y); doc.text("Next Due", 165, y);
  doc.setFont("helvetica", "normal"); y += 10;
  equipment.forEach(([eq, qty, status, due]) => {
    doc.text(eq, 18, y); doc.text(qty, 90, y);
    doc.setTextColor(30, 140, 30); doc.text(status, 120, y);
    doc.setTextColor(0, 0, 0); doc.text(due, 165, y); y += 9;
  });
  y += 6; sectionTitle(doc, "RECOMMENDATIONS", y); y += 12;
  ["Conduct fire drill for all residents - recommended by March 2026.",
   "Replace emergency exit signage in D-Wing staircase (faded).",
   "Ensure fire escape routes remain unobstructed at all times.",
  ].forEach((r) => { doc.text(`- ${r}`, 18, y); y += 8; });
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 4);
  addFooter(doc);
  return doc;
}

function genAnnualBudget(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("ANNUAL BUDGET - FY 2025-26", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Approved at AGM held on 15th June 2025 | Effective: 1st April 2025", 105, 50, { align: "center" });
  let y = 62;
  sectionTitle(doc, "INCOME BUDGET", y); y += 14;
  const income = [
    ["Description", "Amount (Rs.)"],
    ["Maintenance Charges (120 flats x Rs.2,500 x 12)", "36,00,000"],
    ["Non-Occupancy Charges", "1,20,000"],
    ["Interest on Fixed Deposits", "2,40,000"],
    ["Parking Charges (60 slots x Rs.500 x 12)", "3,60,000"],
    ["Clubhouse & Amenity Booking Fees", "60,000"],
    ["Late Payment Penalties", "30,000"],
    ["TOTAL INCOME", "43,10,000"],
  ];
  income.forEach((row, i) => {
    const isH = i === 0; const isT = i === income.length - 1;
    if (isH || isT) { doc.setFillColor(isT ? 79 : 200, isT ? 70 : 210, isT ? 229 : 255); doc.rect(14, y - 5, 182, 9, "F"); doc.setTextColor(isT ? 255 : 0, isT ? 255 : 0, isT ? 255 : 0); }
    doc.setFont("helvetica", isH || isT ? "bold" : "normal"); doc.setFontSize(9);
    doc.text(row[0], 18, y); doc.text(row[1], 190, y, { align: "right" }); doc.setTextColor(0, 0, 0); y += 10;
  });
  y += 4; sectionTitle(doc, "EXPENDITURE BUDGET", y); y += 14;
  const expense = [
    ["Description", "Amount (Rs.)"],
    ["Salaries - Security Staff (4 guards)", "7,20,000"],
    ["Salaries - Housekeeping & Sweepers", "3,60,000"],
    ["Common Area Electricity", "4,80,000"],
    ["Water Charges (CIDCO)", "4,20,000"],
    ["Lift AMC (4 lifts)", "1,80,000"],
    ["Building Repairs & Maintenance", "6,00,000"],
    ["Terrace Waterproofing (A & B Wing)", "8,50,000"],
    ["CCTV Upgrade", "1,20,000"],
    ["Garden & Landscaping", "60,000"],
    ["Administrative & Legal Expenses", "80,000"],
    ["Sinking Fund Transfer", "72,000"],
    ["TOTAL EXPENDITURE", "39,42,000"],
  ];
  expense.forEach((row, i) => {
    const isH = i === 0; const isT = i === expense.length - 1;
    if (isH || isT) { doc.setFillColor(isT ? 79 : 200, isT ? 70 : 210, isT ? 229 : 255); doc.rect(14, y - 5, 182, 9, "F"); doc.setTextColor(isT ? 255 : 0, isT ? 255 : 0, isT ? 255 : 0); }
    doc.setFont("helvetica", isH || isT ? "bold" : "normal"); doc.setFontSize(9);
    doc.text(row[0], 18, y); doc.text(row[1], 190, y, { align: "right" }); doc.setTextColor(0, 0, 0); y += 10;
  });
  y += 6; doc.setFillColor(220, 255, 220); doc.rect(14, y - 5, 182, 12, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(30, 120, 30);
  doc.text("PROJECTED SURPLUS: Rs. 3,68,000", 18, y + 3); doc.setTextColor(0, 0, 0);
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 18);
  addFooter(doc);
  return doc;
}

function genWaterBill(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(37, 99, 235);
  doc.text("WATER CHARGES INVOICE - MARCH 2026", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("CIDCO Water Supply Division | Invoice No: CIDCO/KHR/2026/03/4471", 105, 50, { align: "center" });
  let y = 62;
  sectionTitle(doc, "INVOICE DETAILS", y); y += 14;
  const wdetails = [
    ["Consumer Name", SOCIETY_NAME], ["Consumer No.", "CIDCO-KHR-00847"],
    ["Connection Type", "Bulk Supply - Residential Society"],
    ["Billing Period", "1st March 2026 to 31st March 2026"],
    ["Meter Reading (Previous)", "48,241 KL"], ["Meter Reading (Current)", "48,619 KL"],
    ["Units Consumed", "378 KL"], ["Rate per KL", "Rs. 28.50"],
    ["Invoice Date", "1st March 2026"], ["Due Date", "15th March 2026"],
  ];
  wdetails.forEach(([k, v]) => { doc.setFont("helvetica", "bold"); doc.text(`${k}:`, 18, y); doc.setFont("helvetica", "normal"); doc.text(v, 85, y); y += 9; });
  y += 4; sectionTitle(doc, "CHARGES BREAKDOWN", y); y += 14;
  const wcharges = [
    ["Water Consumption (378 KL x Rs.28.50)", "10,773"],
    ["Sewerage Charges (50% of water)", "5,387"],
    ["Meter Rent", "150"], ["GST @ 18%", "2,936"], ["TOTAL PAYABLE", "19,246"],
  ];
  wcharges.forEach((row, i) => {
    const isT = i === wcharges.length - 1;
    if (isT) { doc.setFillColor(79, 70, 229); doc.rect(14, y - 5, 182, 9, "F"); doc.setTextColor(255, 255, 255); }
    doc.setFont("helvetica", isT ? "bold" : "normal"); doc.setFontSize(9);
    doc.text(row[0], 18, y); doc.text(`Rs. ${row[1]}`, 190, y, { align: "right" }); doc.setTextColor(0, 0, 0); y += 10;
  });
  y += 8; doc.setFillColor(255, 245, 200); doc.rect(14, y - 5, 182, 10, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(180, 100, 0);
  doc.text("Payment due by 15th March 2026. Late payment attracts 2% penalty per month.", 18, y + 1);
  doc.setTextColor(0, 0, 0);
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 16);
  addFooter(doc);
  return doc;
}

function genLiftAMC(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("LIFT ANNUAL MAINTENANCE CONTRACT", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Contract No: OTIS/NM/2025-26/GH/089 | Valid: 1st April 2025 to 31st March 2026", 105, 50, { align: "center" });
  let y = 62;
  sectionTitle(doc, "PARTIES TO THE CONTRACT", y); y += 14;
  doc.setFont("helvetica", "bold"); doc.text("Service Provider:", 18, y); doc.setFont("helvetica", "normal");
  doc.text("Otis Elevator Company (India) Ltd., Navi Mumbai Service Centre", 65, y); y += 8;
  doc.text("Contact: Mr. Rajiv Nair | Phone: 022-6789-4521", 65, y); y += 12;
  doc.setFont("helvetica", "bold"); doc.text("Client:", 18, y); doc.setFont("helvetica", "normal");
  doc.text(SOCIETY_NAME, 65, y); y += 8; doc.text(SOCIETY_ADDRESS, 65, y); y += 14;
  sectionTitle(doc, "SCOPE OF WORK", y); y += 12;
  ["Monthly preventive maintenance of all 4 lifts (Wings A, B, C, D)",
   "24x7 breakdown call response within 4 hours",
   "Quarterly lubrication of all moving parts and rope inspection",
   "Annual load testing and safety certification",
   "Replacement of worn parts (excluding major components) at no extra cost",
   "Maintenance of lift logbook and compliance records",
  ].forEach((s) => { doc.text(`- ${s}`, 20, y); y += 8; });
  y += 4; sectionTitle(doc, "CONTRACT VALUE", y); y += 14;
  [["Annual AMC Charges (4 lifts)", "Rs. 1,80,000"], ["GST @ 18%", "Rs. 32,400"],
   ["TOTAL CONTRACT VALUE", "Rs. 2,12,400"], ["Payment Schedule", "Quarterly - Rs. 53,100 per quarter"],
  ].forEach((row, i) => {
    const isT = i === 2;
    if (isT) { doc.setFillColor(79, 70, 229); doc.rect(14, y - 5, 182, 9, "F"); doc.setTextColor(255, 255, 255); }
    doc.setFont("helvetica", isT ? "bold" : "normal"); doc.setFontSize(9);
    doc.text(row[0], 18, y); doc.text(row[1], 190, y, { align: "right" }); doc.setTextColor(0, 0, 0); y += 10;
  });
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 6);
  addFooter(doc);
  return doc;
}

function genSecurityContract(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("SECURITY SERVICES AGREEMENT", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Agreement No: SSA/GH/2025-26/14 | Period: 1st April 2025 to 31st March 2026", 105, 50, { align: "center" });
  let y = 62;
  sectionTitle(doc, "AGREEMENT DETAILS", y); y += 14;
  [["Agency Name", "Shield Force Security Services Pvt. Ltd."],
   ["Agency Address", "Office No. 7, Sector 15, CBD Belapur, Navi Mumbai"],
   ["License No.", "MH/SEC/2019/4471"], ["Client", SOCIETY_NAME],
   ["Contract Period", "1st April 2025 to 31st March 2026"],
   ["Monthly Charges", "Rs. 60,000 (inclusive of all taxes)"],
  ].forEach(([k, v]) => { doc.setFont("helvetica", "bold"); doc.text(`${k}:`, 18, y); doc.setFont("helvetica", "normal"); doc.text(v, 75, y); y += 9; });
  y += 4; sectionTitle(doc, "GUARD DEPLOYMENT SCHEDULE", y); y += 14;
  [["Post", "Shift", "Guards", "Timing"],
   ["Main Gate", "Morning", "1", "6:00 AM - 2:00 PM"],
   ["Main Gate", "Evening", "1", "2:00 PM - 10:00 PM"],
   ["Main Gate", "Night", "1", "10:00 PM - 6:00 AM"],
   ["Parking Area", "All shifts", "1", "24 hours rotating"],
  ].forEach((row, i) => {
    if (i === 0) { doc.setFillColor(200, 210, 255); doc.rect(14, y - 5, 182, 9, "F"); }
    doc.setFont("helvetica", i === 0 ? "bold" : "normal"); doc.setFontSize(9);
    doc.text(row[0], 18, y); doc.text(row[1], 65, y); doc.text(row[2], 110, y); doc.text(row[3], 135, y); y += 10;
  });
  y += 4; sectionTitle(doc, "TERMS & CONDITIONS", y); y += 12;
  ["All guards must be in uniform and carry valid ID at all times.",
   "Agency to provide replacement within 2 hours in case of guard absence.",
   "Monthly attendance report to be submitted to the Secretary by 5th of each month.",
   "Society reserves the right to reject any guard deemed unsuitable.",
   "Either party may terminate with 30 days written notice.",
  ].forEach((t, i) => { doc.text(`${i + 1}. ${t}`, 18, y); y += 8; });
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 4);
  addFooter(doc);
  return doc;
}

function genParkingRegister(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("PARKING ALLOTMENT REGISTER 2025-26", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Approved by Managing Committee | Total Slots: 80 (Covered: 48, Open: 32)", 105, 50, { align: "center" });
  let y = 62;
  sectionTitle(doc, "PARKING SUMMARY", y); y += 14;
  [["Total Residential Flats", "120"], ["Total Parking Slots Available", "80"],
   ["Covered Parking (Basement)", "48 slots"], ["Open Parking (Ground Level)", "32 slots"],
   ["Allotted Slots", "72"], ["Vacant / Visitor Slots", "8"],
   ["Monthly Parking Charges", "Rs. 500 per slot"], ["Annual Revenue from Parking", "Rs. 4,32,000"],
  ].forEach(([k, v]) => { doc.setFont("helvetica", "bold"); doc.text(`${k}:`, 18, y); doc.setFont("helvetica", "normal"); doc.text(v, 95, y); y += 9; });
  y += 4; sectionTitle(doc, "WING-WISE ALLOTMENT", y); y += 14;
  [["Wing", "Total Flats", "Slots Allotted", "Covered", "Open"],
   ["Wing A", "30", "22", "14", "8"], ["Wing B", "30", "20", "12", "8"],
   ["Wing C", "30", "18", "12", "6"], ["Wing D", "30", "12", "10", "2"],
   ["TOTAL", "120", "72", "48", "24"],
  ].forEach((row, i) => {
    const isH = i === 0; const isT = i === 5;
    if (isH || isT) { doc.setFillColor(isT ? 79 : 200, isT ? 70 : 210, isT ? 229 : 255); doc.rect(14, y - 5, 182, 9, "F"); doc.setTextColor(isT ? 255 : 0, isT ? 255 : 0, isT ? 255 : 0); }
    doc.setFont("helvetica", isH || isT ? "bold" : "normal"); doc.setFontSize(9);
    doc.text(row[0], 18, y); doc.text(row[1], 65, y); doc.text(row[2], 100, y); doc.text(row[3], 140, y); doc.text(row[4], 175, y);
    doc.setTextColor(0, 0, 0); y += 10;
  });
  y += 6; sectionTitle(doc, "PARKING RULES", y); y += 12;
  ["Parking slots are allotted on first-come-first-served basis.",
   "Residents must display society parking sticker on windshield at all times.",
   "Visitor parking (slots V-01 to V-08) is strictly for guests - max 4 hours.",
   "No washing of vehicles in the parking area.",
   "Two-wheelers must be parked in designated two-wheeler zone only.",
   "Society is not responsible for theft or damage to vehicles.",
  ].forEach((r, i) => { doc.text(`${i + 1}. ${r}`, 18, y); y += 8; });
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y + 4);
  addFooter(doc);
  return doc;
}

function genElectionNotice(sigChairwoman = "", sigSecretary = ""): jsPDF {
  const doc = makeDoc();
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(220, 50, 50);
  doc.text("ELECTION NOTICE", 105, 42, { align: "center" });
  doc.setTextColor(0, 0, 0); doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text("Managing Committee Elections - FY 2026-27", 105, 50, { align: "center" });
  doc.setDrawColor(220, 50, 50); doc.setLineWidth(1); doc.rect(14, 55, 182, 10);
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(220, 50, 50);
  doc.text("Ref: GH/ELEC/2026/01 | Date: 12th March 2026", 105, 62, { align: "center" });
  doc.setTextColor(0, 0, 0);
  let y = 78;
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  const intro = `Notice is hereby given to all members of ${SOCIETY_NAME} that elections for the Managing Committee for FY 2026-27 will be held as per the schedule below. All eligible members are requested to participate.`;
  const introWrapped = doc.splitTextToSize(intro, 174);
  doc.text(introWrapped, 18, y); y += introWrapped.length * 6 + 8;
  sectionTitle(doc, "ELECTION SCHEDULE", y); y += 14;
  [["Nomination Filing Opens", "15th March 2026"], ["Last Date for Nominations", "22nd March 2026"],
   ["Scrutiny of Nominations", "24th March 2026"], ["Withdrawal of Nominations", "25th March 2026"],
   ["Date of Election (if required)", "30th March 2026"], ["Time", "10:00 AM to 1:00 PM"],
   ["Venue", "Society Clubhouse, Ground Floor"], ["Result Declaration", "30th March 2026 by 3:00 PM"],
  ].forEach(([k, v]) => { doc.setFont("helvetica", "bold"); doc.text(`${k}:`, 18, y); doc.setFont("helvetica", "normal"); doc.text(v, 90, y); y += 9; });
  y += 4; sectionTitle(doc, "POSTS TO BE ELECTED", y); y += 14;
  [["Chairman cum Treasurer", "1"], ["Secretary", "1"], ["Committee Members", "3"], ["TOTAL", "5"],
  ].forEach((row, i) => {
    const isT = i === 3;
    if (isT) { doc.setFillColor(79, 70, 229); doc.rect(14, y - 5, 182, 9, "F"); doc.setTextColor(255, 255, 255); }
    doc.setFont("helvetica", isT ? "bold" : "normal"); doc.setFontSize(9);
    doc.text(row[0], 18, y); doc.text(row[1], 190, y, { align: "right" }); doc.setTextColor(0, 0, 0); y += 10;
  });
  y += 6;
  const enote = "Note: Nomination forms available at Secretary's office (Flat A-301). Only members with no pending dues are eligible to vote and contest. Contact Mr. Moksh Sonar at 9876543210 for queries.";
  const enoteWrapped = doc.splitTextToSize(enote, 174);
  doc.setFillColor(255, 245, 200); doc.rect(14, y - 5, 182, enoteWrapped.length * 5 + 8, "F");
  doc.setTextColor(120, 80, 0); doc.text(enoteWrapped, 18, y); doc.setTextColor(0, 0, 0);
  y += enoteWrapped.length * 5 + 14;
  addSignaturesAndStamp(doc, sigChairwoman, sigSecretary, y);
  addFooter(doc);
  return doc;
}

// -- Document definitions --

async function genMemberDirectory(): Promise<jsPDF> {
  const { data: members } = await supabase
    .from("society_members")
    .select("full_name, flat_number, phone, email")
    .order("flat_number", { ascending: true });

  const rows = (members || []).map((m: any) => {
    const flat = (m.flat_number || "").toUpperCase().trim();
    // Parse wing (first letter) and floor (digits in flat number)
    const wingMatch = flat.match(/^([A-Z])/);
    const floorMatch = flat.match(/(\d+)/);
    const wing = wingMatch ? wingMatch[1] : "Z";
    const flatNum = floorMatch ? parseInt(floorMatch[1]) : 0;
    const floor = flatNum >= 100 ? Math.floor(flatNum / 100) : 0;
    return { ...m, wing, floor, flatNum };
  }).sort((a: any, b: any) => {
    if (a.wing !== b.wing) return a.wing.localeCompare(b.wing);
    if (a.floor !== b.floor) return a.floor - b.floor;
    return a.flatNum - b.flatNum;
  });

  const doc = makeDoc();
  const exportDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  doc.setFontSize(15); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
  doc.text("MEMBER DIRECTORY", 105, 40, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 100, 120);
  doc.text(`Exported on: ${exportDate}  |  Total Members: ${rows.length}`, 105, 48, { align: "center" });
  doc.setTextColor(0, 0, 0);

  let y = 58;
  let page = 1;
  let currentWing = "";

  const colX = { sno: 14, name: 24, flat: 90, floor: 118, phone: 138, email: 168 };

  const drawTableHeader = (yPos: number) => {
    doc.setFillColor(79, 70, 229);
    doc.rect(14, yPos - 5, 182, 9, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text("#", colX.sno, yPos);
    doc.text("Full Name", colX.name, yPos);
    doc.text("Flat No.", colX.flat, yPos);
    doc.text("Floor", colX.floor, yPos);
    doc.text("Phone", colX.phone, yPos);
    doc.text("Email", colX.email, yPos);
    doc.setTextColor(0, 0, 0);
    return yPos + 8;
  };

  y = drawTableHeader(y);

  rows.forEach((m: any, i: number) => {
    // New page if needed
    if (y > 265) {
      addFooter(doc, page);
      doc.addPage();
      page++;
      // Re-draw header on new page
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 210, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text(SOCIETY_NAME, 105, 12, { align: "center" });
      doc.setFontSize(8); doc.setFont("helvetica", "normal");
      doc.text("Member Directory (continued)", 105, 20, { align: "center" });
      doc.setTextColor(0, 0, 0);
      y = 36;
      currentWing = "";
      y = drawTableHeader(y);
    }

    // Wing section header
    if (m.wing !== currentWing) {
      currentWing = m.wing;
      doc.setFillColor(238, 242, 255);
      doc.rect(14, y - 1, 182, 8, "F");
      doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(79, 70, 229);
      doc.text(`Wing ${currentWing}`, 18, y + 5);
      doc.setTextColor(0, 0, 0);
      y += 10;
    }

    // Alternating row bg
    if (i % 2 === 0) {
      doc.setFillColor(248, 249, 255);
      doc.rect(14, y - 4, 182, 7, "F");
    }

    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(40, 40, 40);
    doc.text(String(i + 1), colX.sno, y);
    doc.text(doc.splitTextToSize(m.full_name || "-", 62)[0], colX.name, y);
    doc.text(m.flat_number || "-", colX.flat, y);
    doc.text(m.floor > 0 ? String(m.floor) : "G", colX.floor, y);
    doc.text(m.phone || "-", colX.phone, y);
    // truncate email to fit
    const emailStr = (m.email || "-").length > 22 ? (m.email || "").substring(0, 20) + ".." : (m.email || "-");
    doc.text(emailStr, colX.email, y);
    doc.setTextColor(0, 0, 0);
    y += 7;
  });

  if (rows.length === 0) {
    doc.setFontSize(10); doc.setTextColor(150, 150, 150);
    doc.text("No members found in the database.", 105, y + 10, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  addFooter(doc, page);
  return doc;
}

const DOCUMENTS: DocDef[] = [
  { id: 1, title: "Society Registration Certificate", description: "Official registration certificate under Maharashtra Co-operative Societies Act, 1960", category: "Legal", date: "14 Feb 2019", icon: Shield, color: "bg-red-50 text-red-600", generate: genRegistrationCert },
  { id: 2, title: "Society Bye-Laws & Rules", description: "Complete bye-laws governing membership, committee, charges and dispute resolution", category: "Legal", date: "20 Mar 2019", icon: Gavel, color: "bg-red-50 text-red-600", generate: genBylaws },
  { id: 3, title: "AGM Minutes FY 2024-25", description: "Minutes of Annual General Meeting held on 15th June 2025 with all resolutions", category: "Meeting Minutes", date: "15 Jun 2025", icon: Users, color: "bg-blue-50 text-blue-600", generate: genAGMMinutes },
  { id: 4, title: "Maintenance Schedule 2025-26", description: "Monthly charge breakdown and annual maintenance works calendar", category: "Financial", date: "01 Apr 2025", icon: Calendar, color: "bg-green-50 text-green-600", generate: genMaintenanceSchedule },
  { id: 5, title: "No Objection Certificate For A-301", description: "NOC issued to flat owner Mr. Moksh Sonar for home loan mortgage with SBI", category: "Legal", date: "10 Jan 2026", icon: FileText, color: "bg-red-50 text-red-600", generate: genNOC },
  { id: 6, title: "Fire Safety Audit Report 2025", description: "Annual fire safety compliance audit - all equipment status and recommendations", category: "Emergency", date: "05 Dec 2025", icon: AlertTriangle, color: "bg-orange-50 text-orange-600", generate: genFireSafety },
  { id: 7, title: "Annual Budget FY 2025-26", description: "Approved income & expenditure budget with projected surplus of Rs. 3,68,000", category: "Financial", date: "15 Jun 2025", icon: IndianRupee, color: "bg-green-50 text-green-600", generate: genAnnualBudget },
  { id: 8, title: "Water Bill Invoice - March 2026", description: "CIDCO bulk water supply invoice for March 2026 - Rs. 19,246 payable", category: "Financial", date: "01 Mar 2026", icon: Droplets, color: "bg-blue-50 text-blue-600", generate: genWaterBill },
  { id: 9, title: "Lift AMC Contract 2025-26", description: "Annual maintenance contract with Otis Elevators for all 4 lifts - Rs. 2,12,400", category: "Maintenance", date: "01 Apr 2025", icon: Wrench, color: "bg-yellow-50 text-yellow-600", generate: genLiftAMC },
  { id: 10, title: "Security Services Agreement", description: "Contract with Shield Force Security for 4 guards - Rs. 60,000/month", category: "Security", date: "01 Apr 2025", icon: UserCheck, color: "bg-red-50 text-red-600", generate: genSecurityContract },
  { id: 11, title: "Parking Allotment Register 2025-26", description: "Wing-wise parking slot allotment - 72 allotted, 8 visitor slots", category: "Parking", date: "01 Apr 2025", icon: Car, color: "bg-purple-50 text-purple-600", generate: genParkingRegister },
  { id: 12, title: "Election Notice - March 2026", description: "Official notice for Managing Committee elections on 30th March 2026", category: "Legal", date: "12 Mar 2026", icon: Vote, color: "bg-red-50 text-red-600", generate: genElectionNotice },
];

const categoryColor: Record<string, string> = {
  Legal: "bg-red-100 text-red-700",
  Financial: "bg-green-100 text-green-700",
  "Meeting Minutes": "bg-blue-100 text-blue-700",
  Emergency: "bg-orange-100 text-orange-700",
  Parking: "bg-purple-100 text-purple-700",
  Maintenance: "bg-yellow-100 text-yellow-700",
  Security: "bg-red-100 text-red-700",
};

export default function DocumentsPage() {
  // Pre-compressed signature data URLs loaded once on mount
  const [sigs, setSigs] = useState({ chairwoman: "", secretary: "" });
  const [sigsLoaded, setSigsLoaded] = useState(false);
  const [memberDirLoading, setMemberDirLoading] = useState(false);

  useEffect(() => {
    // Load and compress both signatures in parallel on mount
    Promise.all([
      compressSig("/sig-chairwoman.png"),
      compressSig("/sig-secretary.png"),
    ]).then(([chairwoman, secretary]) => {
      setSigs({ chairwoman, secretary });
      setSigsLoaded(true);
    });
  }, []);

  // Both view and download are async to pass pre-compressed sigs
  const handleView = (docDef: DocDef) => {
    const pdf = docDef.generate(sigs.chairwoman, sigs.secretary);
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleDownload = (docDef: DocDef) => {
    const pdf = docDef.generate(sigs.chairwoman, sigs.secretary);
    pdf.save(`${docDef.title.replace(/\s+/g, "_")}.pdf`);
  };

  const handleMemberDirectory = async (mode: "view" | "download") => {
    setMemberDirLoading(true);
    try {
      const pdf = await genMemberDirectory();
      const date = new Date().toISOString().split("T")[0];
      const filename = `Member_Directory_GreenwoodHeights_${date}.pdf`;
      if (mode === "view") {
        const blob = pdf.output("blob");
        window.open(URL.createObjectURL(blob), "_blank");
      } else {
        pdf.save(filename);
      }
    } finally {
      setMemberDirLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                <FileText className="w-12 h-12 text-indigo-500" />
              </motion.div>
              Document Vault
            </h1>
            <p className="text-lg text-gray-600">
              Society documents - click View or Download to open real PDFs
              {sigsLoaded && (
                <span className="ml-2 text-sm text-green-600 font-medium">
                  (signatures ready)
                </span>
              )}
            </p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-bold text-indigo-600">{DOCUMENTS.length + 1}</p>
            <p className="text-xs text-indigo-500">Documents</p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Member Directory - live PDF from Supabase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-indigo-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <BookUser className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              Directory
            </span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2 leading-snug">Member Directory</h3>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Full resident list sorted by Wing and Floor - name, flat, phone, email. Generated live from database.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Calendar className="w-3 h-3" />
            Live - always up to date
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => handleMemberDirectory("view")}
              disabled={memberDirLoading}
              className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              {memberDirLoading ? "Loading..." : "View"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => handleMemberDirectory("download")}
              disabled={memberDirLoading}
              className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          </div>
        </motion.div>
        {DOCUMENTS.map((doc, index) => {
          const Icon = doc.icon;
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${doc.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor[doc.category] || "bg-indigo-100 text-indigo-700"}`}>
                  {doc.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 leading-snug">{doc.title}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{doc.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <Calendar className="w-3 h-3" />
                {doc.date}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleView(doc)}
                  className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(doc)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
