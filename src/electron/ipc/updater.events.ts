import { BrowserWindow } from "electron";

/** envia mudanças de estado do updater para as janelas abertas */
export const publishAppUpdateState = (state: AppUpdateState) => {
    for (const window of BrowserWindow.getAllWindows()) {
        window.webContents.send("update:stateChanged", state);
    }
};
