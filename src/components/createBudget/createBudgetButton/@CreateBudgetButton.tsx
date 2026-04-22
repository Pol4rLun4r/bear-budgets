// mantine
import { Button } from "@mantine/core"
import { notifications } from "@mantine/notifications";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { QuotationQuery } from "../../../redux/createBudget/quotationSlice";
import { itemDataType } from "../../../redux/createBudget/items/itemFormSlice";

// utils
import { validateDocument } from "../../../../utils/documentValidator";

// types
import { ClientQuery } from "../../../types/client";

// api
import quotationService from "../../../services/quotation-api";
import { AxiosError } from "axios";

interface ErrorResponseData {
    data: string;
}

export type QuotationPayload = {
    client: ClientQuery;
    quotation: QuotationQuery;
    items: itemDataType[];
};

const CreateBudgetButton = () => {
    const items = useSelector((state: RootState) => state.createBudget.listItems);
    const client = useSelector((state: RootState) => state.createBudget.client);
    const quotation = useSelector((state: RootState) => state.createBudget.quotation);

    const isClient = validateDocument(client.document ?? "") && (client.name ?? "").trim().length > 0;

    const hasValues = items.length > 0 && isClient;

    const budgetData: QuotationPayload = { client, quotation, items };

    const handleCreateBudget = async () => {
        try {
            await quotationService.createQuotationAndItems(budgetData);

            notifications.show({
                title: 'Criado',
                message: 'Orçamento criado com sucesso!',
                position: 'top-right',
                color: 'teal'
            })

        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponseData>;
            const errorMessage = axiosError.response?.data?.data || axiosError.message || 'Erro desconhecido';

            notifications.show({
                title: 'Algo deu errado!',
                message: errorMessage,
                color: 'pink',
                position: 'top-right'
            })

        }
    };

    return (
        <Button
            radius="lg"
            size="md"
            disabled={!hasValues}
            onClick={() => handleCreateBudget()}
        >
            Criar Orçamento
        </Button>
    )
}

export default CreateBudgetButton;