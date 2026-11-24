import { useEffect } from "react";

// mantine
import { ActionIcon, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";

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
            label: "Total do orçamento",
            explanation: "Soma dos valores finais de todos os itens, incluindo impostos, margem, valores extras e frete de compra.",
            value: totalBudget,
            icon: IconCoins,
        },
        {
            label: "Total da margem",
            explanation: "Valor total acrescentado pela margem dos itens do orçamento, calculada sobre o total com impostos de cada item.",
            value: totalMarkup,
            icon: IconPercentage,
            prefix: "+",
        },
        {
            label: "Total com impostos",
            explanation: "Soma dos valores dos itens com IPI e ST, antes da margem, valores extras e frete de compra.",
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
            {summaries.map(({ label, explanation, value, icon: SummaryIcon, prefix }) => (
                <Paper key={label} withBorder radius="lg" p="xs">
                    <Stack gap={2}>
                        <Group gap={2} wrap="nowrap" align="center">
                            <ThemeIcon size={18} radius="xl" variant="light" color="gray">
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
            ))}
        </SimpleGrid>
    );
};

export default Values;
