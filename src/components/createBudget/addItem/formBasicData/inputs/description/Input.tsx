// type
import type { JSX } from "react";

// mantine
import { Combobox, Tooltip, UnstyledButton, Text, TextInput, ComboboxStore } from "@mantine/core"

// components
import ClearDescription from "../../ClearDescription";

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { InputFormType } from "../../type";

interface InputType {
    isLoader: boolean;
    options: JSX.Element[];
    combobox: ComboboxStore;
    form: InputFormType
    handleClearData: () => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ isLoader, options, combobox, handleChange, handleClearData, form }: InputType) => {
    const description = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData.description);
    const isHasId = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData.id);
    return (
        <>
            <Combobox.Target>
                <div style={{ position: 'relative' }}>
                    <UnstyledButton style={{ position: 'absolute', right: 0, bottom: 40 }} onClick={() => handleClearData()} >
                        <Text c={'violet'}>Limpar dados</Text>
                    </UnstyledButton>
                    <Tooltip
                        disabled={description.length !== 0 ? false : true}
                        label={description}
                        multiline
                        w={400}
                        offset={{ mainAxis: 16, crossAxis: -75 }}
                    >
                        <TextInput
                            {...form.getInputProps('description')}
                            radius="lg"
                            label="Descrição do item"
                            description="Busque por itens já cadastrados ou adicione um novo"
                            placeholder="Digite a descrição do item"
                            rightSection={description.length !== 0 ? <ClearDescription /> : undefined}
                            withAsterisk
                            value={description}
                            onChange={handleChange}
                            readOnly={isHasId ? true : false} // desabilita o input se um item já foi selecionado
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => combobox.closeDropdown()}
                            onClick={() => combobox.openDropdown()}
                        />
                    </Tooltip>
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
        </>
    )
}

export default Input;