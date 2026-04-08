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

export function normalizeTaskDeadline(deadline) {
  const normalizedDeadline = String(deadline || "").trim();
  if (!normalizedDeadline) {
    return "";
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(normalizedDeadline)) {
    return "";
  }

  const parsedDate = new Date(`${normalizedDeadline}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return normalizedDeadline;
}

export function createTask(title, owner, priority = "medium", deadline = "") {
  const normalizedTitle = normalizeTaskTitle(title);
  const normalizedOwner = String(owner || "").trim();
  const normalizedPriority = normalizeTaskPriority(priority);
  const normalizedDeadline = normalizeTaskDeadline(deadline);

  if (!normalizedTitle) {
    throw new Error("Judul task tidak boleh kosong");
  }

  const now = Date.now();

  return {
    id: now,
    createdAt: now,
    title: normalizedTitle,
    owner: normalizedOwner || "Unassigned",
    priority: normalizedPriority,
    deadline: normalizedDeadline,
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

export function filterTasksByQuery(tasks, query) {
  const keyword = String(query || "").trim().toLowerCase();
  if (!keyword) {
    return tasks;
  }

  return tasks.filter((task) => {
    const haystack = `${task.title} ${task.owner}`.toLowerCase();
    return haystack.includes(keyword);
  });
}
