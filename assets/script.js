// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// dayjs().format();

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
    
    
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskCard = $("<div>").addClass("card").attr("id", task.id);
    let taskCardHeader = $("<div>").addClass("card-header").text(task.title);
    let taskCardBody = $("<div>").addClass("card-body");
    let taskCardFooter = $("<div>").addClass("card-footer").text(task.dueDate);
    taskCard.append(taskCardHeader, taskCardBody, taskCardFooter);
    return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $( function() {
        $( "#draggable" ).draggable();
    } );
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let taskTitle = $("#task-title").val();
    let taskDescription = $("#task-description").val();
    let taskDueDate = $("#task-due-date").val();
    let taskStatus = $("#task-status").val();
    let newTask = {
        id: generateTaskId(),
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        status: taskStatus
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $("#add-task-form").trigger("reset");

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(event.target).closest(".card").attr("id");
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();


}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id");
    let newStatus = $(event.target).attr("id");
    let task = taskList.find(task => task.id === parseInt(taskId));
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#add-task-form").on("submit", handleAddTask);
    $("#task-list").on("click", ".delete-task", handleDeleteTask);
    $(".lane").droppable({
        drop: handleDrop
    });
    $("#task-due-date").datepicker();

});
