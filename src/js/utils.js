export function normalizeTaskTitle(title) {
  return String(title || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
}

export function createTask(title, owner) {
  const normalizedTitle = normalizeTaskTitle(title);
  const normalizedOwner = String(owner || "").trim();

  if (!normalizedTitle) {
    throw new Error("Judul task tidak boleh kosong");
  }

  const now = Date.now();

  return {
    id: now,
    createdAt: now,
    title: normalizedTitle,
    owner: normalizedOwner || "Unassigned",
    status: "todo"
  };
}

function getTaskTimestamp(task) {
  if (Number.isFinite(task.createdAt)) {
    return task.createdAt;
  }

  if (Number.isFinite(task.id)) {
    return task.id;
  }

  return 0;
}

export function sortTasks(tasks, mode = "oldest") {
  const sorted = [...tasks];

  if (mode === "newest") {
    return sorted.sort((a, b) => getTaskTimestamp(b) - getTaskTimestamp(a));
  }

  if (mode === "title-asc") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title, "id", { sensitivity: "base" }));
  }

  return sorted.sort((a, b) => getTaskTimestamp(a) - getTaskTimestamp(b));
}
