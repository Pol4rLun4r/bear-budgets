// utils
import { success, failure } from "../utils/handleSuccess";

// types
import type { ClientType } from "../db/schema";

function hasItems(arr: unknown[]): boolean {
  return arr.length > 0;
}

const searchClientsRules = (data: ClientType[]) => {
    // check array
    if(!hasItems(data)) {
        return failure("No customers found")
    }

    return success(data);
}

export default searchClientsRules