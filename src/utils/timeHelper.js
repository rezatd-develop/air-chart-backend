import moment from "moment-jalaali";

export const filterAndGroupByTime = (rows, { dateField, range = "daily", start, end, valueField }) => {

  const startDate = start ? moment(start, "YYYY-MM-DD") : null;
  const endDate = end ? moment(end, "YYYY-MM-DD") : null;

  const filtered = rows.filter(item => {
    const date = moment(item[dateField], "jYYYY-jMM-jDD").format("YYYY-MM-DD");
    const dateMoment = moment(date, "YYYY-MM-DD");

    const afterStart = startDate ? dateMoment.isSameOrAfter(startDate, "day") : true;
    const beforeEnd = endDate ? dateMoment.isSameOrBefore(endDate, "day") : true;

    return afterStart && beforeEnd;
  });

  const grouped = {};
  filtered.forEach(item => {
    let key;
    const date = moment(item[dateField], "jYYYY-jMM-jDD");

    if (range === "yearly") key = date.format("jYYYY");
    else if (range === "monthly") key = date.format("jYYYY-jMM");
    else key = date.format("jYYYY-jMM-jDD");

    const value = valueField ? valueField(item) : 1;
    grouped[key] = (grouped[key] || 0) + value;
  });

  const labels = Object.keys(grouped).sort();
  const values = labels.map(k => grouped[k]);

  return { labels, values };
};
