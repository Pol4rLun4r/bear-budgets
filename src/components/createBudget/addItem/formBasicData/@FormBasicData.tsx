// components
import Description from "./Description";
import InternalCode from "./InternalCode";
import NCM from "./Ncm";
import ManufacturerCode from "./ManufacturerCode";
import Notes from "./notes/@Notes";

// mantine
import { Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

// redux
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

const FormBasicData = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData);

    const form = useForm({
        mode: 'controlled',
        initialValues: { ...itemData },
        validate: {
            description: ((value: string) => value.trim() ? null : 'A descrição é obrigatória'),

        }
    });

    return (
        <Stack gap="md">
            <form id="item-basic-data-form">
                <Stack gap="md">
                    <Description form={form} />
                    <Group grow justify="center" align="flex-end">
                        <InternalCode form={form} />
                        <ManufacturerCode form={form} />
                        <NCM form={form} />
                    </Group>
                </Stack>
            </form>
            <Notes />
        </Stack>
    )
};

export default FormBasicData;