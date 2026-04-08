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

  return {
    id: Date.now(),
    title: normalizedTitle,
    owner: normalizedOwner || "Unassigned",
    status: "todo"
  };
}
