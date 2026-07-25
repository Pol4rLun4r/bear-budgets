// components
import Description from "./inputs/description/@Description.tsx";
import InternalCode from "./inputs/InternalCode.tsx";
import NCM from "./inputs/Ncm.tsx";
import ManufacturerCode from "./inputs/ManufacturerCode.tsx";

// redux
import type { RootState } from "../../../redux/store.ts";
import { useSelector } from "react-redux";

// mantine
import { Group, Stack } from "@mantine/core";

// types
import type { ItemFormScope } from "../../../redux/itemForm/itemFormSlice.ts";
import Links from "./links/@Links.tsx";
import Notes from "./notes/@Notes.tsx";

const FormItemReference = ({ scope }: { scope: ItemFormScope }) => {
    const switchMode = useSelector((state: RootState) => state.itemForm.switchMode.mode);

    return (
        <Stack gap="md">
            <Stack gap="md">
                <Description scope={scope} />
                {!switchMode &&
                    <Group grow justify="center" align="flex-end">
                        <InternalCode scope={scope} />
                        <ManufacturerCode scope={scope} />
                        <NCM scope={scope} />
                    </Group>
                }
            </Stack>
            <Group grow gap={0} pt="sm">
                <Links scope={scope} />
                <Notes scope={scope} />
            </Group>
        </Stack>
    )
};

export default FormItemReference;