// react
import { useState } from "react";

// mantine
import { TextInput, Combobox, useCombobox } from "@mantine/core"

// types
import { ItemReferenceType } from "../../../../../../../types/item";

// api
import itemService from "../../../../../../services/item-api";

const Description = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<ItemReferenceType[]>([]);

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

    // lida com a mudança no input de pesquisa
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        const value = event.currentTarget.value;

        setQuery(value);
        fetchSuggestions(value);
        combobox.updateSelectedOptionIndex(); // atualiza a lista de opções do input
        combobox.openDropdown(); // abre o dropdown ao digitar e atualiza as opções
    }

    // lida com o item selecionado (clicado ou pressionado Enter)
    const handleOptionSubmit = (optionValue: string) => {
        const item = suggestions.find((s) => s.id === optionValue as unknown as number);

        if(item) {
            setQuery(item.description);
        }
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
                    radius="lg"
                    label="Descrição do item"
                    description="Busque por itens já cadastrados ou adicione um novo"
                    placeholder="Digite a descrição do item"
                    withAsterisk
                    value={query}
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