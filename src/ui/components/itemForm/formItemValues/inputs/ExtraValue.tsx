// components
import CurrencyInput from "./CurrencyInput";

// utils
import { ItemFormScope } from "../../../../redux/itemForm/itemFormSlice";

const ExtraValue = ({ scope }: { scope: ItemFormScope }) => {
    return (
        <CurrencyInput
            itemVersionInput="extra_value"
            label="Valor extra"
            placeholder="00"
            scope={scope}
        />
    )
}

export default ExtraValue
