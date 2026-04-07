// limpa retornado só os números
export const onlyNumbers = (value: string): string => {
    return value.replace(/\D/g, "");
}

// limpa, retornando só o nome
export const onlyName = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-zà-ÿ\s]/g, "") // remove símbolos e números
    .replace(/\s+/g, " ");       // normaliza espaços internos
};

// limpa um documento, sem assentos, apenas números
export const normalizeDocument = (document?: string) => {
    return  document?.replace(/[\D]/g, "") ?? ""; 
};