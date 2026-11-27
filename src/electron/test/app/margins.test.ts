import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createMarginsStore } from "../../app/margins.js";

describe("margins store", () => {
    let directory: string;
    let marginsPath: string;

    beforeEach(async () => {
        directory = await mkdtemp(path.join(os.tmpdir(), "bear-budgets-margins-"));
        marginsPath = path.join(directory, "bear-budgets-margins.json");
    });

    afterEach(async () => {
        await rm(directory, { recursive: true, force: true });
    });

    it("creates an empty JSON file when none exists", async () => {
        const store = createMarginsStore(marginsPath);
        await store.initialize();

        expect(store.get()).toEqual([]);
        expect(await readFile(marginsPath, "utf8")).toBe("[]\n");
    });

    it("adds a normalized margin and preserves it after reopening the store", async () => {
        const store = createMarginsStore(marginsPath);
        await store.initialize();

        const added = await store.add({ name: "  Revenda  ", percentage: 40 });
        expect(added).toHaveLength(1);
        expect(added[0]).toMatchObject({ name: "Revenda", percentage: 40 });
        expect(added[0]?.id).toBeTruthy();

        const reopenedStore = createMarginsStore(marginsPath);
        await reopenedStore.initialize();
        expect(reopenedStore.get()).toEqual(added);
    });

    it("rejects invalid values and duplicate names without changing the saved margins", async () => {
        const store = createMarginsStore(marginsPath);
        await store.initialize();
        const saved = await store.add({ name: "Revenda", percentage: 40 });

        await expect(store.add({ name: "revenda", percentage: 20 })).rejects.toThrow(
            "already exists",
        );
        await expect(store.add({ name: "Atacado", percentage: 1001 })).rejects.toThrow(
            "whole percentage from 0 to 1000",
        );
        await expect(store.add({ name: " ", percentage: 20 })).rejects.toThrow(
            "name must contain",
        );
        expect(store.get()).toEqual(saved);
    });

    it("removes a margin by ID and rejects unknown IDs", async () => {
        const store = createMarginsStore(marginsPath);
        await store.initialize();
        const [margin] = await store.add({ name: "Revenda", percentage: 40 });

        expect(await store.remove(margin!.id)).toEqual([]);
        await expect(store.remove(margin!.id)).rejects.toThrow("not found");
    });

    it("rejects malformed or duplicate entries in the JSON file", async () => {
        await writeFile(marginsPath, JSON.stringify([
            { id: "123e4567-e89b-42d3-a456-426614174000", name: "Revenda", percentage: 40 },
            { id: "123e4567-e89b-42d3-a456-426614174001", name: "revenda", percentage: 20 },
        ]));

        const store = createMarginsStore(marginsPath);
        await expect(store.initialize()).rejects.toThrow("IDs and names must be unique");
    });
});
