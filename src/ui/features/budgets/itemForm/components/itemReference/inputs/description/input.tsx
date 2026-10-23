// type
import type { JSX } from "react";
import type { ItemFormScope } from "@/features/budgets/itemForm/store/itemForm.slice";

// mantine
import { Combobox, Tooltip, UnstyledButton, Text, TextInput, ComboboxStore } from "@mantine/core"

// components
// import ClearDescription from "../../ClearDescription";

// redux
import { getItemFormState } from "@/features/budgets/itemForm/store/itemForm.selectors";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { setReferenceField } from "@/features/budgets/itemForm/store/itemForm.slice";

interface InputType {
    isLoader: boolean;
    options: JSX.Element[];
    combobox: ComboboxStore;
    scope: ItemFormScope;
    handleClearData: () => void;
    // handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ isLoader, options, combobox, handleClearData, scope }: InputType) => {
    const dispatch = useAppDispatch();

    const { item_reference } = useAppSelector((state) => getItemFormState(state, 'item_form_add'));

    const description = item_reference.description;

    return (
        <>
            <Combobox.Target>
                <div style={{ position: 'relative' }}>
                    <UnstyledButton style={{ position: 'absolute', right: 0, bottom: 40 }} onClick={() => handleClearData()} >
                        <Text c={'violet'}>Limpar dados</Text>
                    </UnstyledButton>
                    <Tooltip
                        disabled={description?.length !== 0 ? false : true}
                        label={description}
                        multiline
                        w={400}
                        offset={{ mainAxis: 16, crossAxis: -75 }}
                    >
                        <TextInput
                            radius="lg"
                            label="Descrição do item"
                            description="Busque por itens já cadastrados ou adicione um novo"
                            placeholder="Digite a descrição do item"

                            // rightSection={description?.length !== 0 ? <ClearDescription scope={scope} /> : undefined}
                            withAsterisk

                            value={description}
                            onChange={(e) => {
                                dispatch(setReferenceField({ scope, key: 'description', value: e.currentTarget.value }))
                                // handleChange(e)
                            }}

                            readOnly={item_reference.id ? true : false} // desabilita o input se um item já foi selecionado

                            // configurações do combobox
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