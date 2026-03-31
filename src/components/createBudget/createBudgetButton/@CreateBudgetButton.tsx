// mantine
import { Button } from "@mantine/core"

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

// utils
import { validateDocument } from "../../../../utils/documentValidator";

const CreateBudgetButton = () => {
    const items = useSelector((state: RootState) => state.createBudget.listItems);
    const client = useSelector((state: RootState) => state.createBudget.client);

    const isClient =
        validateDocument(client.document ?? "") && (client.name ?? "").trim().length > 0;

    const hasValues = items.length > 0 && isClient;

    return (
        <Button radius="lg" size="md" disabled={!hasValues}>
            Criar Orçamento
        </Button>
    )
}

export default CreateBudgetButton;