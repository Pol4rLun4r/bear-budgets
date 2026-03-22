// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

const Markup = () => {
    return (
        <NumberInput
            label="Markup"
            radius='lg'
            placeholder="00"
            withAsterisk

            leftSection={<IconPercentage size={18} />}

            decimalSeparator=","
            min={0}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
        />
    )
}

export default Markup