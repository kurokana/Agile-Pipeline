import { describe, expect, it } from "vitest";
import {
  createTask,
  filterTasksByQuery,
  normalizeTaskDeadline,
  normalizeTaskPriority,
  normalizeTaskTitle,
  sortTasks
} from "../src/js/utils.js";

describe("normalizeTaskTitle", () => {
  it("normalisasi spasi dan kapital kata", () => {
    expect(normalizeTaskTitle("   buat   pipeline ci   ")).toBe("Buat Pipeline Ci");
  });
});

describe("normalizeTaskPriority", () => {
  it("mengembalikan priority valid", () => {
    expect(normalizeTaskPriority("high")).toBe("high");
  });

  it("default ke medium jika input tidak valid", () => {
    expect(normalizeTaskPriority("urgent")).toBe("medium");
  });
});

describe("normalizeTaskDeadline", () => {
  it("mengembalikan nilai kosong untuk deadline invalid", () => {
    expect(normalizeTaskDeadline("31-12-2026")).toBe("");
  });

  it("mengembalikan nilai kosong untuk tanggal kalender yang tidak valid", () => {
    expect(normalizeTaskDeadline("2026-02-31")).toBe("");
  });

  it("mengembalikan tanggal valid format yyyy-mm-dd", () => {
    expect(normalizeTaskDeadline("2026-12-31")).toBe("2026-12-31");
  });
});

describe("createTask", () => {
  it("memberi default owner jika kosong", () => {
    const task = createTask("setup lint", "");
    expect(task.owner).toBe("Unassigned");
    expect(task.status).toBe("todo");
    expect(task.priority).toBe("medium");
    expect(task.deadline).toBe("");
  });

  it("menyimpan priority dan deadline yang valid", () => {
    const task = createTask("setup lint", "Budi", "high", "2026-05-10");
    expect(task.priority).toBe("high");
    expect(task.deadline).toBe("2026-05-10");
    expect(task.createdAt).toBeTypeOf("number");
  });

  it("melempar error jika judul kosong", () => {
    expect(() => createTask("   ", "Budi")).toThrow("Judul task tidak boleh kosong");
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
  });
});
