import { changeLogEntryData } from "./changeLog.entries";

export interface ChangeLogEntry {
    title: string;
    description: string;
    date: Date;
}

const parseCalendarDate = (date: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

    if (!match) {
        throw new RangeError(`Invalid changelog date "${date}". Use YYYY-MM-DD.`);
    }

    const [, yearText, monthText, dayText] = match;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const parsedDate = new Date(year, month - 1, day);

    if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
    ) {
        throw new RangeError(`Invalid changelog calendar date "${date}".`);
    }

    return parsedDate;
};

export const createChangeLogEntry = (
    title: string,
    description: string,
    date: string,
): ChangeLogEntry => ({ title, description, date: parseCalendarDate(date) });

export const changeLogEntries = changeLogEntryData.map(({ title, description, date }) =>
    createChangeLogEntry(title, description, date),
);
