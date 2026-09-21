// mantine
import { Stack } from "@mantine/core";

// components
import SearchForm from "../../components/items/searchForm/@SearchForm.tsx";
import ItemsList from "../../components/items/@ItemsList.tsx";

const Items = () => {
    return (
        <Stack w={"100%"} h={"100%"}>
            <SearchForm />
            <ItemsList />
        </Stack>
    )
}

export default Items;