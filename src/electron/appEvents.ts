import { app, BrowserWindow } from "electron"

const appEvents = (createMainWindow: () => void) => {
    // só cria uma nova janela caso nenhuma esteja existindo no momento (util para icone no tray)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
    
    // ao fechar todas as janelas encerra o programa
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
}

export default appEvents;
