import { describe, expect, it } from "vitest";
import { createTask, normalizeTaskTitle } from "../src/js/utils.js";

describe("normalizeTaskTitle", () => {
  it("normalisasi spasi dan kapital kata", () => {
    expect(normalizeTaskTitle("   buat   pipeline ci   ")).toBe("Buat Pipeline Ci");
  });
});

describe("createTask", () => {
  it("memberi default owner jika kosong", () => {
    const task = createTask("setup lint", "");
    expect(task.owner).toBe("Unassigned");
    expect(task.status).toBe("todo");
  });

  it("melempar error jika judul kosong", () => {
    expect(() => createTask("   ", "Budi")).toThrow("Judul task tidak boleh kosong");
  });
});
