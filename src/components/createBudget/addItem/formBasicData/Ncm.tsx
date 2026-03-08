// mantine
import { TextInput } from "@mantine/core";

// react
import { useEffect } from "react";

// redux
import { AppDispatch, RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setNcm } from "../../../../redux/createBudget/items/addItemSlice";

// style 
import classes from './Item.module.css'

// type
import type { FormType } from "./type";

const NCM = ({ form }: FormType) => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        form.setFieldValue('ncm', (itemData.ncm as string) ?? '');
    }, [itemData.ncm]);

    return (
        <TextInput
            {...form.getInputProps('ncm')}
            className={classes.input}
            label="NCM"
            placeholder="(opcional)"
            radius='lg'
            readOnly={!!itemData.id} // desabilita se já tiver um item selecionado
            onChange={(e) => {
                form.getInputProps('ncm').onChange(e);
                dispatch(setNcm(e.currentTarget.value));
            }}
        />
    )
}

export default NCM