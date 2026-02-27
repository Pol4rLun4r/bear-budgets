// components
import Description from "./ItemBasicData/Description";
import InternalCode from "./ItemBasicData/InternalCode";
import NCM from "./ItemBasicData/InternalCode copy";
import ManufacturerCode from "./ItemBasicData/ManufacturerCode";
import References from "./ItemBasicData/References";

// mantine
import { Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

// redux
import { RootState } from "../../../../../redux/store";
import { useSelector } from "react-redux";

const FormItemBasicData = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData);

    const form = useForm({
        mode: 'controlled',
        initialValues: { ...itemData },
        validate: {
            description: ((value: string) => value.trim() ? null : 'A descrição é obrigatória'),

        }
    })

    return (
        <form id="item-basic-data-form">
            <Stack gap="md">
                <Description form={form} />
                <Group grow justify="center" align="flex-end">
                    <InternalCode form={form} />
                    <ManufacturerCode form={form}/>
                    <NCM form={form}/>
                </Group>
                <References />
            </Stack>
        </form>
    )
}

export default FormItemBasicData;