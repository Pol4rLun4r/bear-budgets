import { UseFormReturnType } from "@mantine/form";
import { ItemReferenceType } from "../../../../../../redux/createBudget/items/addItemSlice";

export interface FormType {
    form: UseFormReturnType<ItemReferenceType, (values: ItemReferenceType) => ItemReferenceType>;
}