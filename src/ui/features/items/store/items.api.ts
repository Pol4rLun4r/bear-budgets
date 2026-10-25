import { api } from "@/app/api";

export const itemsApi = api.injectEndpoints({
    endpoints: (build) => ({
        findItemReferences: build.query<ItemReference[] | undefined, SearchItemDescriptionIsOptional>({
            async queryFn(query) {
                const result = await window.api.item.findItemReferences(query);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
        }),
        getItemDetailsByReferenceId: build.query<ItemDetails | undefined, GetByReferenceId>({
            async queryFn(itemReferenceId) {
                const result = await window.api.item.getDetailsByReferenceId(itemReferenceId);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
        }),
        getAllItemValuesByReferenceId: build.query<ItemValues[] | undefined, GetByReferenceId>({
            async queryFn(itemReferenceId) {
                const result = await window.api.item.getAllValuesByReferenceId(itemReferenceId);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
        }),
        getItemValuesById: build.query<ItemValues, ItemValues["id"]>({
            async queryFn(itemValuesId) {
                const result = await window.api.item.getValuesById(itemValuesId);

                if (!result.success) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: result.data,
                            code: result.code,
                        },
                    };
                }

                return { data: result.data };
            },
        }),
    }),
});

export const {
    useFindItemReferencesQuery,
    useLazyGetItemDetailsByReferenceIdQuery,
    useGetAllItemValuesByReferenceIdQuery,
    useLazyGetItemValuesByIdQuery,
} = itemsApi;
