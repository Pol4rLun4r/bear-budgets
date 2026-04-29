import { Group, NumberInput, NumberInputProps } from "@mantine/core";

// icon
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

// utils
import calcAddItem from "../../../utils/calcAddItem";

const Values = () => {
    const listItems = useSelector((state: RootState) => state.createBudget.listItems);

    const calcValues = listItems.map(item => {
        const values = item.values;

        const calcItem = calcAddItem(values)
        
        return calcItem;
    })

    const totalBudget = calcValues.reduce((sum, value) => sum + value.totalWithAll, 0);
    const totalMarkup = calcValues.reduce((sum, value) => sum + value.markupValue, 0);


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