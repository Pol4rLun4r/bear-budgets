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
    }),
});

export const { useFindItemReferencesQuery } = itemsApi;
