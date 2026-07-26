import { Group, NumberInput, NumberInputProps } from "@mantine/core";

// icon
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store.ts";
import { setTotalValue, setAmount } from "../../../../redux/budgetForm/quotationInfoSlice.ts";
import { BudgetFormScope } from "../../../../redux/budgetForm/@rootReducer.ts";

// utils
import calcAddItem from "../../../../utils/calcAddItem.ts";
import { useEffect } from "react";

const Values = ({ scope }: { scope: BudgetFormScope }) => {
    const dispatch = useDispatch<AppDispatch>();

    const listItems = useSelector((state: RootState) => state.budgetForm.listItems[scope]);

    const calcValues = listItems.map(item => {
        const values = item.item_values;

        const calcItem = calcAddItem(values)

        return calcItem;
    });

    const totalBudget = calcValues.reduce((sum, value) => sum + value.totalWithAll, 0);
    const totalMarkup = calcValues.reduce((sum, value) => sum + value.markupValue, 0);

    useEffect(() => {
        dispatch(setTotalValue({ scope, data: totalBudget }));
        dispatch(setAmount({scope, data: listItems.length}));
    }, [dispatch, listItems.length, scope, totalBudget]);

    const configInput: NumberInputProps = {
        decimalSeparator: ",",
        thousandSeparator: ".",
        decimalScale: 2,
        fixedDecimalScale: true,
        min: 0.00,

        placeholder: "00,00",
        radius: 'lg',

        readOnly: true,

        variant: "filled",
    }

    return (
        <Group grow maw={'45%'} miw={350}>
            <NumberInput
                label="Total do orçamento"
                leftSection={<IconCurrencyReal size={18} />}
                {...configInput}

                value={totalBudget}
            />
            <NumberInput
                label="Total do Markup"
                leftSection={<IconCurrencyReal size={18} />}
                {...configInput}

                value={totalMarkup}
            />
        </Group>
    )
}

export default Values;