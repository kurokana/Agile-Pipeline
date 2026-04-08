export function normalizeTaskTitle(title) {
  return String(title || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
}

export function normalizeTaskPriority(priority) {
  const normalizedPriority = String(priority || "").trim().toLowerCase();

  if (normalizedPriority === "low" || normalizedPriority === "medium" || normalizedPriority === "high") {
    return normalizedPriority;
  }

  return "medium";
}

export function createTask(title, owner, priority = "medium") {
  const normalizedTitle = normalizeTaskTitle(title);
  const normalizedOwner = String(owner || "").trim();
  const normalizedPriority = normalizeTaskPriority(priority);

  if (!normalizedTitle) {
    throw new Error("Judul task tidak boleh kosong");
  }

  return {
    id: Date.now(),
    title: normalizedTitle,
    owner: normalizedOwner || "Unassigned",
    priority: normalizedPriority,
    status: "todo"
  };
}

export function updateTask(task, updates = {}) {
  if (!task) {
    throw new Error("Task tidak ditemukan");
  }

  const nextTitle = updates.title ?? task.title;
  const nextOwner = updates.owner ?? task.owner;
  const nextPriority = updates.priority ?? task.priority;

  const normalizedTitle = normalizeTaskTitle(nextTitle);

  if (!normalizedTitle) {
    throw new Error("Judul task tidak boleh kosong");
  }

  return {
    ...task,
    title: normalizedTitle,
    owner: String(nextOwner || "").trim() || "Unassigned",
    priority: normalizeTaskPriority(nextPriority)
  };
}
