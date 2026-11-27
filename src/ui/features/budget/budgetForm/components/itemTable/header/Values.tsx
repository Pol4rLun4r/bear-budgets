import { useEffect } from "react";

// mantine
import { ActionIcon, CopyButton, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";

// icons
import {
    IconCoins,
    IconExclamationCircle,
    IconPercentage,
    IconReceiptTax,
} from "@tabler/icons-react";

// styles
import classes from "./Values.module.css";

// utils
import calcAddItem from "@/utils/calcAddItem";

// redux
import { BudgetFormScope } from "../../../store/@rootReducer";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { setAmount, setTotalValue } from "../../../store/quotationInfo.slice";
import formatNumberForClipboard from "@/utils/formatNumberForClipboard";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const Values = ({ scope }: { scope: BudgetFormScope }) => {
    const dispatch = useAppDispatch();

    const itemTable = useAppSelector((state) => state.budgetForm.itemTable[scope]);

    const calcValues = itemTable.map(item => calcAddItem(item.item_values));

    const totalBudget = calcValues.reduce((sum, value) => sum + value.totalWithAll, 0);
    const totalMarkup = calcValues.reduce((sum, value) => sum + value.markupValue, 0);
    const totalWithTaxes = calcValues.reduce((sum, value) => sum + value.totalWithIPIandST, 0);

    useEffect(() => {
        dispatch(setTotalValue({ scope, data: totalBudget }));
        dispatch(setAmount({ scope, data: itemTable.length }));
    }, [dispatch, itemTable.length, scope, totalBudget]);

    const summaries = [
        {
            label: "Total completo",
            explanation: "Soma do total completo de cada item: impostos, margem, valores extras e frete de compra, menos os descontos aplicados.",
            value: totalBudget,
            icon: IconCoins,
            highlight: true,
        },
        {
            label: "Valor da margem",
            explanation: "Soma dos valores acrescentados pela margem em cada item, calculada sobre o total com impostos.",
            value: totalMarkup,
            icon: IconPercentage,
            prefix: "+",
            highlight: true,
            accent: "margin" as const,
        },
        {
            label: "Total com impostos",
            explanation: "Soma do total sem impostos com IPI e ST de cada item, antes da margem, dos valores extras, do frete de compra e dos descontos.",
            value: totalWithTaxes,
            icon: IconReceiptTax,
        },
    ];

    return (
        <SimpleGrid
            cols={{ base: 1, xs: 3 }}
            spacing="xs"
            className={classes.container}
        >
            {summaries.map(({ label, explanation, value, icon: SummaryIcon, prefix, highlight, accent }) => {
                const clipboardValue = formatNumberForClipboard(value);

                return (
                    <CopyButton key={label} value={clipboardValue ?? ""} timeout={1500}>
                        {({ copied, copy }) => (
                            <Tooltip
                                label={clipboardValue ? (copied ? "Valor copiado" : "Copiar valor") : ""}
                                position="top"
                                withArrow
                                withinPortal
                            >
                                <Paper
                                    withBorder
                                    radius="lg"
                                    p="xs"
                                    className={[
                                        clipboardValue ? classes.copyableCard : undefined,
                                        accent === "margin"
                                            ? classes.marginTotal
                                            : highlight ? classes.totalComplete : undefined,
                                    ].filter(Boolean).join(" ")}
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
                                    <Stack gap={2}>
                                        <Group gap={2} wrap="nowrap" align="center">
                                            <ThemeIcon
                                                size={18}
                                                radius="xl"
                                                variant="light"
                                                color={accent === "margin" ? "green" : highlight ? "violet" : "gray"}
                                            >
                                                <SummaryIcon size={12} stroke={1.8} />
                                            </ThemeIcon>
                                            <Text
                                                size="xs"
                                                fw={600}
                                                c="dimmed"
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    fontSize: "var(--mantine-font-size-xs)",
                                                }}
                                            >
                                                {label}
                                            </Text>
                                            <Tooltip
                                                label={explanation}
                                                position="right"
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
                                                    <IconExclamationCircle size={13} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                        <Text
                                            size="sm"
                                            fw={700}
                                            style={{
                                                overflowWrap: "anywhere",
                                                fontSize: "calc(var(--mantine-font-size-sm) * 1.05)",
                                            }}
                                        >
                                            {prefix ? `${prefix} ${brl.format(value)}` : brl.format(value)}
                                        </Text>
                                    </Stack>
                                </Paper>
                            </Tooltip>
                        )}
                    </CopyButton>
                );
            })}
        </SimpleGrid>
    );
};

export default Values;
