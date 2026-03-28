import { Group, NumberInput, NumberInputProps } from "@mantine/core";

// icon
import { IconCurrencyReal } from "@tabler/icons-react";

const Values = () => {
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
            />
            <NumberInput
                label="Total do Markup"
                leftSection={<IconCurrencyReal size={18} />}

                {...configInput}
            />
        </Group>
    )
}

export default Values;