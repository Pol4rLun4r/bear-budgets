// electron
import { BrowserWindow } from "electron";

// utils
import { isDev } from "../utils/env.js";
import { getPreloadPath, getUIPath } from "../utils/pathResolver.js";

// windows
import { setupWindowNavigationGuards } from "./navigation.js";

/** Função para criar a janela principal do aplicativo */
export const createMainWindow = () => {
    const win = new BrowserWindow({
        // segurança
        webPreferences: {
            nodeIntegration: false, // desativa a integração do Node.js para segurança
            sandbox: true, // necessário para contextBridge funcionar corretamente
            preload: getPreloadPath(), // caminho para o arquivo preload, que é responsável por expor as APIs do Electron para o renderer process de forma segura
            devTools: isDev() ? true : false, // habilita o DevTools apenas no modo de desenvolvimento para evitar que usuários finais acessem as ferramentas de desenvolvimento
        },

        // style da janela
        width: 1200,
        height: 800,
        minWidth: 750,
        minHeight: 650,
        frame: false
    });

    // configura as proteções de navegação para a janela principal
    setupWindowNavigationGuards(win);

    if (isDev()) {
        win.loadURL('http://localhost:5173/'); // interface no modo desenvolvimento
    } else {
        win.loadFile(getUIPath()); // interface no modo produção (build)
    }

    return win;
};

/** Função para focar ou criar a janela principal */
export const focusOrCreateMainWindow = () => {
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