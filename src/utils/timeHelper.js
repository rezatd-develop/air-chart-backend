import moment from "moment-jalaali";

export const filterAndGroupByTime = (rows, { dateField, range = "daily", start, end, valueField }) => {

    const filtered = rows.filter(item => {
    const date = moment(item[dateField], "jYYYY-jMM-jDD");
    const afterStart = start ? date.isSameOrAfter(moment(start, "jYYYY-jMM-jDD")) : true;
    const beforeEnd = end ? date.isSameOrBefore(moment(end, "jYYYY-jMM-jDD")) : true;
    return afterStart && beforeEnd;
  });

  const grouped = {};
  filtered.forEach(item => {
    let key;
    if (range === "yearly") key = moment(item[dateField], "jYYYY-jMM-jDD").format("jYYYY");
    else if (range === "monthly") key = moment(item[dateField], "jYYYY-jMM-jDD").format("jYYYY-jMM");
    else key = moment(item[dateField], "jYYYY-jMM-jDD").format("jYYYY-jMM-jDD");

    const value = valueField ? valueField(item) : 1;
    grouped[key] = (grouped[key] || 0) + value;
  });

  const labels = Object.keys(grouped).sort();
  const values = labels.map(k => grouped[k]);

  return { labels, values };
};
