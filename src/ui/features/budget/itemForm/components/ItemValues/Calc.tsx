// mantine
import { ActionIcon, CopyButton, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";

// icons
import {
    IconCalendarStats,
    IconCoins,
    IconCurrencyReal,
    IconTag,
    IconExclamationCircle,
    IconPercentage,
    IconReceipt,
    IconReceiptTax,
    IconTrendingUp,
    IconTruckDelivery,
} from "@tabler/icons-react";

// styles
import classes from "./Calc.module.css";

// redux
import { useAppSelector } from "@/app/reduxHooks";
import {
    getItemFormState,
    getSwitchModeValuesForm,
} from "../../store/itemForm.selectors";
import { ItemFormScope } from "../../store/itemForm.slice";

// utils
import calcAddItem from "@/utils/calcAddItem";
import { differenceInCalendarDays, getDeliveryDate } from "@/utils/boardingUtils";
import formatNumberForClipboard from "@/utils/formatNumberForClipboard";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const formatCurrency = (value: number) =>
    Number.isFinite(value) ? brl.format(value) : "—";

const Calc = ({
    scope,
    layout = "grid",
}: {
    scope: ItemFormScope;
    layout?: "grid" | "primary" | "details";
}) => {
    const { item_values, toggleStMode: switchStMode } = useAppSelector((state) => getItemFormState(state, scope));
    const simpleMode = useAppSelector(getSwitchModeValuesForm);
    const simpleModeVisibleFields = useAppSelector(
        (state) => state.settings.value?.interface.itemForm.itemValues.simpleModeVisibleFields ?? [],
    );
    const visibleFields = new Set(simpleModeVisibleFields);
    const isVisible = (field: ItemValuesSimpleField) =>
        !simpleMode || visibleFields.has(field);

    const {
        totalWithoutTaxes,
        ipiValue,
        stValue,
        totalWithIPIandST,
        markupValue,
        totalAfterMarkup,
        totalExtrasAndShipping,
        discountValue,
        totalBeforeDiscount,
        totalWithAll,
        finalUnitValue,
    } = calcAddItem({ ...item_values, switchStMode });
    const hasIPI = (item_values.ipi ?? 0) > 0;
    const hasST = (item_values.st ?? 0) > 0;
    const hasExtraValue = (item_values.extra_value ?? 0) > 0;
    const hasPurchaseShipping = (item_values.purchase_shipping ?? 0) > 0;
    const hasDiscount = (item_values.discount_value ?? 0) > 0;
    const baseDate = new Date();
    const totalDeliveryDays = differenceInCalendarDays(
        baseDate,
        getDeliveryDate(baseDate, item_values.boarding ?? 0, item_values.delivery ?? 0),
    );
    const calculations = [
        {
            field: "totalWithoutTaxes" as const,
            label: "Total sem impostos",
            explanation: "Quantidade multiplicada pelo preço unitário. Este é o valor-base dos cálculos.",
            value: formatCurrency(totalWithoutTaxes),
            copyValue: totalWithoutTaxes,
            icon: IconReceipt,
            primary: true,
            visible: isVisible("totalWithoutTaxes"),
        },
        ...(hasIPI
            ? [{
                field: "ipiValue" as const,
                label: "Acréscimo de IPI",
                explanation: "Percentual de IPI aplicado sobre o valor-base (quantidade × preço unitário).",
                value: `+ ${formatCurrency(ipiValue)}`,
                copyValue: ipiValue,
                icon: IconPercentage,
                primary: false,
                visible: isVisible("ipiValue"),
            }]
            : []),
        ...(hasST
            ? [{
                field: "stValue" as const,
                label: "Acréscimo de ST",
                explanation: switchStMode
                    ? "Percentual de ST aplicado sobre o subtotal com IPI."
                    : "Valor fixo de ST informado, somado ao subtotal com IPI.",
                value: `+ ${formatCurrency(stValue)}`,
                copyValue: stValue,
                icon: IconReceiptTax,
                primary: false,
                visible: isVisible("stValue"),
            }]
            : []),
        {
            field: "totalWithIPIandST" as const,
            label: "Total com impostos",
            explanation: "Total sem impostos somado ao IPI e à ST. Ainda não inclui a margem.",
            value: formatCurrency(totalWithIPIandST),
            copyValue: totalWithIPIandST,
            icon: IconReceiptTax,
            primary: true,
            visible: isVisible("totalWithIPIandST"),
        },
        {
            field: "markupValue" as const,
            label: "Valor da margem",
            explanation: "Valor em reais acrescentado pela margem, calculada sobre o total com impostos.",
            value: `+ ${formatCurrency(markupValue)}`,
            copyValue: markupValue,
            icon: IconPercentage,
            accent: "margin" as const,
            highlight: true,
            primary: false,
            visible: isVisible("markupValue"),
        },
        {
            field: "markupValue" as const,
            label: "Total com margem",
            explanation: "Total com impostos e margem. Ainda não inclui valores extras, frete de compra nem o desconto.",
            value: formatCurrency(totalAfterMarkup),
            copyValue: totalAfterMarkup,
            icon: IconTrendingUp,
            accent: "margin" as const,
            highlight: true,
            primary: true,
            visible: isVisible("markupValue"),
        },
        ...((hasExtraValue || hasPurchaseShipping)
            ? [{
                field: hasExtraValue ? "extraValue" as const : "purchaseShipping" as const,
                label: "Valores extras + frete",
                explanation: "Soma do valor extra e do frete de compra, adicionados após a margem.",
                value: `+ ${formatCurrency(totalExtrasAndShipping)}`,
                copyValue: totalExtrasAndShipping,
                icon: IconTruckDelivery,
                primary: false,
                visible: isVisible("extraValue") || isVisible("purchaseShipping"),
            }]
            : []),
        ...(hasDiscount
            ? [{
                field: "discount" as const,
                label: "Desconto",
                explanation: item_values.discount_type === "percentage"
                    ? "Percentual aplicado sobre o total com impostos, margem, valores extras e frete. O desconto não ultrapassa esse total."
                    : "Valor em reais subtraído do total com impostos, margem, valores extras e frete, sem permitir um total negativo.",
                value: `− ${formatCurrency(discountValue)}`,
                copyValue: discountValue,
                icon: IconTag,
                highlight: true,
                accent: "discount" as const,
                primary: false,
                visible: true,
            }]
            : []),
        {
            label: "Total sem desconto",
            explanation: "Total completo do cálculo, com impostos, margem, valores extras e frete de compra, antes de aplicar o desconto.",
            value: formatCurrency(totalBeforeDiscount),
            copyValue: totalBeforeDiscount,
            icon: IconCoins,
            primary: true,
            visible: true,
        },
        {
            field: "totalWithAll" as const,
            label: "Total completo",
            explanation: "Total com impostos, margem, valores extras e frete de compra, menos o desconto aplicado.",
            value: formatCurrency(totalWithAll),
            copyValue: totalWithAll,
            icon: IconCoins,
            primary: true,
            visible: isVisible("totalWithAll"),
        },
        {
            field: "finalUnitValue" as const,
            label: "Valor unitário final",
            explanation: "Total completo dividido pela quantidade do item.",
            value: formatCurrency(finalUnitValue),
            copyValue: finalUnitValue,
            icon: IconCurrencyReal,
            accent: "final" as const,
            highlight: true,
            primary: true,
            visible: isVisible("finalUnitValue"),
        },
    ];
    const visibleCalculations = calculations.filter(({ visible }) => visible);
    const primaryCalculations = visibleCalculations.filter(({ primary }) => primary);
    const detailCalculations = visibleCalculations.filter(({ primary }) => !primary);
    const displayedCalculations =
        layout === "primary"
            ? primaryCalculations
            : layout === "details"
                ? detailCalculations
                : visibleCalculations;
    const showTotalDeliveryDays =
        isVisible("boarding") && isVisible("delivery");

    const renderCalculation = (
        { label, explanation, value, copyValue, highlight, accent, icon: CalculationIcon }: (typeof visibleCalculations)[number],
        compact = false,
    ) => {
        const clipboardValue = formatNumberForClipboard(copyValue);

        return (
            <CopyButton value={clipboardValue ?? ""} timeout={1500}>
                {({ copied, copy }) => (
                    <Tooltip
                        label={clipboardValue ? (copied ? "Valor copiado" : "Copiar valor") : ""}
                        position="top"
                        withArrow
                        withinPortal
                    >
                        <Paper
                            key={label}
                            className={[
                                clipboardValue ? classes.copyableCard : undefined,
                                highlight && accent === "discount"
                                    ? classes.discountValue
                                    : highlight && accent === "margin"
                                        ? classes.marginValue
                                        : highlight ? classes.finalValue : undefined,
                            ].filter(Boolean).join(" ")}
                            withBorder
                            radius="lg"
                            p={compact ? "xs" : "sm"}
                            onClick={clipboardValue ? copy : undefined}
                            onKeyDown={(event) => {
                                if (!clipboardValue || event.target !== event.currentTarget) return;
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    copy();
                                }
                            }}
                            role={clipboardValue ? "button" : undefined}
                            tabIndex={clipboardValue ? 0 : undefined}
                            aria-label={
                                clipboardValue
                                    ? copied
                                        ? `${label}: valor copiado`
                                        : `Copiar valor de ${label}`
                                    : undefined
                            }
                        >
                            <Stack gap={compact ? 2 : 4}>
                                <Group gap={4} wrap="nowrap" align="center">
                                    <ThemeIcon
                                        size={22}
                                        radius="xl"
                                        variant="light"
                                        color={
                                            accent === "discount"
                                                ? "red"
                                                : accent === "margin"
                                                    ? "green"
                                                : accent === "final"
                                                    ? "violet"
                                                    : highlight ? "teal" : "gray"
                                        }
                                    >
                                        <CalculationIcon size={14} stroke={1.8} />
                                    </ThemeIcon>
                                    <Text
                                        size="xs"
                                        fw={600}
                                        c="dimmed"
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            fontSize: "calc(var(--mantine-font-size-xs) * 1.1)",
                                        }}
                                    >
                                        {label}
                                    </Text>
                                    <Tooltip
                                        label={explanation}
                                        position="top"
                                        withArrow
                                        withinPortal
                                        multiline
                                        maw={280}
                                        events={{ hover: true, focus: true, touch: false }}
                                    >
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            size="xs"
                                            style={{ flexShrink: 0 }}
                                            aria-label={`Como é calculado: ${label}`}
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <IconExclamationCircle size={15} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                                <Text
                                    size={compact ? "sm" : "lg"}
                                    fw={700}
                                    style={{
                                        overflowWrap: "anywhere",
                                        fontSize: `calc(var(--mantine-font-size-${compact ? "sm" : "lg"}) * 1.1)`,
                                    }}
                                >
                                    {value}
                                </Text>
                            </Stack>
                        </Paper>
                    </Tooltip>
                )}
            </CopyButton>
        );
    };

    const renderDeliveryEstimate = (compact = false) => (
        <Paper
            key="delivery-estimate"
            className={classes.deliveryEstimate}
            withBorder
            radius="lg"
            p={compact ? "xs" : "sm"}
        >
            <Stack gap={compact ? 2 : 4}>
                <Group gap={4} wrap="nowrap" align="center">
                    <ThemeIcon size={22} radius="xl" variant="light" color="blue">
                        <IconCalendarStats size={14} stroke={1.8} />
                    </ThemeIcon>
                    <Text
                        size="xs"
                        fw={600}
                        c="dimmed"
                        style={{
                            flex: 1,
                            minWidth: 0,
                            fontSize: "calc(var(--mantine-font-size-xs) * 1.1)",
                        }}
                    >
                        Previsão de entrega
                    </Text>
                    <Tooltip
                        label="O embarque conta em dias corridos; a entrega, em dias úteis, sem fins de semana e feriados nacionais. O resultado é apresentado como o total de dias corridos a partir de hoje."
                        position="top"
                        withArrow
                        withinPortal
                        multiline
                        maw={280}
                        events={{ hover: true, focus: true, touch: false }}
                    >
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="xs"
                            style={{ flexShrink: 0 }}
                            aria-label="Como é calculada a previsão de entrega"
                        >
                            <IconExclamationCircle size={15} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
                <Text
                    size={compact ? "sm" : "lg"}
                    fw={700}
                    style={{ fontSize: `calc(var(--mantine-font-size-${compact ? "sm" : "lg"}) * 1.1)` }}
                >
                    {totalDeliveryDays} {totalDeliveryDays === 1 ? "dia corrido" : "dias corridos"}
                </Text>
            </Stack>
        </Paper>
    );

    return (
        <Stack gap="sm">
            <Text
                size="sm"
                fw={700}
                className={layout === "primary" ? classes.primaryTitle : layout === "details" ? classes.detailsTitle : undefined}
            >
                {layout === "primary"
                    ? "Resumo principal"
                    : layout === "details"
                        ? "Detalhamento do cálculo"
                        : "Resumo do cálculo"}
            </Text>
            {layout === "grid" ? (
                <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="sm">
                    {visibleCalculations.map((calculation) => renderCalculation(calculation))}
                    {showTotalDeliveryDays && renderDeliveryEstimate()}
                </SimpleGrid>
            ) : (
                <Stack gap="xs">
                    {displayedCalculations.map((calculation) => renderCalculation(calculation, true))}
                    {layout === "details" && showTotalDeliveryDays && renderDeliveryEstimate(true)}
                </Stack>
            )}
        </Stack>
    )
}

export default Calc;