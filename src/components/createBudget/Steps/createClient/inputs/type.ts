// types
import { UseFormReturnType } from "@mantine/form";
import { TypeClientCategory } from "../../../../../../types/client";

export interface FormDataType {
    form: UseFormReturnType<{
        name?: string | undefined;
        document?: string | undefined;
        type_client?: TypeClientCategory | undefined;
        notes?: string | null | undefined;
    }, (values: {
        name?: string | undefined;
        document?: string | undefined;
        type_client?: TypeClientCategory | undefined;
        notes?: string | null | undefined;
    }) => {
        name?: string | undefined;
        document?: string | undefined;
        type_client?: TypeClientCategory | undefined;
        notes?: string | null | undefined;
    }>;
};