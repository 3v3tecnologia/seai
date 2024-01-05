import { toast } from "vue3-toastify";
import { itemsPerGraph } from "../constants";

export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const monthDict = {
  Janeiro: 1,
  Fevereiro: 2,
  Março: 3,
  Abril: 4,
  Maio: 5,
  Junho: 6,
  Julho: 7,
  Agosto: 8,
  Setembro: 9,
  Outubro: 10,
  Novembro: 11,
  Dezembro: 12,
};

const monthNumber = (text) => monthDict[text];

export const dataLabels = {
  enabled: true,
  style: {
    fontSize: "10px",
    fontWeight: "normal",
  },
};

export const validatePasswords = ({ password, confirmPassword }) => {
  const isPasswordsUnMatching = password != confirmPassword;

  if (isPasswordsUnMatching) {
    toast.error("Senhas estão divergindo");
    return false;
  }

  return true;
};

export const groupByKeyData = (data, groupByKey) => {
  if (!data.length) {
    return {};
  }

  const groupdedData = {};
  let keyGroup = "";

  if (groupByKey?.type) {
    keyGroup = groupByKey.key;
  } else {
    keyGroup = data[0]["Municipio"] ? "Municipio" : "Bacia";
  }

  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    const currentGroupedVal = current[keyGroup];

    if (!groupdedData[currentGroupedVal]) {
      groupdedData[currentGroupedVal] = [];
    }

    if (groupdedData[currentGroupedVal].length < itemsPerGraph) {
      groupdedData[currentGroupedVal].push(current);
    }
  }

  return groupdedData;
};

export const getUniqueStackKeys = (data, stackKey) => {
  return [...new Set(data.map((d) => d[stackKey]))].slice(0, itemsPerGraph);
};

export const labelsCharts = (groupedData, groupByKey) => {
  let sortedData = [];

  if (groupByKey?.type === "month") {
    sortedData = months;
  } else {
    sortedData = Object.keys(groupedData).sort().slice(0, itemsPerGraph);
  }

  return sortedData;
};

export const formatterPlot = (val) => {
  let tempVal = val;
  let suffix = "";

  if (val > 1000) {
    suffix = "K";
    tempVal = Math.floor(tempVal / 1000);
  } else {
    tempVal = Math.floor(tempVal);
  }

  return `${tempVal}${suffix}`;
};

export const formatterXTooltip = (seriesName) => `${seriesName}`;

export const formatterLabels = (val) => {
  if (monthNumber(val)) {
    return val.slice(0, 3);
  }

  return val.length > 10 ? `${val.slice(0, 7)}...` : val;
};

export const mountSeries = (
  seriesStackKeys,
  labels,
  groupedData,
  stackKey,
  valueKey
) => {
  const series = seriesStackKeys.map((stack) => {
    const data = labels
      .map((l) => groupedData[l] || [])
      .map((l) => l.find((v) => v[stackKey] == stack))
      .map((l) => (l ? l[valueKey] : 0));

    return {
      name: stack,
      data,
    };
  });

  return series;
};

export const fixPointsFloat = (val) => (val ? Number(val.toFixed(2)) : 0);
