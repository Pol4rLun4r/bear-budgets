import { app, BrowserWindow } from "electron";
import path from "path"; //trata os caminhos dentro dos OS

// utils
import { isDev } from "./utils/env.js";
import { getPreloadPath, getDBPath } from "./utils/pathResolver.js";

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
            preload: getPreloadPath() // caminho para o arquivo preload, que é responsável por expor as APIs do Electron para o renderer process de forma segura
        }
    })

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

const main = () => {
    try {
        app.whenReady().then(() => {
            db = createDatabase(getDBPath());

            createMainWindow();

            appEvents(createMainWindow);

            ipcHandlers(db);
            
        })
    } catch (error) {
        console.error(error);
        app.quit();
    }
}

main();