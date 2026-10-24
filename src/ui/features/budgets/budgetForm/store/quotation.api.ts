import { api } from "@/app/api";

export const quotationApi = api.injectEndpoints({
    endpoints: (build) => ({
        getQuotationSummaries: build.query<Quotation[] | undefined, void>({
            async queryFn() {
                const result = await window.api.quotation.getAllSummary();

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
            providesTags: ["QuotationSummary"],
        }),
        getFullQuotation: build.query<QuotationFull | undefined, Quotation["id"]>({
            async queryFn(quotationId) {
                const result = await window.api.quotation.getFull(quotationId);

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
            providesTags: (_result, _error, quotationId) => [
                { type: "QuotationFull", id: quotationId },
            ],
        }),
        createQuotation: build.mutation<QuotationLink[] | undefined, CreateQuotation>({
            async queryFn(quotation) {
                const result = await window.api.quotation.create(quotation);

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
            invalidatesTags: ["QuotationSummary", "QuotationFull"],
        }),
        updateQuotation: build.mutation<QuotationFull | undefined, UpdateQuotation>({
            async queryFn(quotation) {
                const result = await window.api.quotation.update(quotation);

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
            invalidatesTags: (_result, _error, { quotation }) => [
                "QuotationSummary",
                { type: "QuotationFull", id: quotation.id },
            ],
        }),
    }),
});
