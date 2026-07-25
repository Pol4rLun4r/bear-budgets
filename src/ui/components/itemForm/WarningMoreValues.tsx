// mantine
import { Badge } from "@mantine/core";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ItemFormScope } from "../../redux/itemForm/itemFormSlice";

const WarningMoreValues = ({ scope }: { scope: ItemFormScope }) => {
    const switchMode = useSelector((state: RootState) => state.itemForm.switchMode.mode);
    const formStep = useSelector((state: RootState) => state.itemForm.steps[scope].step);
    const itemVersion = useSelector((state: RootState) => state.itemForm.form[scope].item_values);

    if ((!itemVersion.ipi && !itemVersion.st && !itemVersion.extra_value) || formStep === 0 || !switchMode) {
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