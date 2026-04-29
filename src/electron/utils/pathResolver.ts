import path from "path";
import { app } from "electron";

// utils
import { isDev, isTest } from "./env.js";

export const getPreloadPath = () => {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        '/dist-electron/preload.cjs'
    )
}

export function getUIPath() {
    return path.join(app.getAppPath(), '/dist-react/index.html');
}

export function getAssetPath() {
    return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
}

export const getDBPath = () => {
    if (isDev()) return ":memory:"

    if (isTest()) return ":memory:"

    return path.join(app.getPath('documents'), "app.db");
}