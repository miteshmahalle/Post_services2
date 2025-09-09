import jsPDF from "jspdf";
import alertIcon from "./icons/alert";
import waterIcon from "./icons/water";
import fuelIcon from "./icons/fuel";
import sheetIcon from "./icons/sheet";
import clockIcon from "./icons/clock";
import recyclebinIcon from "./icons/recyclebin";
import rupeeIcon from "./icons/rupee";
import flashIcon from "./icons/flash";
import headericon from "./icons/headericon";   // ✅ ESG red-gradient cover image
import indianpost from "./icons/indianpost";

// ✅ Add your summary images here
import summaryImg1 from "./icons/summaryImg1";
import summaryImg2 from "./icons/summaryImg2";
import summaryImg3 from "./icons/platformimg";

export interface AveragesData {
  avg_complaints_count: string;
  avg_energy_bill: string;
  avg_energy_kwh: string;
  avg_fuel_litres: string;
  avg_paper_reams: string;
  avg_training_hours: string;
  avg_waste_kg: string;
  avg_water_litres: string;
  year: number;
  address?: string;
}

interface Card {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: string;
}

export function downloadAveragesPdf(
  data: AveragesData,
  divisionName: string,
  managerName: string,
  title: string
) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ---------------- HEADER ----------------
  const addHeader = () => {
    doc.addImage(indianpost, "PNG", 5, 10, 35, 20);
    doc.setFontSize(16);
    doc.setTextColor(40, 75, 140);
    doc.setFont("helvetica", "bold");
    doc.text("Business Responsibility and Sustainability Report", pageWidth / 2, 20, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("Department of Post", pageWidth / 2, 27, { align: "center" });

    doc.setDrawColor(40, 75, 140);
    doc.setLineWidth(0.5);
    doc.line(5, 32, pageWidth - 5, 32);
  };

  // ---------------- FOOTER ----------------
  const addFooter = () => {
  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(30);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
      align: "center"
    });
  }
};


  // ---------------- FRONT PAGE (COVER) ----------------
  addHeader();

  doc.addImage(headericon, "PNG", 60, 80, pageWidth - 120, 120);

  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38);
  doc.setFont("helvetica", "bold");
  doc.text("Business Responsibility and Sustainability Report", pageWidth / 2, 250, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Prepared for: Department of Post", pageWidth / 2, 260, {
    align: "center",
  });

  addFooter();

  // ---------------- PAGE 2: Division Info + Cards ----------------
  doc.addPage();
  addHeader();

  let infoY = 45;
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Division Name: ${divisionName}`, 20, infoY);
  doc.text(`Manager Name: ${managerName}`, 20, infoY + 8);
  doc.text(`Address: ${data.address || "N/A"}`, 20, infoY + 16);
  doc.text(`Report Year: ${data.year}`, 20, infoY + 24);

  const cards: Card[] = [
    { label: "Energy Bill", value: `₹ ${data.avg_energy_bill}`, unit: "", color: "#16a34a", icon: rupeeIcon },
    { label: "Water Usage", value: data.avg_water_litres, unit: "L", color: "#06b6d4", icon: waterIcon },
    { label: "Energy Usage", value: data.avg_energy_kwh, unit: "kWh", color: "#f59e0b", icon: flashIcon },
    { label: "Fuel Consumption", value: data.avg_fuel_litres, unit: "L", color: "#2563eb", icon: fuelIcon },
    { label: "Paper Usage", value: data.avg_paper_reams, unit: "reams", color: "#8b5cf6", icon: sheetIcon },
    { label: "Training Hours", value: data.avg_training_hours, unit: "hrs", color: "#6366f1", icon: clockIcon },
    { label: "Waste Generated", value: data.avg_waste_kg, unit: "kg", color: "#f97316", icon: recyclebinIcon },
    { label: "Complaints", value: data.avg_complaints_count, unit: "", color: "#dc2626", icon: alertIcon },
  ];

  const startX = 20;
  const startY = 80;
  const cardW = 55;
  const cardH = 40;
  const gapX = 10;
  const gapY = 15;

  cards.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(x, y, cardW, cardH, 3, 3, "F");

    doc.setFillColor(c.color);
    doc.circle(x + 7, y + 10, 5, "F");

    doc.addImage(c.icon, "PNG", x + 3, y + 6, 8, 8);

    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text(c.label, x + 17, y + 12);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`${c.value} ${c.unit}`, x + 17, y + 25);

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Year: ${data.year}`, x + 17, y + 35);
  });

  addFooter();

  // ---------------- SUMMARY PAGE 1 ----------------
  doc.addPage();
  addHeader();
  let yPosition = 45;

  doc.setFontSize(14);
  doc.setTextColor(40, 75, 140);
  doc.setFont("helvetica", "bold");
  doc.text("1. What is BRSR and Why It is Important", 20, yPosition);

  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(0);
  const text1 = doc.splitTextToSize(
    "The Business Responsibility and Sustainability Report (BRSR) is a framework introduced to enhance transparency, accountability, and sustainability practices of organizations. It ensures that companies disclose their performance not only in financial terms but also in terms of their environmental, social, and governance (ESG) responsibilities. BRSR is important because it: Promotes responsible and sustainable business practices. Helps organizations track and reduce their environmental impactBuilds trust with stakeholders, investors, and the public. Encourages data-driven decision making for long-term sustainability.",
    pageWidth - 40
  );
  doc.text(text1, 20, yPosition);

  // Add image below text
  doc.addImage(summaryImg1, "PNG", 20, 160, pageWidth - 40, 80);

  addFooter();

  // ---------------- SUMMARY PAGE 2 ----------------
  doc.addPage();
  addHeader();
  yPosition = 45;

  doc.setFontSize(14);
  doc.setTextColor(40, 75, 140);
  doc.setFont("helvetica", "bold");
  doc.text("2. How BRSR Helps Organizations", 20, yPosition);

  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(0);
  const text2 = doc.splitTextToSize(
    "Environmental, Social, and Governance (ESG) refers to the three critical dimensions used to measure the sustainability and ethical impact of an organization’s operations: Environmental (E): Energy consumption, water usage, waste management, pollution control, etc. Social (S): Employee welfare, diversity, training, workplace safety, and community development. Governance (G): Transparency, accountability, ethical business practices, and compliance with laws.",
    pageWidth - 40
  );
  doc.text(text2, 20, yPosition);

  doc.addImage(summaryImg2, "PNG", 20, 160, pageWidth - 40, 80);

  addFooter();

  // ---------------- SUMMARY PAGE 3 ----------------
  doc.addPage();
  addHeader();
  yPosition = 45;

  doc.setFontSize(14);
  doc.setTextColor(40, 75, 140);
  doc.setFont("helvetica", "bold");
  doc.text("3. Features of Our Project", 20, yPosition);

  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(0);
  const text3 = doc.splitTextToSize(
    "Our project is a secure, multi-user platform designed to simplify and digitize the process of ESG data collection, reporting, and monitoring for postal organizations. The system supports multiple roles including Circle, Division, and Branch officers, ensuring that each level of the hierarchy can submit and view ESG data relevant to them. User authentication and role-based access ensure data security, integrity, and controlled access to sensitive information. The platform can compute averages and totals from the data submitted by different users, reducing manual workload and minimizing errors. The system generates structured reports aligned with BRSR requirements, ensuring compliance and helping organizations present their sustainability data effectively.",
    pageWidth - 40
  );
  doc.text(text3, 20, yPosition);

  doc.addImage(summaryImg3, "PNG", 20, 160, pageWidth - 40, 80);

  addFooter();

  // ---------------- SAVE PDF ----------------
  doc.save(`${title}_Dashboard_${data.year}.pdf`);
}
