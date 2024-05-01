$(document).ready(function () {
    // Define jQuery selectors for the elements in the HTML
    const timeDisplayEl = $('#time-display');
    const projectFormEl = $('#taskForm');
    const projectNameInputEl = $('#taskName');
    const projectTypeInputEl = $('#taskDescription');
    const projectDateInputEl = $('#taskDueDate');
    const formModalEl = $('#formModal');
    // Helper function to display current time
    function displayTime() {
        const rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
        timeDisplayEl.text(rightNow);
    }
    // Function to read projects from local storage
    function readProjectsFromStorage() {
        let projects = JSON.parse(localStorage.getItem('projects'));
        if (!projects) {
            projects = [];
        }
        return projects;
    }
    // Function to save projects to local storage
    function saveProjectsToStorage(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }
    // Function to create project card
    function createProjectCard(project) {
        // Create card elements
        const taskCard = $('<div>').addClass('card project-card my-3').attr('data-project-id', project.id);
        const cardHeader = $('<div>').addClass('card-header h4').text(project.name);
        const cardBody = $('<div>').addClass('card-body');
        const cardDescription = $('<p>').addClass('card-text').text(project.type);
        const cardDueDate = $('<p>').addClass('card-text').text(project.dueDate);
        const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-project-id', project.id);
        cardDeleteBtn.on('click', handleDeleteProject);
        const today = dayjs();
        const dueDate = dayjs(project.dueDate, 'YYYY-MM-DD');
        const daysDifference = dueDate.diff(today, 'days');
        if (daysDifference < 0) {
            // Task is overdue
            taskCard.addClass('bg-danger');
        } else if (daysDifference === 0) {
            // Task is due today
            taskCard.addClass('bg-warning');
        } else {
            // Task is due in the future
            taskCard.addClass('bg-white');
        }
        // Append elements to card body
        cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
        taskCard.append(cardHeader, cardBody);
        return taskCard;
    }
    // Function to print project data
    function printProjectData() {
        const projects = readProjectsFromStorage();
        // Empty existing project cards out of the lanes
        const todoList = $('#todo-cards');
        todoList.empty();
        const inProgressList = $('#in-progress-cards');
        inProgressList.empty();
        const doneList = $('#done-cards');
        doneList.empty();
        // Loop through projects and create project cards for each status
        for (let project of projects) {
            if (project.status === 'to-do') {
                todoList.append(createProjectCard(project));
            } else if (project.status === 'in-progress') {
                inProgressList.append(createProjectCard(project));
            } else if (project.status === 'done') {
                doneList.append(createProjectCard(project));
            }
        }
        // Call functions to make cards draggable and lanes droppable
        makeCardsDraggable();
        makeLanesDroppable();
    }
    // Function to handle project form submission
    function handleProjectFormSubmit(event) {
        event.preventDefault();
        // Read user input from the form
        const projectName = projectNameInputEl.val().trim();
        const projectType = projectTypeInputEl.val().trim();
        const projectDate = projectDateInputEl.val().trim();
        const newProject = {
            name: projectName,
            type: projectType,
            dueDate: projectDate,
            status: 'to-do',
            id: Date.now().toString() // Unique ID for the project
        };
        // Pull the projects from localStorage and push the new project to the array
        const projects = readProjectsFromStorage();
        projects.push(newProject);
        // Save the updated projects array to localStorage
        saveProjectsToStorage(projects);
        // Print project data back to the screen
        printProjectData();
        // Clear the form inputs
        projectNameInputEl.val('');
        projectTypeInputEl.val('');
        projectDateInputEl.val('');
        // Close the modal
        formModalEl.modal('hide');
    }
    // Function to handle deletion of a project
    function handleDeleteProject() {
        const projectId = $(this).attr('data-project-id');
        const projects = readProjectsFromStorage();
        // Remove project from the array
        const filteredProjects = projects.filter(project => project.id !== projectId);
        // Save the filtered projects to localStorage
        saveProjectsToStorage(filteredProjects);
        // Print projects back to the screen
        printProjectData();
    }
    // Function to handle dropping a project into a lane
    function handleDrop(event, ui) {
        const projects = readProjectsFromStorage();
        const taskId = ui.draggable.attr('data-project-id');
        const newStatus = event.target.id;
    
        // Find the dropped project and update its status
        const droppedProject = projects.find(project => project.id === taskId);
        if (droppedProject) {
            droppedProject.status = newStatus;
    
            // If the dropped project is moved to the "done" lane, remove background color class
            if (newStatus === 'done') {
                ui.draggable.removeClass('bg-danger bg-warning').addClass('bg-white');
            }
        }
        // Save the updated projects to localStorage
        saveProjectsToStorage(projects);
        // Print projects back to the screen
        printProjectData();
    }
    // Function to make cards draggable
    function makeCardsDraggable() {
        $('.project-card').draggable({
            opacity: 0.7,
            zIndex: 100,
            helper: function (e) {
                const original = $(e.target).hasClass('ui-draggable') ? $(e.target) : $(e.target).closest('.ui-draggable');
                return original.clone().css({
                    width: original.outerWidth(),
                });
            },
        });
    }
    // Function to make lanes droppable
    function makeLanesDroppable() {
        $('.lane').droppable({
            accept: '.project-card',
            drop: handleDrop,
        });
    }
    // Event listeners
    projectFormEl.on('submit', handleProjectFormSubmit);
    // Event listener for the "Save changes" button inside the modal
    $('#formModal').on('click', '.btn-primary', function () {
        formModalEl.modal('hide');
    });
    // Call displayTime function once on page load and then every second after that
    displayTime();
    setInterval(displayTime, 1000);
    // Print project data to the screen on page load if there is any
    printProjectData();
    // Initialize date picker
    $('.datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
    });
});
