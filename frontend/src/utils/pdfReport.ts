import jsPDF from "jspdf";
import alertIcon from "./icons/alert";
import waterIcon from "./icons/water";
import fuelIcon from "./icons/fuel";
import sheetIcon from "./icons/sheet";
import clockIcon from "./icons/clock";
import recyclebinIcon from "./icons/recyclebin";
import rupeeIcon from "./icons/rupee";
import flashIcon from "./icons/flash";

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
}

interface Card {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: string; // base64 icon string
}

export function downloadAveragesPdf(data: AveragesData, title: string) {
  const doc = new jsPDF("p", "mm", "a4");

  // Header
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38); // red
  doc.text(`${title} - Sustainability Report (${data.year})`, 105, 20, {
    align: "center",
  });

  // Example icons (replace with real base64 PNG/SVGs)

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

  // Grid layout
  const startX = 20;
  const startY = 35;
  const cardW = 55;
  const cardH = 40;
  const gapX = 10;
  const gapY = 15;

  cards.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);

    // Card box
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(x, y, cardW, cardH, 3, 3, "F");

    // Icon circle
    doc.setFillColor(c.color);
    doc.circle(x + 7, y + 10, 5, "F");

    // Icon image
    doc.addImage(c.icon, "PNG", x + 3, y + 6, 8, 8);

    // Label
    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text(c.label, x + 15, y + 12);

    // Value
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`${c.unit} ${c.value}`, x + 7, y + 25);

    // Year
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Year: ${data.year}`, x + 7, y + 35);
  });

  doc.save(`${title}_Dashboard_${data.year}.pdf`);
}
