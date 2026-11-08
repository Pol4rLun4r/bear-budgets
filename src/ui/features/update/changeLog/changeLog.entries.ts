interface ChangeLogEntry {
    title: string;
    description: string;
    date: string;
}

export const changeLogEntryData: ChangeLogEntry[] = [
    {
        title: "Datas mais corretas e práticas",
        description: "Padronizamos a exibição de datas e horários e melhoramos a seleção de datas, incluindo digitação e destaque de feriados nacionais.",
        date: "2026-11-08",
    },
    {
        title: "Tabelas mais fáceis de ler",
        description: "Ajustamos larguras de colunas, cabeçalhos e linhas para facilitar a leitura das tabelas de orçamentos, itens e histórico de preços.",
        date: "2026-11-08",
    },
    {
        title: "Novidades em um só lugar",
        description: "Agora você pode conferir as novidades do aplicativo em uma janela dedicada, pelo botão Novidades.",
        date: "2026-11-08",
    },
    {
        title: "Busca de itens",
        description: "Agora você pode buscar itens pela descrição ou pelos códigos interno e do fabricante.",
        date: "2026-11-03",
    },
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
