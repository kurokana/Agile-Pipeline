import { describe, expect, it } from "vitest";
import { createTask, normalizeTaskTitle, sortTasks } from "../src/js/utils.js";
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

  it("menyimpan createdAt untuk kebutuhan sorting", () => {
    const task = createTask("setup lint", "Budi");
    expect(task.createdAt).toBeTypeOf("number");
  });
});

describe("sortTasks", () => {
  const tasks = [
    { id: 1000, createdAt: 1000, title: "Deploy", owner: "A", status: "todo" },
    { id: 3000, createdAt: 3000, title: "Analisa", owner: "B", status: "todo" },
    { id: 2000, createdAt: 2000, title: "Build", owner: "C", status: "todo" }
  ];

  it("urut terlama ke terbaru secara default", () => {
    const ordered = sortTasks(tasks);
    expect(ordered.map((task) => task.id)).toEqual([1000, 2000, 3000]);
  });

  it("urut terbaru ke terlama", () => {
    const ordered = sortTasks(tasks, "newest");
    expect(ordered.map((task) => task.id)).toEqual([3000, 2000, 1000]);
  });

  it("urut judul A ke Z", () => {
    const ordered = sortTasks(tasks, "title-asc");
    expect(ordered.map((task) => task.title)).toEqual(["Analisa", "Build", "Deploy"]);
  });

  it("tidak memodifikasi array asli", () => {
    const original = [...tasks];
    sortTasks(tasks, "newest");
    expect(tasks).toEqual(original);
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
