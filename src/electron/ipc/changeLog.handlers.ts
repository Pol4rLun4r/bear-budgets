import { getChangeLogState, markChangeLogAsRead } from "../app/changeLog.js";
import { ipcMainHandle } from "../utils/electron.js";

const changeLogHandlers = () => {
    ipcMainHandle("news:getState", () => getChangeLogState());
    ipcMainHandle("news:markRead", () => markChangeLogAsRead());
};

export default changeLogHandlers;
