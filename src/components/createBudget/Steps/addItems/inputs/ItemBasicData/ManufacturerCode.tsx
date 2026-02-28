// mantine
import { TextInput } from "@mantine/core";

// react
import { useEffect } from "react";

// redux
import { AppDispatch, RootState } from "../../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setManufacturerCode } from "../../../../../../redux/createBudget/items/addItemSlice";

import classes from './Item.module.css';

// type
import type { FormType } from "./type";

const ManufacturerCode = ({ form }: FormType) => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        form.setFieldValue('manufacturer_code', (itemData.manufacturer_code as string) ?? '');
    }, [itemData.manufacturer_code]);

    return (
        <TextInput
            {...form.getInputProps('manufacturer_code')}
            className={classes.input}
            label="Código do fabricante"
            placeholder="(opcional)"
            radius='lg'
            disabled={!!itemData.id} // desabilita se já tiver um item selecionado
            onChange={(e) => {
                form.getInputProps('manufacturer_code').onChange(e);
                dispatch(setManufacturerCode(e.currentTarget.value));
            }}
        />
    )
}

export default ManufacturerCode;