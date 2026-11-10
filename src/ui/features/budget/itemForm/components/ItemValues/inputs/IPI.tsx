import { useEffect, useRef, useState } from "react";

// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, setValuesField } from "../../../store/itemForm.slice";

const IPI = ({ scope }: { scope: ItemFormScope }) => {
    const ipi = useAppSelector((state) => state.itemForm.form[scope].item_values.ipi);
    const dispatch = useAppDispatch();
    const [inputValue, setInputValue] = useState(ipi?.toString().replace(".", ",") ?? "");
    const lastDispatchedValue = useRef<number | undefined>(ipi);

    useEffect(() => {
        if (ipi === lastDispatchedValue.current) return;

        lastDispatchedValue.current = ipi;
        setInputValue(ipi?.toString().replace(".", ",") ?? "");
    }, [ipi]);

    const handleChange = (value: string | number) => {
        const text = String(value);
        setInputValue(text);

        const normalized = text.replace(",", ".");
        const parsedValue = normalized === "" ? undefined : Number(normalized);
        const nextValue = parsedValue !== undefined && Number.isFinite(parsedValue)
            ? parsedValue
            : undefined;

        lastDispatchedValue.current = nextValue;
        dispatch(setValuesField({
            scope,
            key: "ipi",
            value: nextValue,
        }));
    };

    return (
        <NumberInput
            label="IPI"
            placeholder="(opcional)"
            radius='lg'

            leftSection={<IconPercentage size={18} />}

            decimalScale={2}
            decimalSeparator=","
            min={0}

            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // configurações do valor do input
            value={inputValue}
            onChange={handleChange}
        />
    )
}

export default IPI