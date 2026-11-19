import newsSectionContent from "./content/news-section.md?raw";
import copyBudgetItemAsTextContent from "./content/copy-budget-item-as-text.md?raw";
import searchItemsByCodesContent from "./content/search-items-by-codes.md?raw";

export type ChangeLogCategory = "novelty" | "improvement" | "bug-fix";

interface ChangeLogEntry {
    title: string;
    description?: string;
    summary?: string;
    date: string;
    content?: string;
    category?: ChangeLogCategory;
}

export const changeLogEntryData: ChangeLogEntry[] = [
    {
        title: "Referências de itens mais práticas",
        summary: "A seção de referência do formulário ganhou um visual mais organizado, com notas e links em destaque. O painel de links se sobrepõe ao formulário sem deslocar os botões, tem rolagem própria e aceita links sem exigir um formato específico.",
        date: "2026-11-18",
        category: "improvement",
    },
    {
        title: "Aviso da busca desaparece automaticamente",
        summary: "Corrigimos a busca de itens de referência no formulário: quando nenhum resultado é encontrado, o aviso desaparece após 1,5 segundo e o espaço do menu é liberado.",
        date: "2026-11-18",
        category: "bug-fix",
    },
    {
        title: "Arraste e copie descrições com mais facilidade",
        summary: "Use o ícone ao lado do número do item para reorganizar itens do orçamento e passe o mouse sobre a descrição para copiá-la. A cópia da descrição agora fica disponível nesse botão, em vez do menu de contexto.",
        date: "2026-11-18",
        category: "improvement",
    },
    {
        title: "Pesquise itens também pelos códigos",
        summary: "Encontre itens cadastrados pelo código interno ou do fabricante, mesmo quando a descrição digitada for diferente.",
        date: "2026-11-12",
        content: searchItemsByCodesContent,
        category: "novelty",
    },
    {
        title: "Copie os dados do item para texto",
        summary: "Reúna em um único texto os principais dados de um item do orçamento: descrição, código, valores finais e, quando houver, previsão de entrega.",
        date: "2026-11-10",
        content: copyBudgetItemAsTextContent,
        category: "novelty",
    },
    {
        title: "Novidades mais claras e explicativas",
        summary: "Agora as novidades também mostram se são um recurso novo, uma melhoria ou uma correção, com ícones e cores para identificar cada tipo.",
        date: "2026-11-10",
        content: newsSectionContent,
        category: "improvement",
    },
    {
        title: "Correção no campo de IPI",
        description: "Corrigimos a digitação e a colagem de percentuais decimais no campo de IPI. Agora valores com ponto ou vírgula são considerados nos cálculos.",
        date: "2026-11-10",
    },
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
