// utils
import { success, failure } from "../../utils/handleSuccess";
import { onlyNumbers, onlyName } from "../../utils/clean";
import { validateDocument } from "../../../utils/documentValidator";

// types
import type { ClientQuery } from "../../types/client";
import type { ClientType, Client } from "../../types/client";

interface CreateClient extends Omit<ClientQuery, "id"> {
    clientExistsByDocument?: Client | undefined
    clientExistsById?: Client | undefined
};

const createClientRules = ({ clientExistsById, clientExistsByDocument, document, name, notes, type_client }: CreateClient) => {
    const cleanedName = onlyName(name!)
    const cleanedDocument = onlyNumbers(document!);
    const cleanedTypeClient = onlyName(type_client as string);

    // verifica se cliente existe baseado no id
    if (clientExistsById) {
        return success(clientExistsById, 'CLIENT_EXISTS_BY_ID');
    }

    // verifica se cliente existe baseado no documento
    if (clientExistsByDocument) {
        return success(clientExistsByDocument, 'CLIENT_EXISTS_BY_DOCUMENT');
    }

    // checar se o nome existe
    if (cleanedName.length === 0) {
        return failure('Nome é obrigatório');
    }

    // checar se o documento existe
    if (cleanedDocument.length === 0) {
        return failure('Documento é obrigatório');
    }

    // checar se o documento é válido
    if (!validateDocument(cleanedDocument)) {
        return failure('Informe um documento válido');
    }

    // checar o tipo do cliente
    if (type_client !== 'internacional' && type_client !== 'nacional') {
        return failure('Por favor, especifique o tipo do cliente. Internacional ou Nacional')
    }

    const data: ClientQuery = {
        name: cleanedName,
        document: cleanedDocument,
        type_client: cleanedTypeClient as ClientType,
        notes: notes?.length !== 0 ? notes : null,
    }

    return success(data);
};

export const cleanDocument = (document: string) => {
    return onlyNumbers(document);
};

export default createClientRules;

