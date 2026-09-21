// mantine
import { useDisclosure } from "@mantine/hooks";

import BudgetTable from "./BudgetTable.tsx";
import { Modal } from "@mantine/core";

// components
import BudgetForm from "../../budgetForm/@BudgetForm.tsx";

const List = ({ budgets }: { budgets: Quotation[] }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <BudgetTable budgets={budgets} open={open} />

            <Modal
                padding='xl'
                size="100%"
                opened={opened}
                onClose={close}
                title={"Informações do Orçamento"}
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 0,
                }}
            >
                {opened && <BudgetForm scope="budget_form_edit" />}
            </Modal>
        </>
    )
}

export default List;