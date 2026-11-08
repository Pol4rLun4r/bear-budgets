// mantine
import { TextInput } from "@mantine/core";

// icons
import { IconIdBadge } from "@tabler/icons-react"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { changeItemReferenceField } from "@/features/items/store/ItemReferenceFieldChange.thunk";
;

const NCM = () => {
    const itemReference = useAppSelector((state) => state.items.editItemReference)
    const dispatch = useAppDispatch();

    return (
        <TextInput
            label="NCM"
            placeholder="Opcional"
            leftSection={<IconIdBadge size={17} />}
            value={itemReference?.ncm ?? ""}
            onChange={(event) => dispatch(changeItemReferenceField({
                key: "ncm",
                value: event.currentTarget.value
            }))}
        />
    )
}

export default NCM;