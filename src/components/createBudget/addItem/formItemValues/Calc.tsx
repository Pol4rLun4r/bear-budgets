// mantine
import { NumberInputProps, Group, NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

// redux
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

// hooks
import useCalcAddItem from "../../../../utils/calcAddItem";

const configInput: NumberInputProps = {
    decimalSeparator: ",",
    thousandSeparator: ".",
    decimalScale: 2,
    fixedDecimalScale: true,
    min: 0.00,

    placeholder: "00,00",
    radius: 'lg',

    readOnly: true,

    variant: "unstyled",
};

const Calc = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.values);

    const { totalWithoutTaxes, ipiValue, totalWithIPIandST } = useCalcAddItem({
        quantity: itemData.quantity,
        unitValue: itemData.unit_price,
        ipi: itemData.ipi,
        st: itemData.st
    })

    return (
        <>
            <Group grow align="flex-end">
                <NumberInput
                    label="Total sem impostos"
                    leftSection={<IconCurrencyReal size={18} />}
                    {...configInput}

                    value={totalWithoutTaxes}
                />
                <NumberInput
                    label="Valor Markup"
                    leftSection={<IconCurrencyReal size={18} />}

                    {...configInput}
                />
                <NumberInput
                    label="Valor IPI"
                    leftSection={<IconCurrencyReal size={18} />}
                    {...configInput}

                    value={ipiValue}
                />
            </Group>
            <Group grow align="flex-end">
                <NumberInput
                    label="Valor Total + IPI + ST"
                    leftSection={<IconCurrencyReal size={18} />}
                    {...configInput}

                    value={totalWithIPIandST}
                />
                <NumberInput
                    label="Total c/ Impostos + MKP"
                    leftSection={<IconCurrencyReal size={18} />}

                    {...configInput}
                />
                <NumberInput
                    label="Valor Unit Final"
                    leftSection={<IconCurrencyReal size={18} />}

                    {...configInput}
                />
            </Group>
        </>
    )
}

export default Calc;