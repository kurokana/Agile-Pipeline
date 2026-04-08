import { createTask, filterTasksByQuery, normalizeTaskDeadline, sortTasks } from "./utils.js";

const form = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskOwnerInput = document.querySelector("#task-owner");
const taskSearchInput = document.querySelector("#task-search");
const taskSortInput = document.querySelector("#task-sort");
const taskPriorityInput = document.querySelector("#task-priority");
const taskDeadlineInput = document.querySelector("#task-deadline");
const todoList = document.querySelector("#todo-list");
const doingList = document.querySelector("#doing-list");
const doneList = document.querySelector("#done-list");

const lists = {
  todo: todoList,
  doing: doingList,
  done: doneList
};

const state = {
  tasks: [],
  searchQuery: "",
  sortMode: "oldest"
};

function saveState() {
  localStorage.setItem("agile_pipeline_tasks", JSON.stringify(state.tasks));
}

function loadState() {
  const saved = localStorage.getItem("agile_pipeline_tasks");
  if (!saved) return;

  try {
    let hasMigration = false;
    state.tasks = JSON.parse(saved).map((task) => {
      const createdAt = Number.isFinite(task.createdAt)
        ? task.createdAt
        : Number.isFinite(task.id)
          ? task.id
          : Date.now();
      const deadline = normalizeTaskDeadline(task.deadline);
      const status = task.status === "todo" || task.status === "doing" || task.status === "done"
        ? task.status
        : "todo";

      if (createdAt !== task.createdAt || deadline !== (task.deadline || "") || status !== task.status) {
        hasMigration = true;
      }

      return {
        ...task,
        createdAt,
        deadline,
        status
      };
    });

    if (hasMigration) {
      saveState();
    }
  } catch {
    state.tasks = [];
  }
}

function moveTask(taskId) {
  state.tasks = state.tasks.map((task) => {
    if (task.id !== taskId) return task;

    if (task.status === "todo") {
      return { ...task, status: "doing" };
    }

    if (task.status === "doing") {
      return { ...task, status: "done" };
    }

    return { ...task, status: "todo" };
  });

  saveState();
  render();
}

function formatDeadline(deadline) {
  if (!deadline) return "Tanpa deadline";

  const parsedDate = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Tanpa deadline";
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function isOverdue(task) {
  if (!task.deadline || task.status === "done") {
    return false;
  }

  const deadlinePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!deadlinePattern.test(task.deadline)) {
    return false;
  }

  const now = new Date();
  const todayKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");

  // For YYYY-MM-DD, lexical comparison is equivalent to chronological comparison.
  return task.deadline < todayKey;
}

function createTaskCard(task) {
  const overdue = isOverdue(task);
  const item = document.createElement("li");
  item.className = `task-card${overdue ? " task-overdue" : ""}`;

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title;

  const priority = document.createElement("span");
  priority.className = `priority-badge priority-${task.priority || "medium"}`;
  priority.textContent = (task.priority || "medium").toUpperCase();

  meta.append(title, priority);

  const owner = document.createElement("p");
  owner.className = "task-owner";
  owner.textContent = `Owner: ${task.owner}`;

  const deadline = document.createElement("p");
  deadline.className = "task-deadline";
  deadline.textContent = `Deadline: ${formatDeadline(task.deadline)}`;

  const overdueBadge = document.createElement("p");
  overdueBadge.className = "task-overdue-badge";
  overdueBadge.textContent = "Terlambat";
  overdueBadge.hidden = !overdue;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "task-action";
  button.textContent = task.status === "done" ? "Reset ke Todo" : "Pindah Tahap";
  button.addEventListener("click", () => moveTask(task.id));

  item.append(meta, owner, deadline, overdueBadge, button);
  return item;
}

function render() {
  Object.values(lists).forEach((list) => {
    list.innerHTML = "";
  });

  const visibleTasks = filterTasksByQuery(state.tasks, state.searchQuery);
  const orderedTasks = sortTasks(visibleTasks, state.sortMode);

  orderedTasks.forEach((task) => {
    const card = createTaskCard(task);
    lists[task.status].append(card);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const task = createTask(
      taskTitleInput.value,
      taskOwnerInput.value,
      taskPriorityInput.value,
      taskDeadlineInput.value
    );
    state.tasks.push(task);
    saveState();
    render();
    form.reset();
  } catch (error) {
    alert(error.message);
  }
});

taskSearchInput.addEventListener("input", (event) => {
  state.searchQuery = event.target.value;
  render();
});

taskSortInput.addEventListener("change", (event) => {
  state.sortMode = event.target.value;
  render();
});

loadState();
render();
