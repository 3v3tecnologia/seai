import http from "@/http";
import { formatDate } from "./date";
import moment from "moment";

export const formatTemporaryToken = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const accessStoreKey = (store, keys) => {
  let tempStore = store;

  if (typeof keys == "string") {
    return tempStore[keys];
  }

  keys?.forEach((key) => {
    tempStore = tempStore[key];
  });
  return tempStore;
};

export function checkMissingColumn(row, valueKey) {
  const rowData = getValue(row, valueKey);

  const rowValues = Object.values(rowData);
  const value = rowValues.some((c) => c === null);

  return !value;
}

export const unwrapEquip = (equip) => {
  const equipmentType = ["Estação", "Pluviômetro"];

  equip.Location = equip.Location?.Name;
  equip.Organ = equip.Organ.Name;
  equip.Type = equip.Type.Name || "station";
  equip.NomeTipoEquipamento =
    equip.Type === "pluviometer" ? equipmentType[1] : equipmentType[0];
  return equip;
};

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

export const getValueBasic = (item) => getValue(item);

export const formatLocation = (item) => {
  if (item.Tipo === "bacia") {
    item["Bacia"] = item["Nome"];
  } else {
    item["Municipio"] = item["Nome"];
  }

  return item;
};

export const ungroupData = (items, showingDataFormatUrl) => {
  const keys = Object.keys(items);
  const totalData = [];
  console.log(
    "ungrouping by",
    showingDataFormatUrl,
    JSON.parse(JSON.stringify(items)),
    keys
  );

  keys.forEach((key) => {
    const data = items[key].map((i) => {
      if (showingDataFormatUrl === "basin") {
        i.Bacia = key;
      } else {
        i.Municipio = key;
      }

      return i;
    });

    totalData.push(...data);
  });

  return totalData;
};

export const columnFullDateFormat = (col) => {
  return col._cell.value
    ? moment(col._cell.value).format("DD/MM/YYYY HH:ss")
    : "";
};

export const unwrapNewsLetter = (newsletterFromApi) => {
  return {
    ...newsletterFromApi,
    id: newsletterFromApi.Id,
    Title: newsletterFromApi.Title,
    Description: newsletterFromApi.Description,
    Auth: newsletterFromApi.Author.Organ,
    Time: newsletterFromApi.Time,
    Hour: newsletterFromApi.Hour,
  };
};

export const decodeBin = (encoded) => {
  // Remover o prefixo "data:text/html;charset=utf-8;base64,"
  const base64Content = encoded.replace(
    /^data:text\/html;charset=utf-8;base64,/,
    ""
  );

  // Decodificar a string base64
  const decodedContent = atob(base64Content);

  return decodedContent;
};

export const decodeByteArr = (data) => {
  const byteArray = data.data;
  const enc = new TextDecoder("utf-8");
  const bin = enc.decode(new Uint8Array(byteArray));

  return decodeBin(bin);
};

export const encodeBin = (inputString = "") => {
  // Encode the input string to Base64
  const base64Encoded = btoa(unescape(encodeURIComponent(inputString)));

  // Create the data URL string
  const dataURL = `data:text/html;charset=utf-8;base64,${base64Encoded}`;

  return dataURL;
};

export const getUnixTime = (timestamp) => moment(timestamp).valueOf();

export const toTimestamp = (date) => {
  moment.locale("pt-br");
  return moment(date).format();
};

export const mapOptions = (options) => {
  const mapedCronsOptionsTemp = {};

  for (let i = 0; i < options.length; i++) {
    const current = options[i];
    mapedCronsOptionsTemp[current.key] = current.value;
  }

  return mapedCronsOptionsTemp;
};

export const concatUrlFiltersList = (url, filters = {}) => {
  const params = {
    idEquipment: filters._itemId,
    start: filters.start,
    end: filters.end,
    pageNumber: filters.pageNumber,
  };

  return `${url}${objectToParams(params)}`;
};
