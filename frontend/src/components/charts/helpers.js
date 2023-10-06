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
