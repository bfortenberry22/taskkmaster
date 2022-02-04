var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//EDIT THE TASKS
//.list-group refers to the parent, so all the children will take this
$(".list-group").on("click", "p", function(){ 
  var text = $(this)//this refers to the <p> that has been clicked
  .text()//gets the text from p
  .trim();//trims the white space from beginning and end of text
  //create an edit box
  var textInput = $("<textarea>")//tells jQuery to create a new <textarea> element
    .addClass("form-control")
    .val(text);
  //replace with new
  $(this).replaceWith(textInput);//replaces the old text with the new text
  textInput.trigger("focus");
});

$(".list-group").on("blur", "textarea", function(){
  //get the textarea's current value/text
  var text = $(this)
  .val()
  .trim();
  //get the parent ul's id attribute
  var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");
  //get the task's position in the list of other li elements
  var index = $(this)
  .closest(".list-group-item")
  .index();
  //replaces and saves
  tasks[status][index].text = text;
  saveTasks();

  //recreates p element
  var taskP = $("<p>")
  .addClass("m-1")
  .text(text);
  //replace text area with p element
  $(this).replaceWith(taskP);

});

//EDIT THE DUE DATES
//due date was clicked
$(".list-group").on("click", "span", function(){
  //get current text
  var date = $(this)
    .text()
    .trim();
  //create new input element
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);
  //swap out the elements
  $(this).replaceWith(dateInput);

  //automatically focus on new element
  dateInput.trigger("focus");
});

//value of due date was changed
$(".list-group").on("blur","input[type='text']", function(){
  //get current text
  var date = $(this)
    .val()
    .trim();

  //get parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  //get the task's position in the list of the other li elements
  var index = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  //update task in arrea and re-save to local storage
  tasks[status][index].date = date;
  saveTasks();

  //recreate the span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  //replace input with span element
  $(this).replaceWith(taskSpan);
});


// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


