// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

const IPI = () => {
    return (
        <NumberInput
            label="IPI"
            placeholder="(opcional)"
            radius='lg'

            leftSection={<IconPercentage size={18} />}

            decimalScale={2}
            decimalSeparator=","
            min={0}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
        />
    )
}

export default IPI