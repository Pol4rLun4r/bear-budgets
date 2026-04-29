import electron, { WebFrameMain } from "electron";
import { pathToFileURL } from "url";

// utils
import { isDev } from "./env.js";
import { getUIPath } from "./pathResolver.js";

// função para verificar se o webFrame é o correto, para evitar ataques maliciosos
export function validateEventFrame(frame: WebFrameMain) {
    if (isDev() && new URL(frame.url).host === 'localhost:5173') {
        return;
    }
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicious event');
    }
}

// função para lidar com eventos do ipcMain, garantindo que o evento seja legítimo e passando o banco de dados para a função de manipulação
export const ipcMainHandle = <Key extends keyof EventPayloadMapping>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channels: Key, handle: (args: any) => EventPayloadMapping[Key]
) => {
    electron.ipcMain.handle(channels, (event, args) => {
        if (!event.senderFrame) {
            throw new Error('Malicious event');
        }
        validateEventFrame(event.senderFrame);
        return handle(args);
    });
};