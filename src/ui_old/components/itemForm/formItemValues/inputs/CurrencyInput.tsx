import { useState, type ClipboardEvent } from "react";

// mantine
import { NumberInput } from "@mantine/core";

// icons
import { IconCurrencyReal, IconPercentage } from "@tabler/icons-react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";

// utils
import { ItemFormScope, setValuesField } from "../../../../redux/itemForm/itemFormSlice";
import {
    normalizeBrazilianCurrency,
    convertToNumber,
} from "../../../../utils/formatBrazilPrice";

type CurrencyInputs = Pick<ItemValues, 'purchase_shipping' | 'st' | 'unit_price' | 'extra_value'>

type Inputs = keyof CurrencyInputs

interface CurrencyInputProps {
    // config
    scope: ItemFormScope;
    itemValuesInput: Inputs;

    // custom
    label: string;
    placeholder?: string;
    widthInput?: string | number;
    withAsterisk?: boolean;
    stPercentageMode?: boolean;
    toggleStMode?: boolean;
}

const CurrencyInput = ({ scope, itemValuesInput, label, placeholder, widthInput, withAsterisk, stPercentageMode, toggleStMode }: CurrencyInputProps) => {
    const itemValues = useSelector((state: RootState) => state.itemForm.form[scope].item_values);

    const dispatch = useDispatch<AppDispatch>();
    const [focused, setFocused] = useState(false);

    const setCurrencyValue = <K extends keyof CurrencyInputs>(
        key: K,
        value: CurrencyInputs[K]
    ) => {
        dispatch(
            setValuesField({ scope, key, value })
        );
    }

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const text = event.clipboardData.getData("text");
        event.preventDefault();
        setCurrencyValue(itemValuesInput, normalizeBrazilianCurrency(text));
    };

    return (
        <NumberInput
            // customização
            label={label}
            placeholder={placeholder}
            withAsterisk={withAsterisk}
            w={widthInput}

            // design do input
            radius='lg'
            leftSection={!toggleStMode ? <IconCurrencyReal size={18} /> : <IconPercentage size={18} />}
            decimalSeparator=","
            thousandSeparator={focused ? false : stPercentageMode ? false : "."}
            decimalScale={2}
            min={0.00}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}

            // tratamento de valores
            value={itemValues[itemValuesInput] ?? ""}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onPaste={handlePaste}
            onChange={(value) => setCurrencyValue(itemValuesInput, convertToNumber(value))}

            styles={{
                input: {
                    borderTopRightRadius: stPercentageMode ? 0 : '',
                    borderBottomRightRadius: stPercentageMode ? 0 : '',
                }
            }}
        />
    )
}

export default CurrencyInput