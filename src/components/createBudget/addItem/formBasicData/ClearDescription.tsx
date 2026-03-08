// mantine
import { ActionIcon } from "@mantine/core"

// icon
import { IconX } from "@tabler/icons-react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { resetItemDescription, resetBasicItemData } from "../../../../redux/createBudget/items/addItemSlice";

const ClearDescription = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isHasId = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData.id);

    const handleClear = () => {
        if (isHasId) {
            return dispatch(resetBasicItemData())
        }

        dispatch(resetItemDescription());
    }

    return (
        <ActionIcon variant="transparent" onClick={() => handleClear()}>
            <IconX />
        </ActionIcon>
    )
}

export default ClearDescription;