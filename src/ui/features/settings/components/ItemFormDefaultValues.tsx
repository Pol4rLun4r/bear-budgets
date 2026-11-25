import { useState } from 'react';
import { NumberInput, Paper, Select, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import classes from '../Settings.module.css';

export interface DefaultItemValues {
    defaultMarkup: number;
    defaultBoarding: number;
    defaultBoardingMode: BoardingInputMode;
    defaultDelivery: number;
}

interface ItemFormDefaultValuesProps {
    values: DefaultItemValues;
    onChange: (values: Partial<DefaultItemValues>) => void;
}

const ItemFormDefaultValues = ({
    values,
    onChange,
}: ItemFormDefaultValuesProps) => {
    const markupInput = useDraftNumber(values.defaultMarkup, (defaultMarkup) => onChange({ defaultMarkup }));
    const boardingInput = useDraftNumber(values.defaultBoarding, (defaultBoarding) => onChange({ defaultBoarding }));
    const deliveryInput = useDraftNumber(values.defaultDelivery, (defaultDelivery) => onChange({ defaultDelivery }));

    return (
        <Paper className={classes.fieldGroup} radius="md" p="sm" withBorder>
            <Stack gap="xs">
                <Title order={5}>Valores iniciais de novos itens</Title>
                <Text size="sm" c="dimmed">
                    Padrão atual do aplicativo: markup 40%, embarque 0 dias corridos e entrega 3 dias úteis.
                    As alterações só serão aplicadas depois de salvar.
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <NumberInput
                        label="Markup padrão (%)"
                        description="De 0 a 1000%."
                        value={markupInput.value}
                        min={0}
                        max={1000}
                        step={1}
                        allowDecimal={false}
                        onChange={markupInput.onChange}
                    />
                    <NumberInput
                        label="Embarque padrão"
                        description="Dias corridos até o embarque."
                        value={boardingInput.value}
                        min={0}
                        step={1}
                        allowDecimal={false}
                        onChange={boardingInput.onChange}
                    />
                    <NumberInput
                        label="Entrega padrão (dias úteis)"
                        description="Dias úteis até a entrega."
                        value={deliveryInput.value}
                        min={0}
                        step={1}
                        allowDecimal={false}
                        onChange={deliveryInput.onChange}
                    />
                    <Select
                        label="Forma padrão do embarque"
                        description="Escolhe como o prazo será exibido no formulário."
                        value={values.defaultBoardingMode}
                        allowDeselect={false}
                        data={[
                            { label: 'Dias corridos', value: 'calendarDays' },
                            { label: 'Dias úteis', value: 'businessDays' },
                            { label: 'Calendário', value: 'date' },
                        ]}
                        onChange={(value) => {
                            if (
                                value === 'calendarDays' ||
                                value === 'businessDays' ||
                                value === 'date'
                            ) {
                                onChange({ defaultBoardingMode: value });
                            }
                        }}
                    />
                </SimpleGrid>
            </Stack>
        </Paper>
    );
};

const useDraftNumber = (value: number, onCommit: (value: number) => void) => {
    const [state, setState] = useState({ source: value, draft: value as number | string });

    if (state.source !== value) {
        setState({ source: value, draft: value });
    }

    return {
        value: state.draft,
        onChange: (draft: number | string) => {
            setState((current) => ({ ...current, draft }));
            if (typeof draft === 'number') onCommit(draft);
        },
    };
};

export default ItemFormDefaultValues;
