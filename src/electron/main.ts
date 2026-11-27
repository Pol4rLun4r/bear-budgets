// electron
import { app } from "electron";

// utils
import { getDBPath, getMarginsPath, getSettingsPath } from "./utils/pathResolver.js";
import { createFakeData } from "./utils/createFakeData.js";

// database
import { createDatabase } from "./db/connection.js";
import { createSettingsStore } from "./app/settings.js";
import { createMarginsStore } from "./app/margins.js";

// electron components
import ipcHandlers from "./ipc/index.js";

// windows
import { windowEvents } from "./app/windowEvents.js";
import { createMainWindow, focusOrCreateMainWindow } from "./windows/mainWindow.js";

// setups
import { setupSingleInstance } from "./app/singleInstance.js";
import { setupAppLifeCycle } from "./app/lifeCycle.js";
import { setupAutoUpdater } from "./app/updater.js";

// database
let db: ReturnType<typeof createDatabase> | undefined;

const main = () => {
    // configura o ciclo de vida do aplicativo, garantindo que o banco de dados seja fechado corretamente e capturando erros não tratados
    setupAppLifeCycle(() => db);

    // garante que só uma instancia do app roda, se o usuário tentar abrir outra, a janela da instância existente é focada
    if (!setupSingleInstance(focusOrCreateMainWindow)) {
        return;
    }

    // quando o app estiver pronto, cria a janela principal, inicializa o banco de dados e registra os handlers do IPC
    app.whenReady().then(async () => {
        const dbPath = getDBPath();
        const settingsStore = createSettingsStore(getSettingsPath(dbPath));
        const marginsStore = createMarginsStore(getMarginsPath(dbPath));

        db = createDatabase(dbPath); // cria a conexão com o banco de dados
        await settingsStore.initialize();
        await marginsStore.initialize();

        // função para dev
        createFakeData(db); // cria dados fake em modo de desenvolvimento

        // funções principais do app
        ipcHandlers(db, settingsStore, marginsStore); // registo dos handlers antes de abrir a janela
        windowEvents(focusOrCreateMainWindow); // registo dos eventos da janela
        createMainWindow(); // cria a janela principal do aplicativo
        setupAutoUpdater(settingsStore.get().general.automaticUpdates); // verifica atualizações, inclusive durante o desenvolvimento
    }).catch((error: unknown) => {
        console.error("Failed to initialize application:", error);
        app.quit();
    });
}

main();