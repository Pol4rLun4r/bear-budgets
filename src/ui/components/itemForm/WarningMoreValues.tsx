// mantine
import { Badge } from "@mantine/core";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ItemFormScope } from "../../redux/itemForm/itemFormSlice";

interface WarningMoreValuesProps {
    scope: ItemFormScope;
}

const WarningMoreValues = ({ scope }: WarningMoreValuesProps) => {
    const switchModeValue = useSelector((state: RootState) => state.itemForm.switch['item_values'].mode);
    const formStep = useSelector((state: RootState) => state.itemForm.steps[scope].step);
    const itemVersion = useSelector((state: RootState) => state.itemForm.form[scope].item_values);

    if ((!itemVersion.ipi && !itemVersion.st && !itemVersion.extra_value) || formStep === 0 || !switchModeValue) {
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