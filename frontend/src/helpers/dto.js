import http from "@/http";
import { formatDate } from "./date";

export const formatTemporaryToken = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export function checkMissingColumn(row, valueKey) {
  const rowData = getValue(row, valueKey);

  const rowValues = Object.values(rowData);
  const value = rowValues.some((c) => c === null);

  return !value;
}

export function objectToParams(obj) {
  const validParams = [];

  Object.keys(obj).forEach((item) => {
    if (obj[item]) {
      const tempValue = ["start", "end"].includes(item)
        ? formatDate(obj[item])
        : obj[item];
      validParams.push(`${item}=${tempValue}`);
    }
  });

  return validParams.length ? `?${validParams.join("&")}` : "";
}

export const equipmentFormDTO = (form) => {
  return {
    ...form,
    Location: {
      Name: form.LocationName,
      Coordinates: [form.x, form.y],
    },
    Id: form.Id,
    IdEquipmentExternal: form.Code,
    Name: form.Name,
    Altitude: Number(form.Altitude),
    Fk_Organ: form.Organ.value,
    Fk_Type: form.NomeTipoEquipamento.value,
  };
};

export const setAxiosHeader = (token) =>
  (http.defaults.headers.common["Authorization"] = `Bearer ${token}`);

export const getValue = (item, keyValOpt) => {
  if (!item) {
    return item;
  }

  const keyValue = keyValOpt ?? "valor";
  const keys = Object.keys(item);

  keys.forEach((key) => {
    if (item[key]?.[keyValue] || item[key]?.[keyValue] === null) {
      item[key] = item[key][keyValue];
    }
  });

  return item;
};

export const formatLocation = (item) => {
  if (item.Tipo === "bacia") {
    item["Bacia"] = item["Nome"];
  } else {
    item["Municipio"] = item["Nome"];
  }

  return item;
};

export const ungroupData = (items) => {
  const keys = Object.keys(items);
  const totalData = [];

  keys.forEach((key) => {
    const data = items[key].map((i) => {
      i.Bacia = key;
      i.Municipio = key;

      return i;
    });

    totalData.push(...data);
  });

  return totalData;
};
