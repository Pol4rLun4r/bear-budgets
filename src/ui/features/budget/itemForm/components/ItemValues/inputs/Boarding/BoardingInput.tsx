import { useState } from "react";

// styles
import classes from "./Boarding.module.css";

// dayjs
import dayjs from "dayjs";

// mantine
import { NumberInput, Select, Group, Popover, TextInput, Tooltip } from "@mantine/core";
import { DatePicker } from '@mantine/dates';

// utils
import { addCalendarDays, differenceInCalendarDays, businessDaysToCalendarDays, calendarDaysToBusinessDays, parsePastedDate } from "@/utils/boardingUtils";
import { getBrazilNationalHolidays } from "@/utils/brazilHolidays";
import { IconCalendar } from "@tabler/icons-react";

type BoardingInputMode =
    | 'calendarDays'
    | 'businessDays'
    | 'date';

interface BoardingInputProps {
    baseDate: Date;
    value: number;
    onChange: (value: number) => void;
}

const BoardingInput = ({ baseDate, value, onChange }: BoardingInputProps) => {

    const [mode, setMode] = useState<BoardingInputMode>('calendarDays');
    const [calendarOpened, setCalendarOpened] = useState(false);
    const selectedDate = dayjs(addCalendarDays(baseDate, value)).format('YYYY-MM-DD');
    const [calendarDate, setCalendarDate] = useState(selectedDate);
    const [dateInputState, setDateInputState] = useState<{
        selectedDate: string;
        inputValue: string;
    } | null>(null);
    const dateInputValue = dateInputState?.selectedDate === selectedDate
        ? dateInputState.inputValue
        : dayjs(selectedDate).format('DD/MM/YYYY');

    const holidays = [
        ...getBrazilNationalHolidays(Number(calendarDate.slice(0, 4)) - 1),
        ...getBrazilNationalHolidays(Number(calendarDate.slice(0, 4))),
        ...getBrazilNationalHolidays(Number(calendarDate.slice(0, 4)) + 1),
    ];
    const holidaysByDate = new Map(holidays.map((holiday) => [holiday.date, holiday]));

    const styleConfig = {
        input: classes['boarding-number-input'],
    }
    const configInputs = { leftSection: <IconCalendar size={18} />, w: '50%', radius: 'lg', label: 'Embarque', classNames: { ...styleConfig } };

    return (
        <Group gap="0" flex={1} align="flex-end">
            {mode === 'calendarDays' && (
                <NumberInput
                    {...configInputs}
                    placeholder="corridos"
                    min={0}
                    value={value}
                    onChange={(value) => {
                        if (typeof value === 'number') {
                            onChange(value)
                        }
                    }}
                />
            )}

            {mode === 'businessDays' && (
                <NumberInput
                    {...configInputs}
                    placeholder="úteis"
                    min={0}
                    value={calendarDaysToBusinessDays(baseDate, value)}
                    onChange={(businessDays) => {
                        if (typeof businessDays === 'number') {
                            const calendarDays = businessDaysToCalendarDays(
                                baseDate,
                                businessDays
                            );

                            onChange(calendarDays);
                        }
                    }}
                />
            )}

            {mode === 'date' && (
                <Popover
                    opened={calendarOpened}
                    onChange={(opened) => {
                        setCalendarOpened(opened);
                        if (opened) setCalendarDate(selectedDate);
                    }}
                    position="bottom-start"
                    withinPortal
                    closeOnClickOutside
                >
                    <Popover.Target>
                        <TextInput
                            {...configInputs}
                            placeholder="DD/MM/AAAA"
                            value={dateInputValue}
                            onFocus={() => {
                                setCalendarDate(selectedDate);
                                setCalendarOpened(true);
                            }}
                            onClick={() => setCalendarOpened(true)}
                            onChange={(event) => {
                                const inputValue = event.currentTarget.value;
                                setDateInputState({ selectedDate, inputValue });

                                const parsedDate = parsePastedDate(inputValue);
                                if (parsedDate) {
                                    setCalendarDate(dayjs(parsedDate).format('YYYY-MM-DD'));
                                    onChange(differenceInCalendarDays(baseDate, parsedDate));
                                }
                            }}
                            onBlur={() => {
                                if (!parsePastedDate(dateInputValue)) {
                                    setDateInputState(null);
                                }
                            }}
                            onPaste={(event) => {
                                const pastedText = event.clipboardData.getData('text');
                                const pastedDate = parsePastedDate(pastedText);

                                if (!pastedDate) return;

                                event.preventDefault();
                                const date = dayjs(pastedDate).format('YYYY-MM-DD');
                                setDateInputState(null);
                                setCalendarDate(date);
                                onChange(differenceInCalendarDays(baseDate, pastedDate));
                            }}
                        />
                    </Popover.Target>
                    <Popover.Dropdown p="sm">
                        <DatePicker
                            date={calendarDate}
                            onDateChange={setCalendarDate}
                            value={selectedDate}
                            allowDeselect={false}
                            minDate={dayjs(baseDate).startOf('day').toDate()}
                            getDayProps={(date) => {
                                const holiday = holidaysByDate.get(date);
                                return holiday ? { className: classes.holidayDay } : {};
                            }}
                            renderDay={(date) => {
                                const holiday = holidaysByDate.get(date);
                                return (
                                    <Tooltip
                                        label={holiday?.name}
                                        disabled={!holiday}
                                        withinPortal
                                        position="top"
                                    >
                                        <span>{dayjs(date).date()}</span>
                                    </Tooltip>
                                );
                            }}
                            onChange={(date) => {
                                if (!date) return;

                                const parsedDate = dayjs(date, 'YYYY-MM-DD').toDate();
                                setDateInputState(null);
                                setCalendarDate(date);
                                onChange(differenceInCalendarDays(baseDate, parsedDate));
                                setCalendarOpened(false);
                            }}
                        />
                    </Popover.Dropdown>
                </Popover>
            )}
            <Select
                w={'50%'}
                radius={'lg'}
                withAlignedLabels
                allowDeselect={false}
                value={mode}
                onChange={(value) => setMode(value as BoardingInputMode)}
                data={[
                    { label: 'D/ corridos', value: 'calendarDays' },
                    { label: 'D/ úteis', value: 'businessDays' },
                    { label: 'Calendário', value: 'date' },
                ]}

                classNames={{
                    input: classes['boarding-select-input'],
                }}
            />
        </Group>
    )
}

export default BoardingInput