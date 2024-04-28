// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; // Initialize with an empty array if no tasks exist
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1; // Initialize with 1 if nextId doesn't exist

dayjs().format();

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (!nextId) {
        nextId = 1;
    } else {
        nextId++;
    }
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = document.createElement("div");
    card.classList.add("task-card");
    
    const title = document.createElement("h3");
    title.textContent = task.title;
    card.appendChild(title);
    
    const description = document.createElement("p");
    description.textContent = task.description;
    card.appendChild(description);
    
    const dueDate = document.createElement("p");
    dueDate.textContent = task.dueDate;
    card.appendChild(dueDate);
    
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const todo = document.querySelector("#todo");
    const inProgress = document.querySelector("#in-progress");
    const completed = document.querySelector("#completed");
    
    todo.innerHTML = "";
    inProgress.innerHTML = "";
    completed.innerHTML = "";
    
    taskList.forEach(task => {
        const card = createTaskCard(task);
        
        if (task.status === "todo") {
            todo.appendChild(card);
        } else if (task.status === "in-progress") {
            inProgress.appendChild(card);
        } else if (task.status === "completed") {
            completed.appendChild(card);
        }
    });
    
    $(".task-card").draggable({
        revert: "invalid",
        helper: "clone"
    });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const form = event.target;
    const task = {
        id: generateTaskId(),
        title: form.title.value,
        description: form.description.value,
        dueDate: form.dueDate.value,
        status: "todo"
    };
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId); // Update nextId in localStorage
    renderTaskList();
    form.reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = parseInt(event.target.dataset.taskId);
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = parseInt(ui.draggable[0].dataset.taskId);
    const task = taskList.find(task => task.id === taskId);
    task.status = event.target.id;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#add-task-form").on("submit", handleAddTask);
    $("#task-container").on("click", ".task-card", handleDeleteTask); // Event delegation for dynamic elements
    $(".lane").droppable({
        drop: handleDrop
    });
    $("#dueDate").datepicker(); // Make sure jQuery UI library is included
});
