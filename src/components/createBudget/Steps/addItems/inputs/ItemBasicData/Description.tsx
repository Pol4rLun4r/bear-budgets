// react
import { useState, useRef, useEffect } from "react";

// mantine
import { TextInput, Combobox, useCombobox, Text, UnstyledButton } from "@mantine/core"
import { Loader } from "@mantine/core";

// style 
import classes from '../../AddItems.module.css'

// types
import { ItemReferenceType } from "../../../../../../../types/item";
import { FormType } from "./type";

// redux
import { AppDispatch, RootState } from "../../../../../../redux/store";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { setDescription } from "../../../../../../redux/createBudget/items/addItemSlice";
import { setItemBasicData, resetAddItemData, setNotes } from "../../../../../../redux/createBudget/items/addItemSlice";

// api
import itemService from "../../../../../../services/item-api";

const Description = ({ form }: FormType) => {
    const [isLoader, setIsLoader] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const description = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData.description);
    const isHasId = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData.id);

    const [suggestions, setSuggestions] = useState<ItemReferenceType[]>([]);

    const fetchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const DEBOUNCE_MS = 500;

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
            setIsLoader(false);
            if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
        };
    }, []);

    const handleClearData = () => {
        dispatch(resetAddItemData());
        setSuggestions([]);
        setIsLoader(false);
    }

    // lida com a mudança no input de pesquisa
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault(); // previne o comportamento padrão do input

        const value = event.currentTarget.value; // valor digitado no input

        // se o valor estiver vazio, limpa as sugestões e reseta os dados do item
        if (!value.trim()) {
            if (fetchDebounceRef.current) {
                clearTimeout(fetchDebounceRef.current);
                fetchDebounceRef.current = null;
            }

            setIsLoader(false);
            setSuggestions([]);
            return;
        }

        // debounce para evitar muitas requisições enquanto o usuário digita
        if (fetchDebounceRef.current) {
            setIsLoader(true);
            clearTimeout(fetchDebounceRef.current);
        }

        // agenda a busca após o tempo de debounce
        fetchDebounceRef.current = setTimeout(() => {
            setIsLoader(false);
            fetchDebounceRef.current = null;
            fetchSuggestions(value);
        }, DEBOUNCE_MS);

        combobox.updateSelectedOptionIndex(); // atualiza a lista de opções do input
        combobox.openDropdown(); // abre o dropdown ao digitar e atualiza as opções

        dispatch(setDescription(value));
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
                <div style={{ position: 'relative' }}>
                    <UnstyledButton style={{ position: 'absolute', right: 0, bottom: 40 }} onClick={() => handleClearData()} >
                        <Text c={'violet'}>Limpar dados</Text>
                    </UnstyledButton>
                    <TextInput
                        {...form.getInputProps('description')}
                        radius="lg"
                        label="Descrição do item"
                        description="Busque por itens já cadastrados ou adicione um novo"
                        placeholder="Digite a descrição do item"
                        rightSection={isLoader ? <Loader size="xs" /> : null}
                        withAsterisk
                        value={description}
                        onChange={handleChange}
                        disabled={isHasId ? true : false} // desabilita o input se um item já foi selecionado
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => combobox.closeDropdown()}
                        onClick={() => combobox.openDropdown()}
                        className={classes.input}
                    />
                </div>
            </Combobox.Target>

            {/* menu de opções */}
            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length === 0 && !isLoader ? (
                        <Combobox.Empty>Nenhum resultado</Combobox.Empty>
                    ) : isLoader ? (
                        <Combobox.Empty>Carregando...</Combobox.Empty>
                    ) : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}

export default Description;