$(document).ready(function () {
    const timeDisplayEl = $('#time-display');
    const projectFormEl = $('#taskForm');
    const projectNameInputEl = $('#taskName');
    const projectTypeInputEl = $('#taskDescription');
    const projectDateInputEl = $('#taskDueDate');
    const formModalEl = $('#formModal');
    const todoList = $('#todo-cards');
    const inProgressList = $('#in-progress-cards');
    const doneList = $('#done-cards');

    
    // Function to read projects from local storage
    function readProjectsFromStorage() {
        return JSON.parse(localStorage.getItem('projects')) || [];
    }

    // Function to save projects to local storage
    function saveProjectsToStorage(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    // Function to create project card
    function createProjectCard(project) {
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
        taskCard.addClass(daysDifference < 0 ? 'bg-danger' : (daysDifference === 0 ? 'bg-warning' : 'bg-white'));
        cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
        taskCard.append(cardHeader, cardBody);
        return taskCard;
    }

    // Function to print project data
    function printProjectData() {
        const projects = readProjectsFromStorage();
        todoList.empty();
        inProgressList.empty();
        doneList.empty();

        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            const targetList = (project.status === 'to-do') ? todoList : ((project.status === 'in-progress') ? inProgressList : doneList);
            targetList.append(projectCard);
        });

        makeCardsDraggable();
        makeLanesDroppable();
    }

    // Function to handle project form submission
    function handleProjectFormSubmit(event) {
        event.preventDefault();
        const projectName = projectNameInputEl.val().trim();
        const projectType = projectTypeInputEl.val().trim();
        const projectDate = projectDateInputEl.val().trim();
        const newProject = {
            name: projectName,
            type: projectType,
            dueDate: projectDate,
            status: 'to-do',
            id: Date.now().toString()
        };
        const projects = readProjectsFromStorage();
        projects.push(newProject);
        saveProjectsToStorage(projects);
        printProjectData();
        projectNameInputEl.val('');
        projectTypeInputEl.val('');
        projectDateInputEl.val('');
        formModalEl.modal('hide');
    }

    // Function to handle deletion of a project
    function handleDeleteProject() {
        const projectId = $(this).attr('data-project-id');
        const projects = readProjectsFromStorage();
        const filteredProjects = projects.filter(project => project.id !== projectId);
        saveProjectsToStorage(filteredProjects);
        printProjectData();
    }

    // Function to handle dropping a project into a lane
    function handleDrop(event, ui) {
        const taskId = ui.draggable.attr('data-project-id');
        const newStatus = event.target.id;
        const projects = readProjectsFromStorage();
        const droppedProject = projects.find(project => project.id === taskId);
        if (droppedProject) {
            droppedProject.status = newStatus;
            ui.draggable.css('background-color', newStatus === 'done' ? 'white' : '');
            saveProjectsToStorage(projects);
        }
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
