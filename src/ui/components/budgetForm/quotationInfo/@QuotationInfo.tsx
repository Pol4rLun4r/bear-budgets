// components
import BudgetButton from "./BudgetButton";
import QuotationNotes from "./QuotationNotes";

// redux
import { BudgetFormScope } from "../../../redux/budgetForm/@rootReducer";

// mantine
import { Group } from "@mantine/core";

const QuotationInfo = ({ scope }: { scope: BudgetFormScope }) => {
    return (
        <Group
            w="100%"
            mb='md'
            style={{
                alignItems: 'flex-end'

            }} >
            <QuotationNotes scope={scope} />
            <BudgetButton scope={scope} />
        </Group>
    )
}

export default QuotationInfo;