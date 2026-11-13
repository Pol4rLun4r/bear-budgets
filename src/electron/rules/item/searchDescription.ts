// utils
import { success, failure } from "../../utils/handleSuccess.js";

export const rulesCode = {
    DESCRIPTION_NOT_INFORMED: "Cada item deve ter uma descrição",
    DESCRIPTION_NOT_STRING: "A descrição deve ser uma string",
}

const searchDescriptionRules = (rawQuery: SearchItemReferenceQuery) => {
    if (typeof rawQuery === "string") {
        const query = rawQuery.trim();

        if (!query) {
            return failure(rulesCode.DESCRIPTION_NOT_INFORMED);
        }

        return success(query);
    }

    if (!rawQuery || typeof rawQuery !== "object") {
        return failure(rulesCode.DESCRIPTION_NOT_STRING);
    }

    const fields = ["description", "internal_code", "manufacturer_code"] as const;
    if (fields.some((field) => rawQuery[field] !== undefined && typeof rawQuery[field] !== "string")) {
        return failure(rulesCode.DESCRIPTION_NOT_STRING);
    }

    const query: Required<SearchItemReferenceFields> = {
        description: rawQuery.description?.trim() ?? "",
        internal_code: rawQuery.internal_code?.trim() ?? "",
        manufacturer_code: rawQuery.manufacturer_code?.trim() ?? "",
    };

    if (fields.every((field) => !query[field])) {
        return failure(rulesCode.DESCRIPTION_NOT_INFORMED);
    }

    return success(query);
};

export default searchDescriptionRules;