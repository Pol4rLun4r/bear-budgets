// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { changeItemReferenceField } from "@/features/items/store/ItemReferenceFieldChange.thunk";

// components
import ExpandableTextarea from "@/shared/inputs/ExpandableTextarea";

const Notes = () => {
    const itemReference = useAppSelector((state) => state.items.editItemReference)
    const dispatch = useAppDispatch();

    return (
        <ExpandableTextarea
            radius="lg"
            label="Notas"
            placeholder="Adicione uma observação (opcional)"
            value={itemReference?.notes ?? ""}
            onChange={(event) => dispatch(changeItemReferenceField({
                key: "notes",
                value: event.currentTarget.value
            }))}
        />
    )
}

export default Notes