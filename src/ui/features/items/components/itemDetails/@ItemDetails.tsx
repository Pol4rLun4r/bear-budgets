// mantine
import { Group } from "@mantine/core";

// components
import HistoryPrice from "./historyPrice/@HistoryPrice";
import ItemValues from "./itemValues/@ItemValues";

const ItemDetails = () => {
    return (
        <Group grow align="stretch">
            <HistoryPrice />
            <ItemValues />
        </Group>
    )
}

export default ItemDetails;