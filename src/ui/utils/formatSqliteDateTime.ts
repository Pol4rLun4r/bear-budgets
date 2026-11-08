const relativeDayFormatter = new Intl.RelativeTimeFormat("pt-BR", {
    numeric: "always",
});
const millisecondsPerDay = 86_400_000;

const getCalendarDay = (year: number, month: number, day: number) => {
    const date = new Date(0);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCFullYear(year, month - 1, day);

    return date.getTime() / millisecondsPerDay;
};

export function formatSqliteDateTime(
    value: string,
    now = new Date(),
): { date: string; time: string; relative: string } {
    const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2}:\d{2})$/.exec(value);

    if (!match) {
        throw new Error(`Formato de data e hora inválido: ${value}`);
    }

    const [, year, month, day, time] = match;
    const parsedYear = Number(year);
    const parsedMonth = Number(month);
    const parsedDay = Number(day);
    const dateAsCalendarDay = getCalendarDay(parsedYear, parsedMonth, parsedDay);
    const parsedDate = new Date(dateAsCalendarDay * millisecondsPerDay);

    if (
        parsedDate.getUTCFullYear() !== parsedYear ||
        parsedDate.getUTCMonth() !== parsedMonth - 1 ||
        parsedDate.getUTCDate() !== parsedDay
    ) {
        throw new Error(`Formato de data e hora inválido: ${value}`);
    }

    const daysDifference =
        dateAsCalendarDay -
        getCalendarDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const relative =
        daysDifference === 0
            ? "Hoje"
            : daysDifference === -1
              ? "Ontem"
              : relativeDayFormatter.format(daysDifference, "day");

    return {
        date: `${day}/${month}/${year}`,
        time,
        relative,
    };
}
