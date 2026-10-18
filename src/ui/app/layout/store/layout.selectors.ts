import type { RootState } from "../store";

export const selectIsSidebarCollapsed = (state: RootState) =>
    state.layout.isSidebarCollapsed;
