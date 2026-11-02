interface ChangeLogEntry {
    title: string;
    description: string;
    date: string;
}

export const changeLogEntryData: ChangeLogEntry[] = [
    {
        title: "Aba de novidades",
        description: "Acompanhe por aqui as principais novidades e melhorias do aplicativo.",
        date: "2026-11-01",
    },
    {
        title: "Atualizações automáticas",
        description: "A versão para Windows agora verifica automaticamente se há atualizações sempre que o aplicativo é iniciado.",
        date: "2026-11-01",
    },
];
