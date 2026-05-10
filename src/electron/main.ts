import { app, BrowserWindow } from "electron";
import path from "path"; //trata os caminhos dentro dos OS

// utils
import { isDev } from "./utils/env.js";
import { getPreloadPath, getDBPath } from "./utils/pathResolver.js";
import { createFakeData } from "./utils/createFakeData.js";

// database
import { createDatabase } from "./db/connection.js";

// componentes
import ipcHandlers from "./ipc/index.js";
import appEvents from "./appEvents.js";

// criar janela principal
const createMainWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false, // desativa a integração do Node.js para segurança
            sandbox: true, // necessário para contextBridge funcionar corretamente
            preload: getPreloadPath(), // caminho para o arquivo preload, que é responsável por expor as APIs do Electron para o renderer process de forma segura
            devTools: isDev() ? true : false,
        },
        width: 1200,
        height: 800,
        minWidth: 750,
        minHeight: 650,
        frame: false
        
    });

    if (isDev()) {
        win.loadURL('http://localhost:5173/'); // caminho em desenvolvimento
    } else {
        win.loadFile(path.join(app.getAppPath() + '/dist-react/index.html')) // caminho em produção
    }
};

// banco de dados
let db: ReturnType<typeof createDatabase>;

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

// função para focar ou criar a janela principal
const focusOrCreateMainWindow = () => {
    const wins = BrowserWindow.getAllWindows();
    if (wins.length === 0) {
        createMainWindow();
        return;
    }

    // foca ou cria a janela principal
    for (const win of wins) {
        if (win.isMinimized()) win.restore();
        win.show();
        win.focus();
    }
};


const main = () => {
    // verifica se o programa já está sendo executado em outra instância
    const gotLock = app.requestSingleInstanceLock();
    if (!gotLock) {
        app.quit();
        return;
    }
    // se o programa já está sendo executado em outra instância, foca ou cria a janela principal
    app.on("second-instance", () => focusOrCreateMainWindow());

    try {
        app.whenReady().then(() => {
            db = createDatabase(getDBPath());

            // cria dados fake para desenvolvimento
            createFakeData(db);

            createMainWindow();

            appEvents(focusOrCreateMainWindow);

            ipcHandlers(db);

        })
    } catch (error) {
        console.error(error);
        app.quit();
    }
}

main();