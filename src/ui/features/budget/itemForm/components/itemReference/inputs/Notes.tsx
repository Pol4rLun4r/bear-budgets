// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks.ts";
import { getItemFormState } from "../../../store/itemForm.selectors";
import { setReferenceField, type ItemFormScope } from "../../../store/itemForm.slice";

// components
import ExpandableTextarea from "@/shared/inputs/ExpandableTextarea";

const Notes = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useAppDispatch();
    const { item_reference } = useAppSelector((state) => getItemFormState(state, scope));

    return (
        <ExpandableTextarea
            radius="lg"
            label="Notas"
            placeholder="Adicione uma observação (opcional)"
            readOnly={!!item_reference.id}
            value={item_reference.notes ?? ""}
            onChange={(event) =>
                dispatch(setReferenceField({
                    scope,
                    key: "notes",
                    value: event.currentTarget.value,
                }))
            }
        />
    )
}

export default Notes;