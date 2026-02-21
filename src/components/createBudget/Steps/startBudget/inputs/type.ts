import type { UseFormReturnType } from "@mantine/form";

export interface FormDataType {
    form: UseFormReturnType<{
        status: string;
        notes: string;
    }, (values: {
        status: string;
        notes: string;
    }) => {
        status: string;
        notes: string;
    }>
};