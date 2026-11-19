// type
import { useEffect, useState, type ChangeEvent } from "react";
import type { JSX } from "react";

// mantine
import { Combobox, ScrollArea, Tooltip, UnstyledButton, Text, TextInput, type ComboboxStore, Loader, ActionIcon } from "@mantine/core"

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { getItemFormState } from "@/features/budget/itemForm/store/itemForm.selectors";
import { resetItemDescription, resetItemReference, type ItemFormScope } from "@/features/budget/itemForm/store/itemForm.slice";

// icons
import { IconX } from "@tabler/icons-react";

interface InputType {
    isLoader: boolean;
    hasSearchTerm: boolean;
    searchKey: string;
    options: JSX.Element[];
    combobox: ComboboxStore;
    scope: ItemFormScope;
    handleClearData: () => void;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchDropdown = ({ isLoader, hasSearchTerm, options, combobox }: Pick<InputType, "isLoader" | "hasSearchTerm" | "options" | "combobox">) => {
    const [showNoResults, setShowNoResults] = useState(true);

    useEffect(() => {
        if (!hasSearchTerm || isLoader || options.length > 0) return;

        const timeoutId = window.setTimeout(() => {
            setShowNoResults(false);
            combobox.closeDropdown();
        }, 1500);

        return () => window.clearTimeout(timeoutId);
    }, [combobox, hasSearchTerm, isLoader, options.length]);

    if (hasSearchTerm && !isLoader && options.length === 0 && !showNoResults) return null;

    return (
        <Combobox.Dropdown>
            <ScrollArea.Autosize
                mah="min(24rem, max(0px, calc(var(--combobox-floating-options-max-height) - var(--frame-bar-height) - var(--frame-bar-safe-gap))))"
                scrollbarSize={6}
                scrollbars="y"
                type="auto"
                offsetScrollbars="y"
            >
                <Combobox.Options>
                    {options.length === 0 && !isLoader ? (
                        <Combobox.Empty>Nenhum resultado</Combobox.Empty>
                    ) : isLoader ? (
                        <Combobox.Empty><Loader /></Combobox.Empty>
                    ) : options}
                </Combobox.Options>
            </ScrollArea.Autosize>
        </Combobox.Dropdown>
    );
};

const Input = ({ isLoader, hasSearchTerm, searchKey, options, combobox, handleClearData, handleChange, scope }: InputType) => {
    const dispatch = useAppDispatch();

    const { item_reference } = useAppSelector((state) => getItemFormState(state, scope));

    const description = item_reference.description;

    const handleClear = () => {
        if (item_reference.id) {
            return dispatch(resetItemReference(scope));
        }

        dispatch(resetItemDescription(scope));
    };

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

                            rightSection={description ? (
                                <ActionIcon
                                    variant="transparent"
                                    onClick={handleClear}
                                    aria-label="Limpar descrição"
                                >
                                    <IconX size={15} />
                                </ActionIcon>
                            ) : undefined}
                            withAsterisk

                            value={description}
                            onChange={handleChange}

                            readOnly={Boolean(item_reference.id)}

                            // configurações do combobox
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => combobox.closeDropdown()}
                            onClick={() => combobox.openDropdown()}
                        />
                    </Tooltip>
                </div>
            </Combobox.Target>

            {/* menu de opções */}
            <SearchDropdown
                key={searchKey}
                isLoader={isLoader}
                hasSearchTerm={hasSearchTerm}
                options={options}
                combobox={combobox}
            />
        </>
    )
}

export default Input;