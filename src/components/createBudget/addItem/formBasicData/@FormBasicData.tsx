// components
import Description from "./inputs/description/@Description";
import InternalCode from "./inputs/InternalCode";
import NCM from "./inputs/Ncm";
import ManufacturerCode from "./inputs/ManufacturerCode";
import Notes from "./notes/@Notes";

// mantine
import { Group, Stack } from "@mantine/core";

const FormBasicData = () => {
    return (
        <Stack gap="md">
            <Stack gap="md">
                <Description />
                <Group grow justify="center" align="flex-end">
                    <InternalCode />
                    <ManufacturerCode />
                    <NCM />
                </Group>
            </Stack>
            <Notes />
        </Stack>
    )
};

export default FormBasicData;