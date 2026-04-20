// components
import Description from "./inputs/description/@Description";
import InternalCode from "./inputs/InternalCode";
import NCM from "./inputs/Ncm";
import ManufacturerCode from "./inputs/ManufacturerCode";
import Notes from "./notes/@Notes";

// redux
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

// mantine
import { Group, Stack } from "@mantine/core";

// types
import { ItemFormScope } from "../../../../redux/createBudget/items/itemFormSlice";

const FormBasicData = ({ scope }: { scope: ItemFormScope }) => {
    const switchMode = useSelector((state: RootState) => state.createBudget.itemFormSwitchMode.mode);

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
            <Notes scope={scope} />
        </Stack>
    )
};

export default FormBasicData;