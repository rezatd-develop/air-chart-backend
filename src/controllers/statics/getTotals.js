// controllers/statistics/getTotals.js
import File from "../../models/fileModel.js";
import { createResponseMessageClass } from "../../utils/responseHelper.js";
import { translations } from "../../translations/translations.js";

export const getAllTotals = async (req, res) => {
    try {
        // Get all files
        const files = await File.find();

        if (!files || files.length === 0) {
            return res.status(200).json(createResponseMessageClass(null, true, translations.noFilesFound));
        }

        let totalPrice = 0;   // قیمت کل
        let totalPurchase = 0; // خرید کل
        let totalProfit = 0;   // سود
        let finalAmount = 0;   // مبلغ نهایی

        for (const file of files) {
            if (!file.data || file.data.length === 0) continue;

            for (const row of file.data) {
                // adjust these keys to your Excel column names
                const price = Number(row["قیمت کل"]) || 0;
                const purchase = Number(row["خرید کل"]) || 0;
                const profit = Number(row["سود"]) || 0;
                const final = Number(row["مبلغ نهایی"]) || 0;

                totalPrice += price;
                totalPurchase += purchase;
                totalProfit += profit;
                finalAmount += final;
            }
        }

        const result = {
            totalPrice,
            totalPurchase,
            totalProfit,
            finalAmount,
        };

        return res.status(200).json(createResponseMessageClass(result, false, translations.success));
    } catch (err) {
        console.error(err);
        return res.status(500).json(createResponseMessageClass(null, true, translations.errorOccurred));
    }
};
