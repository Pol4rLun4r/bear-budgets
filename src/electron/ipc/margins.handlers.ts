import type { createMarginsStore } from "../app/margins.js";
import { ipcMainHandle } from "../utils/electron.js";

const marginsHandlers = (marginsStore: ReturnType<typeof createMarginsStore>) => {
    ipcMainHandle("margins:get", () => marginsStore.get());
    ipcMainHandle("margins:add", (margin) => marginsStore.add(margin));
    ipcMainHandle("margins:remove", (id) => marginsStore.remove(id));
};

export default marginsHandlers;
