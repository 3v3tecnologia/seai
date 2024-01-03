import { toast } from "vue3-toastify";
import { itemsPerGraph } from "../constants";

const months = [
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

export const validatePasswords = ({ password, confirmPassword }) => {
  const isPasswordsUnMatching = password != confirmPassword;

  if (isPasswordsUnMatching) {
    toast.error("Senhas estão divergindo");
    return false;
  }

  return true;
};

export const groupByKeyData = (tempData, groupByKey) => {
  const data = JSON.parse(JSON.stringify(tempData));
  if (!data.length) {
    return {};
  }

  const groupdedData = {};

  let keyGroup = "";
  let mapedKeysUnique = [];

  if (groupByKey?.type === "month") {
    keyGroup = groupByKey.key;
    mapedKeysUnique = months;
  } else {
    keyGroup = data[0]["Municipio"] ? "Municipio" : "Bacia";
    mapedKeysUnique = new Set(data.map((d) => d[keyGroup]));
  }

  mapedKeysUnique.forEach((key) => {
    groupdedData[key] = data.filter((d) => d[keyGroup] === key);
  });

  return groupdedData;
};

export const getUniqueStackKeys = (data, stackKey) => {
  return [...new Set(data.map((d) => d[stackKey]))];
};

export const labelsCharts = (groupedData) => {
  return Object.keys(groupedData).sort().slice(0, itemsPerGraph);
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

export const formatterLabels = (val, opt) => {
  return val.length > 10 ? `${val.slice(0, 7)}...` : val;
};

export const fixPointsFloat = (val) => (val ? Number(val.toFixed(2)) : 0);
