// mantine
import { Divider, Group, NumberInput, Stack, Title } from "@mantine/core";

// icons
import { IconCurrencyReal, IconPercentage } from "@tabler/icons-react";

const FormItemValues = () => {
    return (
        <Stack gap="md">
            <Group grow>
                <NumberInput
                    label="Valor unitário"
                    placeholder="100"
                    withAsterisk
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
                <NumberInput
                    label="Quantidade"
                    placeholder="10"
                    withAsterisk
                    radius='lg'

                    defaultValue={1}
                    min={1}

                    stepHoldDelay={500}
                    stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                />
            </Group>
            <Group grow justify="center" align="flex-end">
                <NumberInput
                    label="IPI (opcional)"
                    placeholder="10,5"
                    description="Alíquota do IPI para o item (em %)"
                    radius='lg'

                    leftSection={<IconPercentage size={18} />}

                    decimalSeparator=","
                    min={0}

                    stepHoldDelay={500}
                    stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                />
                <NumberInput
                    label="ST (opcional)"
                    placeholder="10,5"
                    description="Substituição Tributária para o item (em R$)"
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
            </Group>
            <Group grow justify="center" align="flex-end">
                <NumberInput
                    label="Markup"
                    radius='lg'
                    placeholder="20"
                    withAsterisk
                    description="Markup para o item (em %)"

                    leftSection={<IconPercentage size={18} />}

                    decimalSeparator=","
                    min={0}

                    stepHoldDelay={500}
                    stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                />
                <NumberInput
                    label="Frete de compra (opcional)"
                    description="Valor do frete para o item (em R$)"
                    placeholder="50"
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
            </Group>
            <Divider />
            <Title order={5} >Calculo</Title>
        </Stack>
    )
}

export default FormItemValues;