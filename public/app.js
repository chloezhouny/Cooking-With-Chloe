$(function() {
  $(".change-save").on("click", function(event) {
    var id = $(this).data("id");
    var saved = $(this).data("saved");

    var newSavedState = {
      saved: true
    };

    // Send the PUT request.
    $.ajax("/recipes/" + id, {
      type: "PUT",
      data: newSavedState
    }).then(
      function() {
        console.log("changed save to", saved);
        location.reload();
      }
    );
  });
