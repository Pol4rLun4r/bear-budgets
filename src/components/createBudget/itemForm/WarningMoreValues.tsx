// mantine
import { Badge } from "@mantine/core";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ItemFormScope } from "../../../redux/createBudget/items/itemFormSlice";

const WarningMoreValues = ({ scope }: { scope: ItemFormScope }) => {
    const switchMode = useSelector((state: RootState) => state.createBudget.itemFormSwitchMode.mode);
    const formStep = useSelector((state: RootState) => state.createBudget.itemFormSteps[scope].step);
    const itemValues = useSelector((state: RootState) => state.createBudget.itemForm[scope].values);

    if ((!itemValues.ipi && !itemValues.st && !itemValues.purchase_shipping) || formStep === 0 || !switchMode) {
        return;
    }

    return (
        <Badge
            size="lg"
            color="red"

            pos={"absolute"}
            top={"calc(var(--mantine-spacing-lg) * 0.3) "}
            style={{ zIndex: "9999", alignSelf: "center" }}
        >
            Há valores importantes ocultados!
        </Badge>
    )
}

export default WarningMoreValues;