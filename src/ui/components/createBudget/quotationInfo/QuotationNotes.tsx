// mantine
import { Textarea } from "@mantine/core"

// redux
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setNotes } from "../../../redux/createBudget/quotationSlice";

const QuotationNotes = () => {
    const notes = useSelector((state: RootState) => state.createBudget.quotation.notes);
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
            onChange={(e) => dispatch(setNotes(e.currentTarget.value))}

            flex={1}
        />
    )
}

export default QuotationNotes