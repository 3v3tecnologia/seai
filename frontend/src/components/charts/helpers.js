import { itemsPerGraph } from "../../constants";

export const groupByKeyData = (data, groupByKeyData) => {
  if (!data.length) {
    return {};
  }

  const groupdedData = {};

  let keyGroup = data[0]["Municipio"] ? "Municipio" : "Bacia";

  if (groupByKeyData) {
    keyGroup = groupByKeyData;
  }

  const mapedKeysUnique = new Set(data.map((d) => d[keyGroup]));

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
