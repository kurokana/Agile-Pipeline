import { describe, expect, it } from "vitest";
import { createTask, normalizeTaskPriority, normalizeTaskTitle, updateTask } from "../src/js/utils.js";

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

describe("normalizeTaskPriority", () => {
  it("mengembalikan priority valid", () => {
    expect(normalizeTaskPriority("high")).toBe("high");
  });

  it("default ke medium jika input tidak valid", () => {
    expect(normalizeTaskPriority("urgent")).toBe("medium");
  });
});

describe("updateTask", () => {
  it("memperbarui title, owner, dan priority", () => {
    const task = createTask("setup lint", "Budi", "low");
    const updated = updateTask(task, {
      title: "perbaiki pipeline",
      owner: "Ani",
      priority: "high"
    });

    expect(updated.title).toBe("Perbaiki Pipeline");
    expect(updated.owner).toBe("Ani");
    expect(updated.priority).toBe("high");
    expect(updated.status).toBe("todo");
  });

  it("mempertahankan nilai lama jika update kosong", () => {
    const task = createTask("setup lint", "Budi", "low");
    const updated = updateTask(task, {});

    expect(updated.title).toBe(task.title);
    expect(updated.owner).toBe(task.owner);
    expect(updated.priority).toBe(task.priority);
  });

  it("melempar error jika task tidak ada", () => {
    expect(() => updateTask(null, { title: "x" })).toThrow("Task tidak ditemukan");
  });
});
