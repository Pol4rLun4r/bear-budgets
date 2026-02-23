// react
import { useState, useRef, useEffect } from "react";

// mantine
import { TextInput, Combobox, useCombobox } from "@mantine/core"

// types
import { ItemReferenceType } from "../../../../../../../types/item";
import { FormType } from "./type";

// redux
import { AppDispatch, RootState } from "../../../../../../redux/store";
import { useDispatch } from "react-redux";
import { setDescription } from "../../../../../../redux/createBudget/items/addItemSlice";
import { setItemBasicData, resetAddItemData, resetItemDataButNotDescription, setNotes } from "../../../../../../redux/createBudget/items/addItemSlice";

// api
import itemService from "../../../../../../services/item-api";
import { useSelector } from 'react-redux';

const Description = ({ form }: FormType) => {
    const dispatch = useDispatch<AppDispatch>();
    const description = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData.description);

    const [suggestions, setSuggestions] = useState<ItemReferenceType[]>([]);
    const fetchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const DEBOUNCE_MS = 300;

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const fetchSuggestions = async (search: string) => {
        if (!search.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await itemService.searchItem(search);
            const items = response.data;

            setSuggestions(Array.isArray(items) ? items : []);
        } catch (error) {
            console.log(error);
            setSuggestions([]);
        }
    }

    useEffect(() => {
        return () => {
            if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
        };
    }, []);

    // lida com a mudança no input de pesquisa
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        
        const value = event.currentTarget.value;

        if (!value.trim()) {
            if (fetchDebounceRef.current) {
                clearTimeout(fetchDebounceRef.current);
                fetchDebounceRef.current = null;
            }
            setSuggestions([]);
            dispatch(resetAddItemData());
            return;
        }

        if (fetchDebounceRef.current) {
            clearTimeout(fetchDebounceRef.current);
        }
        fetchDebounceRef.current = setTimeout(() => {
            fetchDebounceRef.current = null;
            fetchSuggestions(value);
        }, DEBOUNCE_MS);

        combobox.updateSelectedOptionIndex(); // atualiza a lista de opções do input
        combobox.openDropdown(); // abre o dropdown ao digitar e atualiza as opções
        
        dispatch(setDescription(value));
        dispatch(resetItemDataButNotDescription()); // limpa os dados do item, mas mantém a descrição para não perder o que o usuário digitou
    }

    // lida com o item selecionado (clicado ou pressionado Enter)
    const handleOptionSubmit = async (optionValue: string) => {
        const item = suggestions.find((s) => s.id === optionValue as unknown as number);

        if (item) {
            dispatch(setItemBasicData(item));
        }

        const notes = await itemService.getNotes(item?.id!);

        dispatch(setNotes(notes.data));

        combobox.closeDropdown();
    }

    const options = suggestions.map((item) => (
        <Combobox.Option key={item.id} value={item.id as unknown as string}>
            {item.description}
        </Combobox.Option>
    ));

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={handleOptionSubmit}
        >
            {/* target do input de pesquisa */}
            <Combobox.Target>
                <TextInput
                    {...form.getInputProps('description')}
                    radius="lg"
                    label="Descrição do item"
                    description="Busque por itens já cadastrados ou adicione um novo"
                    placeholder="Digite a descrição do item"
                    withAsterisk
                    value={description}
                    onChange={handleChange}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    onClick={() => combobox.openDropdown()}
                />
            </Combobox.Target>

            {/* menu de opções */}
            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length === 0 ? (
                        <Combobox.Empty>Nenhum resultado</Combobox.Empty>
                    ) : (
                        options
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}

export default Description;