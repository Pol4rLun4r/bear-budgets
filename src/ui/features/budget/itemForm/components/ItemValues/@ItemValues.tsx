// mantine
import { Divider, Group, Stack, UnstyledButton, Text } from "@mantine/core";

// components
import UnitPrice from "./inputs/UnitPrice";
import Calc from "./Calc";
import Quantity from "./inputs/Quantity";
import IPI from "./inputs/IPI";
import ST from "./inputs/ST";
import Markup from "./inputs/Markup";
import PurchaseShipping from "./inputs/PurchaseShipping";
import ExtraValue from "./inputs/ExtraValue";
import Boarding from "./inputs/Boarding/@Boarding";
import Delivery from "./inputs/Delivery";
import HistoryPrice from "./HistoryPrice/@HistoryPrice";

// redux
import { ItemFormScope, resetItemValues } from "../../store/itemForm.slice";
import { getSwitchModeValuesForm } from "../../store/itemForm.selectors";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { applyDefaultItemValues } from "../../store/itemForm.slice";
import hasVisibleCalculationSummary from "../../utils/hasVisibleCalculationSummary";

const ItemValues = ({
    scope,
    showInlineCalc = true,
}: {
    scope: ItemFormScope;
    showInlineCalc?: boolean;
}) => {
    const switchMode = useAppSelector(getSwitchModeValuesForm);
    const simpleModeVisibleFields = useAppSelector(
        (state) => state.settings.value?.interface.itemForm.itemValues.simpleModeVisibleFields ?? [],
    );
    const visibleFields = new Set(simpleModeVisibleFields);
    const isVisible = (field: ItemValuesSimpleField) =>
        !switchMode || visibleFields.has(field);
    const optionalInputFields: ItemValuesSimpleField[] = [
        "ipi",
        "st",
        "extraValue",
    ];
    const deliveryFields: ItemValuesSimpleField[] = [
        "boarding",
        "delivery",
        "purchaseShipping",
    ];
    const hasVisibleCalculations = hasVisibleCalculationSummary(
        switchMode,
        simpleModeVisibleFields,
    );
    const dispatch = useAppDispatch();
    const defaultItemValues = useAppSelector(
        (state) => state.settings.value?.interface.itemForm.itemValues,
    );

    const handleClear = () => {
        dispatch(resetItemValues(scope));
        if (scope !== "item_form_edit" && defaultItemValues) {
            dispatch(applyDefaultItemValues({
                scope,
                markup: defaultItemValues.defaultMarkup,
                boarding: defaultItemValues.defaultBoarding,
                delivery: defaultItemValues.defaultDelivery,
            }));
        }
    };

    return (
        <Stack gap="md">
            <Group align="flex-end" style={{ position: "relative" }}>
                <UnstyledButton style={{ position: 'absolute', right: 0, top: 0 }} onClick={() => handleClear()} >
                    <Text c={'violet'}>Limpar dados</Text>
                </UnstyledButton>
                {isVisible("historyPrice") && <HistoryPrice scope={scope} />}
                <UnitPrice scope={scope} />
                <Quantity scope={scope} />
                <Markup scope={scope} />
            </Group>
            <Stack gap="md">
                {optionalInputFields.some(isVisible) && (
                    <Group grow justify="center" align="flex-end">
                        {isVisible("ipi") && <IPI scope={scope} />}
                        {isVisible("st") && <ST scope={scope} />}
                        {isVisible("extraValue") && <ExtraValue scope={scope} />}
                    </Group>
                )}
                {deliveryFields.some(isVisible) && (
                    <Group justify="center" align="flex-end">
                        {isVisible("boarding") && <Boarding scope={scope} />}
                        {isVisible("delivery") && <Delivery scope={scope} />}
                        {isVisible("purchaseShipping") && <PurchaseShipping scope={scope} />}
                    </Group>
                )}
            </Stack>
            {showInlineCalc && hasVisibleCalculations && (
                <>
                    <Divider />
                    <Calc scope={scope} />
                </>
            )}
        </Stack>
    )
}

export default ItemValues;