// utils
import { success, failure } from "../utils/handleSuccess";
import { onlyName, onlyNumbers } from "../utils/clean";

export type SearchClientDataType = {
    value: string;
    type: 'document' | 'name'
}

function identifyType(value: string): "number" | "letters" | "Invalid" {
    // Check if it contains only numbers.
    if (/^\d+$/.test(value)) {
        return "number";
    }

    // Check if it contains only letters (considering accents and uppercase/lowercase letters).
    if (/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
        // Se após remover os espaços sobrar algo e for só letra
        if (value.trim().length === 0) return "Invalid";
        return "letters";
    }

    // Returns invalid if it contains letters and numbers together.
    return "Invalid"
}

const searchClientsRules = ({ type, value }: SearchClientDataType) => {
    // check if is empty
    if (value.trim().length <= 0) {
        return failure('Nenhum valor informado')
    }

    // check type
    if (type !== 'name' && type !== 'document') {
        return failure('Por favor, especifique o tipo da busca')
    }

    // check if is invalid
    if (identifyType(value) === 'Invalid') {
        return failure("Busca inválida, não pode conter letras e números juntos")
    }

    // check if the type is document
    if (type === 'document') {

        // checks if value is number
        if (identifyType(value) === 'number') {
            return success(onlyNumbers(value), 'DOCUMENT');
        }

        return failure("Não use nomes para buscar um documento")
    }

    // checks if the type is name
    if (type === 'name') {

        // check if value is letters
        if (identifyType(value) === 'letters') {
            return success(onlyName(value), 'NAME');
        }

        return failure("Não use números para buscar um nome")
    }

    return failure("Não encontrado");
}

export default searchClientsRules;