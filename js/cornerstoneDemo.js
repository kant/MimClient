// Load in HTML templates

var viewportTemplate; // the viewport template
loadTemplate("templates/viewport.html", function(element) {
    viewportTemplate = element;
});

var studyViewerTemplate; // the study viewer template
loadTemplate("templates/studyViewer.html", function(element) {
    studyViewerTemplate = element;
});

// Get study list from JSON manifest
loadXnatPatientList(function(data) {
  data.subjectList.forEach(function(subject) {

    // Create one table row for each study in the manifest
    var studyRow = '<tr><td>' +
    subject.xnatProject + '</td><td>' +
    subject.subjectName + '</td><td>' +
    subject.xnatInsertDate + '</td><td>' +
    '</tr>';

    // Append the row to the study list
    var studyRowElement = $(studyRow).appendTo('#studyListData');

    // On study list row click
    $(studyRowElement).click(function() {

      // Add new tab for this study and switch to it
      var studyTab = '<li><a href="#x' + subject.subjectXnatID + '" data-toggle="tab">' + subject.subjectName + '</a></li>';
      $('#tabs').append(studyTab);

      // Add tab content by making a copy of the studyViewerTemplate element
      var studyViewerCopy = studyViewerTemplate.clone();

      /*var viewportCopy = viewportTemplate.clone();
      studyViewerCopy.find('.imageViewer').append(viewportCopy);*/


      studyViewerCopy.attr("id", 'x' + subject.subjectXnatID);
      // Make the viewer visible
      studyViewerCopy.removeClass('hidden');
      // Add section to the tab content
      studyViewerCopy.appendTo('#tabContent');

      // Show the new tab (which will be the last one since it was just added
      $('#tabs a:last').tab('show');

      // Toggle window resize (?)
      $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        $(window).trigger('resize');
      });

      // Now load the subject data
      loadSubject(studyViewerCopy, viewportTemplate, subject);
    });
  });
});


// Show tabs on click
$('#tabs a').click (function(e) {
  e.preventDefault();
  $(this).tab('show');
});

// Resize main
function resizeMain() {
  var height = $(window).height();
  $('#main').height(height - 50);
  $('#tabContent').height(height - 50 - 42);
}


// Call resize main on window resize
$(window).resize(function() {
    resizeMain();
});
resizeMain();


// Prevent scrolling on iOS
document.body.addEventListener('touchmove', function(e) {
  e.preventDefault();
});
