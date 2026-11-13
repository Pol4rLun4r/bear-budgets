// react
import { useEffect } from "react";

// mantine
import { Combobox, useCombobox } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import {
    resetItemReference,
    setItemReference,
    setReferenceField,
    setReferenceLinks,
    type ItemFormScope,
} from "@/features/budget/itemForm/store/itemForm.slice";
import { getItemFormState } from "@/features/budget/itemForm/store/itemForm.selectors";

// api
import {
    useLazyGetReferenceLinksQuery,
    useLazySearchItemDescriptionQuery,
} from "@/features/budget/itemForm/store/item.api";

// components
import Input from "./Input";
import ItemOption from "./ItemOption";

interface DescriptionProps {
    scope?: ItemFormScope;
}

const Description = ({ scope = "item_form_add" }: DescriptionProps) => {
    const dispatch = useAppDispatch();
    const { item_reference } = useAppSelector((state) => getItemFormState(state, scope));
    const description = item_reference.description ?? "";
    const internalCode = item_reference.internal_code ?? "";
    const manufacturerCode = item_reference.manufacturer_code ?? "";

    const [
        searchItemDescription,
        { currentData, isFetching, error: searchError, reset: resetSearch },
    ] = useLazySearchItemDescriptionQuery();

    const [
        getReferenceLinks,
        { error: linksError, reset: resetReferenceLinks },
    ] = useLazyGetReferenceLinksQuery();

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    useEffect(() => {
        if (!searchError) return;

        const message = "error" in searchError
            ? searchError.error
            : "Não foi possível pesquisar pela descrição.";

        notifications.show({
            title: "Erro ao pesquisar pela descrição",
            message,
            position: "bottom-right",
            color: "pink",
        });
    }, [searchError]);

    useEffect(() => {
        if (!linksError) return;

        const message = "error" in linksError
            ? linksError.error
            : "Não foi possível buscar as notas do item.";

        notifications.show({
            title: "Erro ao buscar notas",
            message,
            position: "bottom-right",
            color: "pink",
        });
    }, [linksError]);

    const suggestions = currentData ?? [];
    
    const options = suggestions
        .filter((item): item is ItemReference & { id: number } => item.id != null)
        .map((item) => <ItemOption key={item.id} item={item} />);

    useEffect(() => {
        if (!isFetching && options.length > 0) {
            combobox.selectFirstOption();
        }
    }, [isFetching, options.length, combobox]);

    useEffect(() => {
        const query: SearchItemReferenceQuery = {
            description: description.trim(),
            internal_code: internalCode.trim(),
            manufacturer_code: manufacturerCode.trim(),
        };
        const hasSearchTerm = Object.values(query).some(Boolean);

        resetSearch();

        if (item_reference.id || !hasSearchTerm) return;

        void searchItemDescription(query);
    }, [
        description,
        internalCode,
        item_reference.id,
        manufacturerCode,
        resetSearch,
        searchItemDescription,
    ]);

    useEffect(() => {
        const hasSearchTerm = Boolean(
            description.trim() || internalCode.trim() || manufacturerCode.trim(),
        );

        if (item_reference.id || !hasSearchTerm) {
            combobox.closeDropdown();
        } else {
            combobox.openDropdown();
        }
    }, [combobox, description, internalCode, item_reference.id, manufacturerCode]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;

        dispatch(setReferenceField({ scope, key: "description", value }));

        if (!value.trim()) {
            combobox.closeDropdown();
            return;
        }

        combobox.updateSelectedOptionIndex();
        combobox.openDropdown();
    };

    const handleClearData = () => {
        dispatch(resetItemReference(scope));
        resetSearch();
        resetReferenceLinks();
        combobox.closeDropdown();
    };

    const handleOptionSubmit = async (optionValue: string) => {
        const item = suggestions.find(
            (suggestion) => String(suggestion.id) === optionValue,
        );

        if (!item?.id) return;

        dispatch(setItemReference({ scope, data: item }));
        resetSearch();
        combobox.closeDropdown();

        const result = await getReferenceLinks(item.id);
        if (!result.error) {
            dispatch(setReferenceLinks({ scope, links: result.data ?? [] }));
        }
    };

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={handleOptionSubmit}
            position="top-start"
            floatingHeight="viewport"
        >
            <Input
                scope={scope}
                isLoader={isFetching}
                options={options}
                combobox={combobox}
                handleChange={handleChange}
                handleClearData={handleClearData}
            />
        </Combobox>
    );
}

export default Description;