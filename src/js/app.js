import { createTask, filterTasksByQuery } from "./utils.js";

const form = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskOwnerInput = document.querySelector("#task-owner");
const taskSearchInput = document.querySelector("#task-search");
const taskPriorityInput = document.querySelector("#task-priority");
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
  searchQuery: ""
};

function saveState() {
  localStorage.setItem("agile_pipeline_tasks", JSON.stringify(state.tasks));
}

function loadState() {
  const saved = localStorage.getItem("agile_pipeline_tasks");
  if (!saved) return;

  try {
    state.tasks = JSON.parse(saved);
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

function createTaskCard(task) {
  const item = document.createElement("li");
  item.className = "task-card";

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

  const button = document.createElement("button");
  button.type = "button";
  button.className = "task-action";
  button.textContent = task.status === "done" ? "Reset ke Todo" : "Pindah Tahap";
  button.addEventListener("click", () => moveTask(task.id));

  item.append(meta, owner, button);
  return item;
}

function render() {
  Object.values(lists).forEach((list) => {
    list.innerHTML = "";
  });

  const visibleTasks = filterTasksByQuery(state.tasks, state.searchQuery);

  visibleTasks.forEach((task) => {
    const card = createTaskCard(task);
    lists[task.status].append(card);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const task = createTask(taskTitleInput.value, taskOwnerInput.value, taskPriorityInput.value);
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

loadState();
render();
