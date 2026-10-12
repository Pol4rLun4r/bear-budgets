// mantine
import { Stack } from "@mantine/core";

// components
import SearchForm from "../components/items/searchForm/@SearchForm.tsx";
import Items from "../components/items/@Items.tsx";

const ItemsPage = () => {
    return (
        <Stack w={"100%"} h={"100%"}>
            <SearchForm />
            <Items />
        </Stack>
    )
}

export default ItemsPage;