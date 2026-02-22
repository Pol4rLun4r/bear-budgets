import type { UseFormReturnType } from "@mantine/form";

export interface FormDataType {
    form: UseFormReturnType<{
        status: string | null | undefined;
        notes: string | null | undefined;
    }, (values: {
        status: string | null | undefined;
        notes: string | null | undefined;
    }) => {
        status: string | null | undefined;
        notes: string | null | undefined;
    }>
};