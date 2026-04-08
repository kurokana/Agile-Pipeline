import { createTask, updateTask } from "./utils.js";

const form = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskOwnerInput = document.querySelector("#task-owner");
const taskPriorityInput = document.querySelector("#task-priority");
const taskSubmitButton = document.querySelector("#task-submit");
const cancelEditButton = document.querySelector("#cancel-edit");
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
  editingTaskId: null
};

function saveState() {
  localStorage.setItem("agile_pipeline_tasks", JSON.stringify(state.tasks));
}

function resetEditMode() {
  state.editingTaskId = null;
  taskSubmitButton.textContent = "Tambah";
  cancelEditButton.hidden = true;
  form.reset();
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

function editTask(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  state.editingTaskId = taskId;
  taskTitleInput.value = task.title;
  taskOwnerInput.value = task.owner;
  taskPriorityInput.value = task.priority || "medium";
  taskSubmitButton.textContent = "Simpan Perubahan";
  cancelEditButton.hidden = false;
  taskTitleInput.focus();
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

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "task-action task-action-secondary";
  editButton.textContent = "Edit Task";
  editButton.addEventListener("click", () => editTask(task.id));

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.append(editButton, button);

  item.append(meta, owner, actions);
  return item;
}

function render() {
  Object.values(lists).forEach((list) => {
    list.innerHTML = "";
  });

  state.tasks.forEach((task) => {
    const card = createTaskCard(task);
    lists[task.status].append(card);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    if (state.editingTaskId !== null) {
      state.tasks = state.tasks.map((item) => {
        if (item.id !== state.editingTaskId) {
          return item;
        }

        return updateTask(item, {
          title: taskTitleInput.value,
          owner: taskOwnerInput.value,
          priority: taskPriorityInput.value
        });
      });
    } else {
      const task = createTask(taskTitleInput.value, taskOwnerInput.value, taskPriorityInput.value);
      state.tasks.push(task);
    }

    saveState();
    render();
    resetEditMode();
  } catch (error) {
    alert(error.message);
  }
});

cancelEditButton.addEventListener("click", () => {
  resetEditMode();
});

loadState();
render();
