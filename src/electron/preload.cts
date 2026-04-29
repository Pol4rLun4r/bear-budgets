import electron from "electron";

// função handle dos ipcRenderer.invoke
export const ipcInvoke = <Key extends keyof EventPayloadMapping>(
    channels: Key, data?: unknown
): Promise<EventPayloadMapping[Key]> => {
    return electron.ipcRenderer.invoke(channels, data);
}

// funções que o react irá chamar
const api: API = {
    client: {
        create: (client) => ipcInvoke('client:create', client),
        search: (query) => ipcInvoke('client:search', query)
    },
    quotation: {
        create: (quotation) => ipcInvoke('quotation:create', quotation),
        createWithItems: (allData) => ipcInvoke('quotation:createWithItems', allData)
    },
    item: {
        searchReferences: (references) => ipcInvoke('item:searchReferences', references)
    }
}

// expondo as APIs do Electron para o renderer process de forma segura
electron.contextBridge.exposeInMainWorld("api", api);