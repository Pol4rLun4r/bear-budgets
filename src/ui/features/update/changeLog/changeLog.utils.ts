import type { ChangeLogEntry } from "./changeLog.data";

const relativeDayFormatter = new Intl.RelativeTimeFormat("pt-BR", {
    numeric: "auto",
});
const calendarDateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});
const groupDateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const getCalendarDay = (date: Date) =>
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;

const getOneMonthAgo = (date: Date) => {
    const targetMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const lastDayOfTargetMonth = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        0,
    ).getDate();

    return new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth(),
        Math.min(date.getDate(), lastDayOfTargetMonth),
    );
};

export const formatRelativeDate = (date: Date, now = new Date()) => {
    const daysAgo = getCalendarDay(date) - getCalendarDay(now);
    return relativeDayFormatter.format(daysAgo, "day");
};

export const formatChangeLogDate = (date: Date, now = new Date()) =>
    getCalendarDay(date) >= getCalendarDay(getOneMonthAgo(now))
        ? formatRelativeDate(date, now)
        : calendarDateFormatter.format(date);

export const formatChangeLogGroupDate = (date: Date) => groupDateFormatter.format(date);

export interface ChangeLogDateGroup {
    date: Date;
    entries: ChangeLogEntry[];
}

export const groupChangeLogEntries = (entries: ChangeLogEntry[]): ChangeLogDateGroup[] => {
    const sortedEntries = [...entries].sort((left, right) =>
        getCalendarDay(right.date) - getCalendarDay(left.date),
    );
    const groups: ChangeLogDateGroup[] = [];

    sortedEntries.forEach((entry) => {
        const lastGroup = groups.at(-1);
        const entryDay = getCalendarDay(entry.date);

        if (lastGroup && getCalendarDay(lastGroup.date) === entryDay) {
            lastGroup.entries.push(entry);
            return;
        }

        groups.push({ date: entry.date, entries: [entry] });
    });

    return groups;
};
