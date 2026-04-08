import { describe, expect, it } from "vitest";
import { createTask, filterTasksByQuery, normalizeTaskTitle } from "../src/js/utils.js";
import { createTask, normalizeTaskPriority, normalizeTaskTitle } from "../src/js/utils.js";

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
    expect(task.priority).toBe("medium");
  });

  it("menyimpan priority yang valid", () => {
    const task = createTask("setup lint", "Budi", "high");
    expect(task.priority).toBe("high");
  });

  it("melempar error jika judul kosong", () => {
    expect(() => createTask("   ", "Budi")).toThrow("Judul task tidak boleh kosong");
  });
});

describe("filterTasksByQuery", () => {
  const tasks = [
    { title: "Setup Pipeline", owner: "Surya" },
    { title: "Buat UI Board", owner: "Dimas" },
    { title: "Tambah Unit Test", owner: "Favian" }
  ];

  it("mengembalikan semua task jika query kosong", () => {
    expect(filterTasksByQuery(tasks, "")).toHaveLength(3);
  });

  it("filter berdasarkan judul atau owner secara case-insensitive", () => {
    expect(filterTasksByQuery(tasks, "pipeline")).toHaveLength(1);
    expect(filterTasksByQuery(tasks, "dimas")).toHaveLength(1);
describe("normalizeTaskPriority", () => {
  it("mengembalikan priority valid", () => {
    expect(normalizeTaskPriority("high")).toBe("high");
  });

  it("default ke medium jika input tidak valid", () => {
    expect(normalizeTaskPriority("urgent")).toBe("medium");
  });
});
