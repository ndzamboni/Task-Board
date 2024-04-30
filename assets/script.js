// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const statusLanes = ["toDo", "inProgress", "done"];
const taskForm = $("#taskForm");
const taskListContainer = $("#taskListContainer");
const dueDate = $("#taskDueDate");
const taskName = $("#taskName");
const taskDescription = $("#taskDescription");
const taskStatus = $("#taskStatus");
const taskPriority = $("#taskPriority");



// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (!nextId) {
        nextId = 1;
    } else {
        nextId++;
    }
    localStorage.setItem("nextId", JSON.stringify(nextId));
    
    return nextId;
}
// store tasks in local storage
// Retrieve tasks from localStorage and parse the JSON to an array.
function storeTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Read tasks from local storage and returns array of task cards.
// If there are no tasks in localStorage, it initializes an empty array ([]) and returns it.
// If no tasks were retrieved from localStorage, assign tasks to a new empty array to push to later.
function getTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks) {
        tasks = [];
    }
    return tasks;
}
// Return the tasks array either empty or with data in it whichever it was determined to be by the logic right above.

// Accepts an array of tasks, stringifys them, and saves them in localStorage.
function storeTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}



// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $("<div>").addClass("card").attr("id", task.id);
    const cardBody = $("<div>").addClass("card-body");
    const cardTitle = $("<h5>").addClass("card-title").text(task.name);
    const cardText = $("<p>").addClass("card-text").text(task.description);
    const cardStatus = $("<p>").addClass("card-text").text(task.status);
    const cardPriority = $("<p>").addClass("card-text").text(task.priority);
    const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
    const deleteButton = $("<button>").addClass("btn btn-danger delete").text("Delete");
    deleteButton.on("click", handleDeleteTask);
    cardBody.append(cardTitle, cardText, cardStatus, cardPriority, cardDueDate, deleteButton);
    taskCard.append(cardBody);
    return taskCard;
}

// Sets the card background color based on due date. Card colors are based on the following: past due, due today, due tomorrow. 
function setCardColor(taskCard, dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) {
        taskCard.addClass("bg-danger");
    } else if (due.getDate() === today.getDate()) {
        taskCard.addClass("bg-warning");
    } else if (due.getDate() === today.getDate() + 1) {
        taskCard.addClass("bg-info");
    }
    // Append the card description, card due date, and card delete button to the card body.
    cardBody.append(cardTitle, cardText, cardStatus, cardPriority, cardDueDate, deleteButton);
    // Append the card header and body to the card.
    taskCard.append(cardBody);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // Clear containers for each status lane
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();
    
    // Iterate through each task and append it to the corresponding container
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        // Append the task card to the corresponding container based on task status
        $("#" + task.status + "-cards").append(taskCard);
        taskCard.draggable({
            revert: true,
            helper: "clone"
        });
    });
}


// // Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const task = {
        id: generateTaskId(),
        name: taskName.val(),
        description: taskDescription.val(),
        status: taskStatus.val(),
        priority: taskPriority.val(),
        dueDate: dueDate.val()
    };
    // taskList.push(task); no longer needed
    if (taskList) {
        taskList.push(task);
    } else {
        taskList = [task];
    }
    storeTasks(taskList);
    renderTaskList();
    taskForm[0].reset();
    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).closest(".card").attr("id");
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    storeTasks(taskList);
    renderTaskList();


}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("id");
    const task = taskList.find(task => task.id === parseInt(taskId));
    task.status = $(this).attr("id");
    storeTasks(taskList);
    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // Bind event listener to form submission
    taskForm.on('submit', handleAddTask);
    
    // Bind event listener to delete button clicks
    $(document).on('click', '.delete', handleDeleteTask);
    
    // Render task list when the page is ready
    renderTaskList();
});
