import File from "../models/fileModel.js";
import { translations } from "../translations/translations.js";
import { createResponseMessageClass } from "../utils/responseHelper.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import vazirFont from '../utils/vazir-font.js';

// Register custom fonts if needed
// import font from "../../../assets/fonts/vazir-font.js";

export const exportFileReportPdf = async (req, res) => {


    try {
        const { id } = req.params;
        const file = await File.findById(id);
        if (!file)
            return res.status(404).json(createResponseMessageClass(null, true, translations.fileNotFound));

        const rows = file.data || [];

        // ---- 1️⃣ Calculate seller sales ----
        const sellerSales = {};
        rows.forEach(row => {
            const seller = row["seller"] || row["نام فروشنده"] || "ناشناس";
            const amount = Number(row["خرید کل"]) || 0;
            sellerSales[seller] = (sellerSales[seller] || 0) + amount;
        });

        // ---- 2️⃣ Calculate customer purchases ----
        // Define main companies
        const mainCompanies = ["عمران ارگ", "روابط عمومی کرمان موتور", "کادک-طراحی قطعات"];

        // Initialize counts
        const customerPurchases = {};
        mainCompanies.forEach(c => customerPurchases[c] = 0);
        customerPurchases["سایر"] = 0;

        // Aggregate purchases
        rows.forEach(row => {
            const company = row["نام شرکت"] || "سایر";
            const amount = Number(row["خرید کل"]) || 0;

            if (mainCompanies.includes(company)) {
                customerPurchases[company] += amount;
            } else {
                customerPurchases["سایر"] += amount;
            }
        });


        // ---- 3️⃣ Calculate month-over-month buyer growth ----
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const buyersThisMonth = new Set();
        const buyersLastMonth = new Set();

        rows.forEach(row => {
            const date = new Date(row["تاریخ ثبت"]);
            const buyer = row["نام خریدار"] || "ناشناس";
            if (date.getFullYear() === currentYear && date.getMonth() === currentMonth)
                buyersThisMonth.add(buyer);
            if (date.getFullYear() === currentYear && date.getMonth() === currentMonth - 1)
                buyersLastMonth.add(buyer);
        });

        const growth =
            buyersLastMonth.size === 0
                ? 100
                : ((buyersThisMonth.size - buyersLastMonth.size) / buyersLastMonth.size) * 100;

        // ---- 4️⃣ Create the PDF ----
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        // Register font
        // vazirFont should be the base64 string of the TTF
        doc.addFileToVFS("Vazir-Regular.ttf", vazirFont);
        doc.addFont("Vazir-Regular.ttf", "Vazir", "normal"); // name must match second param
        doc.setFont("Vazir", "normal"); // set font family + style




        // Optional Persian font
        // doc.addFileToVFS("Vazir.ttf", font);
        // doc.addFont("Vazir.ttf", "Vazir", "normal");
        // doc.setFont("Vazir");

        doc.setFontSize(18);
        doc.text("📊 گزارش فروش و خرید", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.text(`تاریخ گزارش: ${new Date().toLocaleDateString("fa-IR")}`, 105, 30, { align: "center" });


        // Seller Sales Table
        const sellerTable = Object.entries(sellerSales).map(
            ([seller, total]) => [seller, total.toLocaleString("fa-IR")]
        );

        // Customer Purchases Table
const customerTable = Object.entries(customerPurchases).map(
  ([company, total]) => [company, total.toLocaleString("fa-IR")]
);


        autoTable(doc, {
            startY: 40,
            head: [["نام فروشنده", "میزان فروش"]],
            body: sellerTable,
            styles: { font: "Vazir", fontStyle: "normal", halign: "right" },
            headStyles: { font: "Vazir", fontStyle: "normal", halign: "center" },
            theme: "grid"
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["نام خریدار", "میزان خرید"]],
            body: customerTable,
            styles: { font: "Vazir", fontStyle: "normal", halign: "right" },
            headStyles: { font: "Vazir", fontStyle: "normal", fillColor: [41, 128, 185], textColor: 255, halign: "center" },
            theme: "grid"
        });





        // Growth Info
        doc.setFontSize(14);
        const growthText =
            growth >= 0
                ? `افزایش ${growth.toFixed(1)}٪ در تعداد خریداران نسبت به ماه قبل`
                : `کاهش ${Math.abs(growth).toFixed(1)}٪ در تعداد خریداران نسبت به ماه قبل`;
        doc.text(growthText, 105, doc.lastAutoTable.finalY + 15, { align: "center" });

        // ---- 5️⃣ Send PDF as download ----
        const pdfBuffer = doc.output("arraybuffer");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
        res.send(Buffer.from(pdfBuffer));

    } catch (error) {
        console.error(error);
        res.status(500).json(createResponseMessageClass(null, true, translations.errorGeneratingChart));
    }
};
