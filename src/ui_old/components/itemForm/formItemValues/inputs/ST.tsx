// mantine
import { ActionIcon, Group, Tooltip } from "@mantine/core";

// components
import CurrencyInput from "./CurrencyInput";

// utils
import { ItemFormScope } from "../../../../redux/itemForm/itemFormSlice";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { switchStMode } from "../../../../redux/itemForm/itemFormSlice";

// Icons
import { IconSwitchHorizontal } from "@tabler/icons-react";

const ST = ({ scope }: { scope: ItemFormScope }) => {
    const form = useSelector((state: RootState) => state.itemForm.form[scope]);
    const toggleStMode = form.toggleStMode;

    const dispatch = useDispatch<AppDispatch>();

    return (
        <Group gap={0} style={{ alignItems: "flex-end" }}>
            <CurrencyInput
                itemValuesInput="st"
                label={toggleStMode ? "ST em porcentagem" : "ST"}
                placeholder="(opcional)"
                scope={scope}
                widthInput={138}
                stPercentageMode={true}
                toggleStMode={toggleStMode}
            />
            <Tooltip
                label="Trocar modo do ST (Real $ ou Porcentagem %)"
                openDelay={1000}
            >
                <ActionIcon
                    size={36}
                    radius="lg"
                    variant="default"

                    onClick={() => dispatch(switchStMode({ scope }))}

                    style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                    }}
                >

                    <IconSwitchHorizontal />
                </ActionIcon>
            </Tooltip>
        </Group >
    )
}

export default ST;