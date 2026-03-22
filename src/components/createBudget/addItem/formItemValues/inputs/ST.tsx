// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal } from "@tabler/icons-react";

const ST = () => {
    return (
        <NumberInput
            label="ST"
            placeholder="(opcional)"
            radius='lg'

            leftSection={<IconCurrencyReal size={18} />}

            decimalSeparator=","
            thousandSeparator="."
            decimalScale={2}
            fixedDecimalScale
            min={0.00}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
        />
    )
}

export default ST