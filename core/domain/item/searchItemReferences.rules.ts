// utils
import { success, failure } from "../../utils/handleSuccess";

const searchItemReferencesRules = (rawQuery: unknown) => {
    // check if rawQuery is a string
    if (typeof rawQuery !== "string") {
        return failure("Por favor, informe uma string");
    }

    // check if rawQuery is empty
    if (rawQuery.trim().length <= 0) {
        return failure("Nenhum valor informado");
    }

    return success(rawQuery);
};

export default searchItemReferencesRules;