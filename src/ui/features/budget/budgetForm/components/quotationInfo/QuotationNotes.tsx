// redux
import { BudgetFormScope } from "../../store/@rootReducer";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setNotes } from "../../store/quotationInfo.slice";

// components
import ExpandableTextarea from "@/shared/inputs/ExpandableTextarea";

const QuotationNotes = ({ scope }: { scope: BudgetFormScope }) => {
    const notes = useAppSelector((state) => state.budgetForm.quotationInfo[scope].notes);
    const dispatch = useAppDispatch();

    return (
        <ExpandableTextarea
            label="Anotações"
            placeholder="(Opcional)"

            radius="lg"

            size="md"

            spellCheck={true}

            value={notes || ""}
            onChange={(e) => dispatch(setNotes({ scope, data: e.currentTarget.value }))}

            flex={1}
        />
    )
}

export default QuotationNotes