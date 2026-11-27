// mantine
import { Select, Text, Tooltip } from "@mantine/core";
import { useMemo, useState } from "react";

// icons
import { IconPercentage } from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { convertMarkupValue, getMarkupOptions } from "@/utils/markupList";
import useCustomMargins from "@/hooks/useCustomMargins";
import { ItemFormScope, setValuesField } from "../../../store/itemForm.slice";

const Markup = ({ scope }: { scope: ItemFormScope }) => {
    const markup = useAppSelector((state) => state.itemForm.form[scope].item_values.markup);
    const dispatch = useAppDispatch();
    const customMargins = useCustomMargins();
    const [search, setSearch] = useState("");
    const selectedMarkup = customMargins.some(
        (margin) => `${margin.percentage}.${margin.id}` === markup,
    )
        ? markup
        : String(convertMarkupValue(markup));
    const markupOptions = useMemo(
        () => getMarkupOptions(customMargins, search, selectedMarkup),
        [customMargins, search, selectedMarkup],
    );

    return (
        <Select
            w="40%"
            label="Markup"
            radius="lg"
            placeholder="00"
            withAsterisk
            leftSection={<IconPercentage size={18} />}
            searchable
            clearable
            selectFirstOptionOnChange
            selectFirstOptionOnDropdownOpen
            searchValue={search}
            onSearchChange={setSearch}
            onDropdownClose={() => setSearch("")}
            maxDropdownHeight={360}
            data={markupOptions}
            renderOption={({ option }) => (
                <Tooltip label={option.label} withArrow withinPortal>
                    <Text size="sm" truncate>{option.label}</Text>
                </Tooltip>
            )}
            styles={{ input: { textOverflow: "ellipsis" } }}
            value={selectedMarkup}
            onChange={(value) => {
                dispatch(setValuesField({ scope, key: "markup", value: value ?? "" }));
                setSearch("");
            }}
        />
    )
}

export default Markup