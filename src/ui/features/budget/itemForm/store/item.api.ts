import { api } from "@/app/api";

export const itemReference = api.injectEndpoints({
    endpoints: (build) => ({
        searchItemDescription: build.query<ItemReference[] | undefined, SearchItemReferenceQuery>({
            async queryFn(query) {
                const normalizedQuery = typeof query === "string"
                    ? query.trim()
                    : {
                        description: query.description?.trim(),
                        internal_code: query.internal_code?.trim(),
                        manufacturer_code: query.manufacturer_code?.trim(),
                    };
                const result = await window.api.item.searchDescription(normalizedQuery);

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
            }
        }),
        getReferenceLinks: build.query<ReferenceLink[] | undefined, GetReferenceLinks>({
            async queryFn(itemReferenceId) {
                const result = await window.api.item.getReferenceLinks(itemReferenceId);

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
    })
});

export const {
    useSearchItemDescriptionQuery,
    useLazySearchItemDescriptionQuery,
    useLazyGetReferenceLinksQuery,
} = itemReference;