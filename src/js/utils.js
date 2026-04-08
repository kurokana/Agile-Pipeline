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
