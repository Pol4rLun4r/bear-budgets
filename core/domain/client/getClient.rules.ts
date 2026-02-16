// types
import type { ClientType } from "../../../types/client";

// utils
import { failure, success } from "../../utils/handleSuccess";

interface GetClientDataType {
    client_id: number;
    clientExists: ClientType | undefined;
}

const getClientRules = ({ clientExists, client_id }: GetClientDataType) => {
    // check if client_id is empty
    if (!client_id) {
        return failure('Cliente ID não informado');
    }

    // check if client exists
    if (!clientExists) {
        return failure('Cliente não existe');
    }

    return success(client_id);
}

export default getClientRules;