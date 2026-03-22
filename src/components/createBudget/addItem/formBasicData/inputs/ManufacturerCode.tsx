// mantine
import { TextInput } from "@mantine/core";

// redux
import { AppDispatch, RootState } from "../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setManufacturerCode } from "../../../../../redux/createBudget/items/addItemSlice";

const ManufacturerCode = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <TextInput
            label="Código do fabricante"
            placeholder="(opcional)"
            radius='lg'
            readOnly={!!itemData.id} // desabilita se já tiver um item selecionado

            // configurações do valor do input
            value={itemData.manufacturer_code as string || ''}
            onChange={(e) => dispatch(setManufacturerCode(e.currentTarget.value))}
        />
    )
}

export default ManufacturerCode;