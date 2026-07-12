import electron from "electron";

// função handle dos ipcRenderer.invoke
export const ipcInvoke = <Key extends keyof EventPayloadMapping>(
    channels: Key, data?: unknown
): Promise<EventPayloadMapping[Key]> => {
    return electron.ipcRenderer.invoke(channels, data);
}

// funções que o react irá chamar
const api: API = {
    quotation: {
        create: (quotation) => ipcInvoke('quotation:create', quotation),
        getAllSummary: () => ipcInvoke('quotation:getAllSummary'),
        getFull: (quotationId: Quotation['id']) => ipcInvoke('quotation:getFull', quotationId),
    },
    item: {
        searchDescription: (description) => ipcInvoke('item:searchDescription', description),
        findItemReferences: (description) => ipcInvoke('item:findItemReferences', description),
        getReferenceLinks: (itemReferenceId) => ipcInvoke('item:getReferenceLinks', itemReferenceId),
        getAllValuesByReferenceId: (itemReferenceId) => ipcInvoke('item:getAllValuesByReferenceId', itemReferenceId)
     },
    window: {
        minimize: () => ipcInvoke('window:minimize'),
        maximizeToggle: () => ipcInvoke('window:maximizeToggle'),
        close: () => ipcInvoke('window:close'),
    }
}

// expondo as APIs do Electron para o renderer process de forma segura
electron.contextBridge.exposeInMainWorld("api", api);