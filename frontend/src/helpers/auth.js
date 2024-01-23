export const retrieveToken = () => localStorage.getItem("tkn");

export const storeToken = (token) => localStorage.setItem("tkn", token);

export const clearToken = () => localStorage.setItem("tkn", "");
