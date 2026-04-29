// mantine
import { TextInput } from "@mantine/core";

// redux
import { AppDispatch, RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ItemFormScope, setManufacturerCode } from "../../../../../redux/createBudget/items/itemFormSlice";

const ManufacturerCode = ({ scope }: { scope: ItemFormScope }) => {
    const itemData = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_basic_data);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <TextInput
            label="Código do fabricante"
            placeholder="(opcional)"
            radius='lg'
            readOnly={!!itemData.id} // desabilita se já tiver um item selecionado

            // configurações do valor do input
            value={itemData.manufacturer_code as string || ''}
            onChange={(e) => dispatch(setManufacturerCode({ scope, value: e.currentTarget.value }))}
        />
    )
}

export default ManufacturerCode;