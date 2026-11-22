import type { createSettingsStore } from "../app/settings.js";
import { ipcMainHandle } from "../utils/electron.js";

const settingsHandlers = (settingsStore: ReturnType<typeof createSettingsStore>) => {
    ipcMainHandle("settings:get", () => settingsStore.get());
    ipcMainHandle("settings:update", (settings) => settingsStore.update(settings));
};

export default settingsHandlers;
