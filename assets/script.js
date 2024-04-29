// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// If there are no tasks in localStorage, set taskList to an empty array
if (!taskList) {
    taskList = [];
}

// If there is no nextId in localStorage, set nextId to 1
if (!nextId) {
    nextId = 1;
}




// Todo: create a function to generate a unique task id based on the nextId and increment the nextId in localStorage for the next task 
function generateTaskId() {
    let taskId = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return taskId;
}

// Todo: create a function to create a task card based on the task object passed in and return the card 
function createTaskCard(task) {
    // Create a new card element
    let card = $("<div>").addClass("task-card");

    // Create the card content
    let title = $("<h3>").text(task.title);
    let description = $("<p>").text(task.description);
    let dueDate = $("<p>").text("Due Date: " + task.dueDate);

    // Append the content to the card
    card.append(title, description, dueDate);

    // Return the card
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    // event.preventDefault();
    // Get the task details from the form
    let title = $("#title").val();
    let description = $("#description").val();
    let dueDate = $("#due-date").val();
    // Generate a unique task id
    let taskId = generateTaskId();
    // Create a task object
    let task = {
        id: taskId,
        title: title,
        description: description,
        dueDate: dueDate
    };
    // Add the task to the task list
    taskList.push(task);
    // Save the updated task list to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    // Create a task card and append it to the task list
    let card = createTaskCard(task);
    $("#task-list").append(card);
    // Clear the form fields
    $("#title").val("");
    $("#description").val("");
    $("#due-date").val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
