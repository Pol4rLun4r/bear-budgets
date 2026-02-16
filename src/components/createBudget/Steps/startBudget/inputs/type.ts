import type { UseFormReturnType } from "@mantine/form";

export interface FormDataType {
    form: UseFormReturnType<{
        status: number;
        notes: string;
    }, (values: {
        status: number;
        notes: string;
    }) => {
        status: number;
        notes: string;
    }>
};