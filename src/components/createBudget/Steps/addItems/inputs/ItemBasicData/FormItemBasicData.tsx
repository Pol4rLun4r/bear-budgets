// react
import { useEffect } from "react";

// components
import Description from "./Description";
import References from "./References";

// mantine
import { Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

// redux
import { AppDispatch, RootState } from "../../../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setItemBasicData, resetAddItemData } from "../../../../../../redux/createBudget/items/addItemSlice";

const FormItemBasicData = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData);
    const dispatch = useDispatch<AppDispatch>();

    const form = useForm({
        mode: 'controlled',
        initialValues: itemData,
        validate: {
            description: ((value: string) => value.trim() ? null : 'A descrição é obrigatória'),

        }
    })

    // envia alterações do formulário para o store (só quando os valores realmente mudam)
    const { description, id, internal_code, manufacturer_code, ncm } = form.values;
    useEffect(() => {
        if (!description.trim()) {
            dispatch(resetAddItemData());
            return;
        }
        // evita loop: não dispara se o conteúdo já é o mesmo do Redux
        if (
            itemData.description === description &&
            itemData.id === id &&
            itemData.internal_code === internal_code &&
            itemData.manufacturer_code === manufacturer_code &&
            itemData.ncm === ncm
        ) {
            return;
        }
        dispatch(setItemBasicData(form.values));
    }, [description, id, internal_code, manufacturer_code, ncm, dispatch, itemData.description, itemData.id, itemData.internal_code, itemData.manufacturer_code, itemData.ncm]);

    // quando itemData mudar externamente (ex.: item selecionado na lista), atualiza o form
    useEffect(() => {
        if (
            itemData.description === form.values.description &&
            itemData.id === form.values.id &&
            itemData.internal_code === form.values.internal_code &&
            itemData.manufacturer_code === form.values.manufacturer_code &&
            itemData.ncm === form.values.ncm
        ) {
            return;
        }
        form.setValues(itemData);
    }, [itemData.id, itemData.description, itemData.internal_code, itemData.manufacturer_code, itemData.ncm]);

    return (

        <form id="item-basic-data-form">
            <Stack gap="md">
                <Description form={form} />
                <Group grow justify="center" align="flex-end">
                    <TextInput
                        {...form.getInputProps('internal_code')}
                        label="Código interno"
                        placeholder="(opcional)"
                        radius='lg'
                        disabled={!!itemData.id} // desabilita se já tiver um item selecionado
                    />
                    <TextInput
                        {...form.getInputProps('manufacturer_code')}
                        label="Código do fabricante"
                        placeholder="(opcional)"
                        radius='lg'
                        disabled={!!itemData.id} // desabilita se já tiver um item selecionado
                    />
                    <TextInput
                        {...form.getInputProps('ncm')}
                        label="NCM"
                        placeholder="(opcional)"
                        radius='lg'
                        disabled={!!itemData.id} // desabilita se já tiver um item selecionado
                    />
                </Group>
                <References />
            </Stack>
        </form>
    )
}

export default FormItemBasicData;