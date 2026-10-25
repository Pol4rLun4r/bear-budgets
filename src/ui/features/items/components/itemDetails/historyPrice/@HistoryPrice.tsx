// mantine
import { Paper, Stack, Title, Text, Group, Skeleton } from "@mantine/core"

// components
import Table from "./table/@Table";
import Cards from "./Cards";

// redux
import { useAppSelector } from "@/app/reduxHooks";
import { selectLatestPriceFormatted } from "@/features/items/store/items.selectors";

// icons
import { IconHistory } from "@tabler/icons-react";

const HistoryPrice = () => {
    const { itemWithReferenceLinks, records } = useAppSelector((state) => state.items.itemDetails);
    const latestPriceFormatted = useAppSelector(selectLatestPriceFormatted);
    const description = itemWithReferenceLinks?.description;

    return (
        <Paper withBorder p={"md"} radius={"lg"} bg="var(--mantine-color-body)">
            <Stack>
                <Stack>
                    <Group>
                        <IconHistory />
                        <Title order={3}>Histórico de preços</Title>
                    </Group>
                    <Skeleton visible={description === undefined} height={"0.9rem"} radius="xl">
                        <Text size="0.9rem" c="dimmed" truncate="end">{description}</Text>
                    </Skeleton>
                </Stack>

                <Cards
                    data={[
                        {
                            title: "Preço mais recente",
                            value: latestPriceFormatted,
                            loading: itemWithReferenceLinks === undefined,
                        },
                        {
                            title: "Registros",
                            value: records,
                            loading: records === undefined,
                        },
                    ]}
                />
                <Table itemReferenceId={itemWithReferenceLinks?.id} />
                <Text size="sm" c="dimmed">Exibindo os últimos 5 registros</Text>
            </Stack>
        </Paper>
    )
}

export default HistoryPrice