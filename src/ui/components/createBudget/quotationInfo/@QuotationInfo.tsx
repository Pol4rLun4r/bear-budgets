// components
import CreateBudgetButton from "./CreateBudgetButton";
import QuotationNotes from "./QuotationNotes";

// mantine
import { Group } from "@mantine/core";

const QuotationInfo = () => {
    return (
        <Group
            w="100%"
            mb='md'
            style={{
                alignItems: 'flex-end'

            }} >
            <QuotationNotes />
            <CreateBudgetButton />
        </Group>
    )
}

export default QuotationInfo;