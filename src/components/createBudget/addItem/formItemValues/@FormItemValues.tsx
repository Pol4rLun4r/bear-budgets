// mantine
import { Divider, Group, Stack } from "@mantine/core";

// components
import UnitValue from "./inputs/UnitValue";
import Calc from "./Calc";
import Quantity from "./inputs/Quantity";
import IPI from "./inputs/IPI";
import ST from "./inputs/ST";
import Markup from "./inputs/Markup";
import PurchaseShipping from "./inputs/PurchaseShipping";

const FormItemValues = () => {
    return (
        <Stack gap="md">
            <Group gap={0} align="flex-start" justify="space-between">
                <UnitValue/>
                <Quantity/>
                <Markup/>
            </Group>
            <Group grow justify="center" align="flex-end">
                <IPI/>
                <ST/>
                <PurchaseShipping/>
            </Group>
            <Divider />
            <Calc />
        </Stack>
    )
}

export default FormItemValues;