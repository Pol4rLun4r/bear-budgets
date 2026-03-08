import { Group, NumberInput } from "@mantine/core";

// icon
import { IconCurrencyReal } from "@tabler/icons-react";

const Values = () => {
    return (
        <Group>
            <NumberInput
                variant="unstyled"
                readOnly
                label="Valor Total do orçamento"
                placeholder="00"
                radius='lg'

                leftSection={<IconCurrencyReal size={18} />}

                decimalSeparator=","
                thousandSeparator="."
                decimalScale={2}
                fixedDecimalScale
                min={0.00}
            />
            <NumberInput
                variant="unstyled"
                readOnly
                label="Valor total do Markup"
                placeholder="00"
                radius='lg'

                leftSection={<IconCurrencyReal size={18} />}

                decimalSeparator=","
                thousandSeparator="."
                decimalScale={2}
                fixedDecimalScale
                min={0.00}
            />
        </Group>
    )
}

export default Values;