import File from "../../../models/fileModel.js";

export const getFileServiceChart = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const rows = file.data;

    const counts = { "پرواز": 0, "هتل": 0, "سایر": 0 };

    rows.forEach(row => {
      const service = row["سرویس"];
      if (service === "پرواز") counts["پرواز"]++;
      else if (service === "هتل") counts["هتل"]++;
      else counts["سایر"]++;
    });

    const data = {
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Service Type Count",
          data: Object.values(counts),
          backgroundColor: [
            "#FF6384", 
            "#36A2EB",
            "#FFCE56"  
          ]
        }
      ]
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating service chart", error });
  }
};
