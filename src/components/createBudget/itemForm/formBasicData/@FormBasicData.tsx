// components
import Description from "./inputs/description/@Description";
import InternalCode from "./inputs/InternalCode";
import NCM from "./inputs/Ncm";
import ManufacturerCode from "./inputs/ManufacturerCode";
import Notes from "./notes/@Notes";

// mantine
import { Group, Stack } from "@mantine/core";

// types
import { ItemFormScope } from "../../../../redux/createBudget/items/itemFormSlice";

const FormBasicData = ({ scope }: { scope: ItemFormScope }) => {
    return (
        <Stack gap="md">
            <Stack gap="md">
                <Description scope={scope} />
                <Group grow justify="center" align="flex-end">
                    <InternalCode scope={scope} />
                    <ManufacturerCode scope={scope} />
                    <NCM scope={scope} />
                </Group>
            </Stack>
            <Notes scope={scope} />
        </Stack>
    )
};

export default FormBasicData;