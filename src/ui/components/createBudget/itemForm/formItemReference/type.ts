import { UseFormReturnType } from "@mantine/form";
import { ItemReferenceType } from "../../../../redux/createBudget/items/itemFormSlice";

export interface FormType {
    form: UseFormReturnType<ItemReferenceType, (values: ItemReferenceType) => ItemReferenceType>;
}

export type InputFormType = UseFormReturnType<ItemReferenceType, (values: ItemReferenceType) => ItemReferenceType>;
