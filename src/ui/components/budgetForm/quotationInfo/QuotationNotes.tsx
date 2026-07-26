// mantine
import { Textarea } from "@mantine/core"

// redux
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setNotes } from "../../../redux/budgetForm/quotationInfoSlice";
import { BudgetFormScope } from "../../../redux/budgetForm/@rootReducer";

const QuotationNotes = ({ scope }: { scope: BudgetFormScope }) => {
    const notes = useSelector((state: RootState) => state.budgetForm.quotationInfo[scope].notes);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Textarea
            label="Notas da cotação"
            placeholder="Espaço para notas sobre a cotação (Opcional)"

            radius="lg"

            size="md"

            autosize
            maxRows={2}

            value={notes || ""}
            onChange={(e) => dispatch(setNotes({ scope, data: e.currentTarget.value }))}

            flex={1}
        />
    )
}

export default QuotationNotes