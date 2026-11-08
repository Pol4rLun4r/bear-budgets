export type BrazilHoliday =
    | {
        date: string;
        name: string;
        scope: "national";
        stateCode?: never;
        municipality?: never;
    }
    | {
        date: string;
        name: string;
        scope: "state";
        stateCode: string;
        municipality?: never;
    }
    | {
        date: string;
        name: string;
        scope: "municipality";
        stateCode: string;
        municipality: string;
    };

const NATIONAL_HOLIDAYS = [
    { month: 1, day: 1, name: "Confraternização Universal" },
    { month: 4, day: 21, name: "Tiradentes" },
    { month: 5, day: 1, name: "Dia do Trabalho" },
    { month: 9, day: 7, name: "Independência do Brasil" },
    { month: 10, day: 12, name: "Nossa Senhora Aparecida" },
    { month: 11, day: 2, name: "Finados" },
    { month: 11, day: 15, name: "Proclamação da República" },
    { month: 11, day: 20, name: "Dia Nacional de Zumbi e da Consciência Negra" },
    { month: 12, day: 25, name: "Natal" },
] as const;

/**
 * Retorna os feriados nacionais brasileiros previstos em lei, em YYYY-MM-DD.
 * Não inclui pontos facultativos nem feriados estaduais ou municipais.
 */
export function getBrazilNationalHolidays(year: number): BrazilHoliday[] {
    if (!Number.isInteger(year) || year < 1 || year > 9999) {
        throw new RangeError("O ano deve ser um inteiro entre 1 e 9999.");
    }

    const formattedYear = String(year).padStart(4, "0");

    return NATIONAL_HOLIDAYS.map(({ month, day, name }) => ({
        date: `${formattedYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        name,
        scope: "national",
    }));
}
