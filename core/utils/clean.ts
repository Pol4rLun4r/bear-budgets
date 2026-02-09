export const onlyNumbers = (value: string): string => {
    return value.replace(/\D/g, "");
}

export const onlyName = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-zà-ÿ\s]/g, "") // remove símbolos e números
    .replace(/\s+/g, " ");       // normaliza espaços internos
};