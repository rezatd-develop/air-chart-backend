import File from "../../../models/fileModel.js";
import { translations } from "../../../translations/translations.js";
import { createResponseMessageClass } from "../../../utils/responseHelper.js";
import { filterAndGroupByTime } from "../../../utils/timeHelper.js";

export const getFileChartData = async (req, res) => {
    try {
        const { id } = req.params;
        const { range, start, end } = req.query;

        const file = await File.findById(id);
        if (!file) return res.status(404).json(createResponseMessageClass(null, true, translations.fileNotFound));

        const { labels, values } = filterAndGroupByTime(file.data, {
            dateField: "تاریخ ثبت",
            range,
            start,
            end,
            valueField: row => Number(row["خرید کل"]) || 0
        });

        const data = {
            labels,
            datasets: [
                {
                    label: "Total Price",
                    data: values,
                    borderColor: "#FF6384",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    fill: true
                }
            ]
        };

        res.json(createResponseMessageClass(data, false, null));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating chart", error });
        res.status(500).json(createResponseMessageClass(null, true, translations.errorGeneratingChart));
    }
};

export const getFilePurchaseByCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);
        if (!file) return res.status(404).json(createResponseMessageClass(null, true, translations.fileNotFound));

        const rows = file.data;

        const mainCompanies = ["عمران ارگ", "روابط عمومی کرمان موتور", "کادک-طراحی قطعات"];

        const counts = {
            "عمران ارگ": 0,
            "روابط عمومی کرمان موتور": 0,
            "کادک-طراحی قطعات": 0,
            "سایر": 0
        };

        rows.forEach(row => {
            const company = row["نام شرکت"];
            if (mainCompanies.includes(company)) {
                counts[company]++;
            } else {
                counts["سایر"]++;
            }
        });

        const data = {
            labels: Object.keys(counts),
            datasets: [
                {
                    label: "Purchase Count by Company",
                    data: Object.values(counts),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#AAAAAA"]
                }
            ]
        };

        res.json(createResponseMessageClass(data, false, null));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating company chart", error });
        res.status(500).json(createResponseMessageClass(null, true, translations.errorGeneratingBookCountChart));
    }
};

export const getFileProfitChart = async (req, res) => {
    try {
        const { id } = req.params;
        const { range, start, end } = req.query;

        const file = await File.findById(id);
        if (!file) return res.status(404).json(createResponseMessageClass(null, true, translations.fileNotFound));

        const { labels, values } = filterAndGroupByTime(file.data, {
            dateField: "تاریخ ثبت",
            range,
            start,
            end,
            valueField: row => Number(row["سود"] || 0)
        });

        const data = {
            labels,
            datasets: [
                {
                    label: "Fully Rounded",
                    data: values,
                    borderColor: "#FF6384",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderWidth: 2,
                    borderRadius: Number.MAX_VALUE,
                    borderSkipped: false
                },
                {
                    label: "Small Radius",
                    data: values,
                    borderColor: "#36A2EB",
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderWidth: 2,
                    borderRadius: 5,
                    borderSkipped: false
                }
            ]
        };

        res.json(createResponseMessageClass(data, false, null));
    } catch (error) {
        console.error(error);
        res.status(500).json(createResponseMessageClass(null, true, translations.errorGeneratingProfitChart));
    }
};

export const getFileDiscountChart = async (req, res) => {
    try {
        const { id } = req.params;
        const { range, start, end } = req.query;

        const file = await File.findById(id);
        if (!file) return res.status(404).json(createResponseMessageClass(null, true, translations.fileNotFound));

        const { labels, values } = filterAndGroupByTime(file.data, {
            dateField: "تاریخ ثبت",
            range,
            start,
            end,
            valueField: row => Number(row["کمیسیون/تخفیف"] || 0)
        });

        const counts = filterAndGroupByTime(file.data, {
            dateField: "تاریخ ثبت",
            range,
            start,
            end
        }).values;

        const avgValues = values.map((v, i) => v / counts[i]);

        const data = {
            labels,
            datasets: [
                {
                    label: "Cubic interpolation (monotone)",
                    data: avgValues,
                    borderColor: "#FF6384",
                    fill: false,
                    cubicInterpolationMode: "monotone",
                    tension: 0.4
                },
                {
                    label: "Cubic interpolation",
                    data: avgValues,
                    borderColor: "#36A2EB",
                    fill: false,
                    tension: 0.4
                },
                {
                    label: "Linear interpolation (default)",
                    data: avgValues,
                    borderColor: "#4BC0C0",
                    fill: false
                }
            ]
        };

        res.json(createResponseMessageClass(data, false, null));
    } catch (error) {
        console.error(error);
        res.status(500).json(null, true, translations.errorGeneratingDiscountChart);
    }
};
