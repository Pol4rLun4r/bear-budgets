import { Combobox, Group, Stack, Text } from "@mantine/core";
import { IconBarcode, IconHash } from "@tabler/icons-react";

interface ItemOptionProps {
    item: ItemReference & { id: number };
}

const ItemOption = ({ item }: ItemOptionProps) => (
    <Combobox.Option value={String(item.id)}>
        <Stack gap={4} style={{ minWidth: 0 }}>
            <Text size="sm" fw={600} truncate="end">
                {item.description}
            </Text>
            <Group justify="space-between" gap="md" wrap="nowrap">
                <Group gap={4} wrap="nowrap" style={{ minWidth: 0 }}>
                    <IconHash size={14} />
                    <Stack gap={0} style={{ minWidth: 0 }}>
                        <Text size="xs" fw={500} c="inherit">Código interno</Text>
                        <Text size="xs" truncate>
                            {item.internal_code || "Não informado"}
                        </Text>
                    </Stack>
                </Group>
                <Group gap={4} wrap="nowrap" justify="flex-end" style={{ minWidth: 0 }}>
                    <IconBarcode size={14} />
                    <Stack gap={0} align="flex-end" style={{ minWidth: 0 }}>
                        <Text size="xs" fw={500} c="inherit">Código do fabricante</Text>
                        <Text size="xs" truncate>
                            {item.manufacturer_code || "Não informado"}
                        </Text>
                    </Stack>
                </Group>
            </Group>
        </Stack>
    </Combobox.Option>
);

export default ItemOption;
