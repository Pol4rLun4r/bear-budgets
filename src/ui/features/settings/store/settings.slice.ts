import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loadSettings = createAsyncThunk(
    "settings/load",
    async () => window.api.settings.get(),
);

export const updateSettings = createAsyncThunk(
    "settings/update",
    async (settings: SettingsUpdate) => window.api.settings.update(settings),
);

interface SettingsState {
    value: AppSettings | null;
    loadStatus: "idle" | "loading" | "loaded" | "error";
    loadError: string | null;
    pendingWrites: number;
}

const initialState: SettingsState = {
    value: null,
    loadStatus: "idle",
    loadError: null,
    pendingWrites: 0,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadSettings.pending, (state) => {
                state.loadStatus = "loading";
                state.loadError = null;
            })
            .addCase(loadSettings.fulfilled, (state, action) => {
                state.value = action.payload;
                state.loadStatus = "loaded";
            })
            .addCase(loadSettings.rejected, (state, action) => {
                state.loadStatus = "error";
                state.loadError = action.error.message ?? "Não foi possível carregar as configurações.";
            })
            .addCase(updateSettings.pending, (state) => {
                state.pendingWrites += 1;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.value = action.payload;
                state.pendingWrites = Math.max(0, state.pendingWrites - 1);
            })
            .addCase(updateSettings.rejected, (state) => {
                state.pendingWrites = Math.max(0, state.pendingWrites - 1);
            });
    },
});

export default settingsSlice.reducer;
