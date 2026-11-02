const relativeDayFormatter = new Intl.RelativeTimeFormat("pt-BR", {
    numeric: "auto",
});
const calendarDateFormatter = new Intl.DateTimeFormat("pt-BR", {
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
