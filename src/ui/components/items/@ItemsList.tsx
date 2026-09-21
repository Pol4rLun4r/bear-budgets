// components
import List from "./list/@List";

// react-query
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";

// api
import services from "../../services/index";

// redux
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const ItemsList = () => {
    const search = useSelector((state: RootState) => state.items.search);
    const [debouncedSearch] = useDebouncedValue(search ?? "", 250);

    const { data = [], isPending } = useQuery({
        queryKey: ["itemsData", debouncedSearch.trim()],
        queryFn: async () => {
            const result = await services.item.findItemReferences(
                debouncedSearch
            );

            return result.success && result.data ? result.data : [];
        },
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });

    if (isPending) return "Carregando...";

    return data.length <= 0
        ? <div>Sem items</div>
        : <List items={data} />;
};

export default ItemsList;