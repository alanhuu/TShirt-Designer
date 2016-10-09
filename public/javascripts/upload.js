// Canvas dimensions as constants.
var CANVAS_WIDTH = 750;
var CANVAS_HEIGHT = 600;

// Array to keep track of the history.
var state = [];
var mods = 0;


function putImageOnCanvas(url, isUserAdded = true) {
  fabric.Image.fromURL(url, function(oImg) {
      var imageWidth = isUserAdded ? canvas.getWidth() * 0.35 : canvas.getWidth() * 0.9;
      oImg.scaleToWidth(imageWidth);

      // Adds image to canvas.
      canvas.add(oImg);

      canvas.centerObject(oImg);
      // Need this line, or else the new image cannot be edited.
      oImg.setCoords();
      if(isUserAdded) {
        canvas.setActiveObject(oImg);
      }
      canvas.renderAll();
      updateModifications(true);
      canvas.counter++;
  });
}

function setTshirtImage(url) {
  var center = canvas.getCenter();
  canvas.setBackgroundImage(url, canvas.renderAll.bind(canvas), {
    backgroundImageOpacity: 1,
    backgroundImageStretch: false,
    scaleX:0.65,
    scaleY:0.65,
    top: center.top,
    left: center.left,
    originX: 'center',
    originY: 'center'
});
    canvas.renderAll();
}

// Canvas initialization.
var canvas = new fabric.Canvas('canvas');
var whiteShirtUrl = "/public/art/shirt-white.jpg";

canvas.setWidth(CANVAS_WIDTH);
canvas.setHeight(CANVAS_HEIGHT);

setTshirtImage(whiteShirtUrl);


// Menu button listeners.
$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('.upload').on('click', function (){
  $('#text-area').hide();
  $('#load-saved-design').hide();

  $('.menuArrow').show();
  $('#uploads').show();
  $("#uploads").css("display", "inline-block");
});

$('.text-insert').on('click', function (){
  $('#uploads').hide();
  $('#load-saved-design').hide();

  $('.menuArrow').show();
  $('#text-area').show();
  $("#text-area").css("display", "inline-block");
});


$('.load-saved').on('click', function(){
  $('#uploads').hide();
  $('#text-area').hide();

  $('.menuArrow').show();
  $('#load-saved-design').show();
  $("#load-saved-design").css("display", "inline-block");

});

// Listener for the load design function.
$('#load-button').on('click', function(){
    $.ajax({
      url: '/load',
      type: 'POST',
      data: {"value": $('#load-id-input').val()},
      success: function(data){
        // Show the relevant notifications for load success/failure.
        if(data == 'undefined') {
          sweetAlert({
            title: "Id does not exist!",
            type: "warning"});
        } else {
          sweetAlert({
            title: "Load Success!",
            type: "success"});
          console.log('Load successful!\n');
          canvas.clear().renderAll();

          canvas.loadFromJSON(data);
          setTshirtImage(whiteShirtUrl);

          canvas.renderAll();
        }

      }
    });
});

// Listener for the insert text button.
$('#text-button').on('click', function () {
  // Make sure the text field is centered when inserted.
  var center = canvas.getCenter();
  var newTextBox = new fabric.IText('Click here to edit text!', { 
    fontFamily: 'arial black',
    scaleX:0.60,
    scaleY:0.60,
    top: center.top,
    left: center.left,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(newTextBox);
  canvas.setActiveObject(newTextBox);
  canvas.renderAll();
  updateModifications(true);
  canvas.counter++;
});


// Listeners for the text box menu.
$('#text-color').on('change', function() {
        canvas.getActiveObject().setFill(this.value);
        canvas.renderAll();
        updateModifications(true);
        canvas.counter++;
});

$('#text-bg-color').on('change', function() {
        canvas.getActiveObject().setBackgroundColor(this.value);
        canvas.renderAll();
        updateModifications(true);
        canvas.counter++;
});

$('#text-lines-bg-color').on('change', function() {
        canvas.getActiveObject().setTextBackgroundColor(this.value);
        canvas.renderAll();
        updateModifications(true);
        canvas.counter++;
});

$('#text-stroke-color').on('change', function() {
        canvas.getActiveObject().setStroke(this.value);
        canvas.renderAll();
        updateModifications(true);
        canvas.counter++;
});

$('#text-stroke-width').on('change', function() {
        canvas.getActiveObject().setStrokeWidth(this.value);
        canvas.renderAll();
        updateModifications(true);
        canvas.counter++;
});      

$('#font-family').on('change', function() {
        canvas.getActiveObject().setFontFamily(this.value);
        canvas.renderAll();
        updateModifications(true);
        canvas.counter++;
});

$('#text-font-size').on('change', function() {
        canvas.getActiveObject().setFontSize(this.value);
        canvas.renderAll();
        updateModifications(true);
        canvas.counter++;
});

$('#text-line-height').on('change', function() {
        canvas.getActiveObject().setLineHeight(this.value);
        canvas.renderAll();
        updateModifications(true);
        canvas.counter++;
});

$('#text-align').on('change', function() {
        canvas.getActiveObject().setTextAlign(this.value);
        canvas.renderAll();
        updateModifications(true);
        canvas.counter++;
});
    
// Text style radio button handler.
radios5 = document.getElementsByName("fonttype");
for(var i = 0, max = radios5.length; i < max; i++) {
    radios5[i].onclick = function() {

      if(document.getElementById(this.id).checked == true) {
          if(this.id == "text-cmd-bold") {
              canvas.getActiveObject().set("fontWeight", "bold");
          }
          if(this.id == "text-cmd-italic") {
              canvas.getActiveObject().set("fontStyle", "italic");
          }
          if(this.id == "text-cmd-underline") {
              canvas.getActiveObject().set("textDecoration", "underline");
          }
        if(this.id == "text-cmd-linethrough") {
              canvas.getActiveObject().set("textDecoration", "line-through");
        }
        if(this.id == "text-cmd-overline") {
            canvas.getActiveObject().set("textDecoration", "overline");
        }   
              
      } else {
          if(this.id == "text-cmd-bold") {
              canvas.getActiveObject().set("fontWeight", "");
          }
          if(this.id == "text-cmd-italic") {
              canvas.getActiveObject().set("fontStyle", "");
          }  
          if(this.id == "text-cmd-underline") {
              canvas.getActiveObject().set("textDecoration", "");
          }
          if(this.id == "text-cmd-linethrough") {
              canvas.getActiveObject().set("textDecoration", "");
          }  
          if(this.id == "text-cmd-overline") {
              canvas.getActiveObject().set("textDecoration", "");
          }
      }
      updateModifications(true);
      canvas.counter++;
        
        
      canvas.renderAll();
    }
}



$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  var uploadImageUrl = "";
  var uploadUrlPrefix = "uploads/";
  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);

      uploadImageUrl = uploadUrlPrefix + file.name;

    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          sweetAlert({
            title: "Upload Success!",
            type: "success"});
          console.log('Upload successful!\n' + data);
          console.log(data);
          putImageOnCanvas(uploadImageUrl);

      },
      xhr: function() {
        // Create an XMLHttpRequest.
        var xhr = new XMLHttpRequest();

        // Listen to the 'progress' event.
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // Calculate the percentage of upload completed.
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // Update the Bootstrap progress bar with the new percentage.
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // Once the upload reaches 100%, set the progress bar text to done.
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});

$('#save-button').on('click', function() {
  console.log("STRINGIFY:");
  console.log(JSON.stringify(canvas));
    $.ajax({
      url: '/save',
      type: 'POST',
      data: {"value":JSON.stringify(canvas).toString()},
      success: function(data){
          console.log('Save successful!\n');
          sweetAlert({
            title: "Save success! Your id is  " + data,
            type: "success"});

      }
    });
});


// Handling editing history.
canvas.on(
    'object:modified', function () {
    updateModifications(true);
},
    'object:added', function () {
    updateModifications(true);
});

function updateModifications(savehistory) {
    if (savehistory === true) {
        myjson = JSON.stringify(canvas);
        state.push(myjson);
    }
}

$('#undo-button').on('click', function undo() {
    var stateNum = state.length - 1 - mods - 1;

    if (mods < state.length) {
        canvas.clear().renderAll();

        canvas.loadFromJSON(state[stateNum]);
        setTshirtImage(whiteShirtUrl);

        canvas.renderAll();

        mods++;

    }
});

$('#redo-button').on('click', function redo() {

    if (mods > 0) {
        canvas.clear().renderAll();
        canvas.loadFromJSON(state[state.length - 1 - mods + 1]);
        setTshirtImage(whiteShirtUrl);
        canvas.renderAll();

        mods--;

    }
});


