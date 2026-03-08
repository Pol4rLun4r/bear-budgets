// mantine
import { TextInput } from "@mantine/core";

// react
import { useEffect } from "react";

// redux
import { AppDispatch, RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setInternalCode } from "../../../../redux/createBudget/items/addItemSlice";

// style 
import classes from './Item.module.css'

// type
import type { FormType } from "./type";

const InternalCode = ({ form }: FormType) => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        form.setFieldValue('internal_code', (itemData.internal_code as string) ?? '');
    }, [itemData.internal_code]);

    return (
        <TextInput
            {...form.getInputProps('internal_code')}
            className={classes.input}
            label="Código interno"
            placeholder="(opcional)"
            radius='lg'
            readOnly={!!itemData.id} // desabilita se já tiver um item selecionado
            onChange={(e) => {
                form.getInputProps('internal_code').onChange(e);
                dispatch(setInternalCode(e.currentTarget.value));
            }}
        />
    )
}

export default InternalCode