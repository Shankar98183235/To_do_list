document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task_input");
  const taskForm = document.getElementById("task_form");
  const taskList = document.getElementById("task_list");
  const resetBtn = document.getElementById("reset_btn");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const renderTasks = (filter = "all") => {
    taskList.innerHTML = "";

    tasks
      .filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "active") return !task.completed;
        return true;
      })
      .forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task-item";

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text" + (task.completed ? " completed" : "");
        span.addEventListener("click", () => {
          tasks[index].completed = !tasks[index].completed;
          saveTasks();
          renderTasks(filter);
        });

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editBtn = document.createElement("span");
        editBtn.className = "material-icons action-icon";
        editBtn.innerText = "edit";
        editBtn.title = "Edit Task";
        editBtn.addEventListener("click", () => {
          const newText = prompt("Edit your task:", task.text);
          if (newText !== null && newText.trim() !== "") {
            tasks[index].text = newText.trim();
            saveTasks();
            renderTasks(filter);
          }
        });

        const deleteBtn = document.createElement("span");
        deleteBtn.className = "material-icons action-icon";
        deleteBtn.innerText = "delete";
        deleteBtn.title = "Delete Task";
        deleteBtn.addEventListener("click", () => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks(filter);
        });

        actions.append(editBtn, deleteBtn);
        li.append(span, actions);
        taskList.appendChild(li);
      });
  };

  taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      saveTasks();
      renderTasks();
      taskInput.value = "";
    }
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Clear all tasks?")) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active").classList.remove("active");
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      renderTasks(filter);
    });
  });

  renderTasks();
});
