  

  $(document).on("click", ".scrape", function(){
        $.get("/scrape", function(response){
            window.location.reload();
        }); 
    });


  // $(document).on("click", "#scrapefit", function(){
  //       $.get("/scrapefit", function(response){
  //           window.location.reload();
  //       }); 
  //   });




    $(document).on("click", ".change-save", function(){
        var recipeid = $(this).data("id");


        var savedRecipe = {
            saved: true
        }

        var temp = $(this); 
        console.log(temp);

        $.ajax({
            url: '/recipes/'+recipeid, 
            type: 'PUT', 
            data: savedRecipe,
            success: function(result){
                if (result) {
                temp.parent(".uk-card-body").parent().remove();
                }
            }
        }) 

     });


    $(document).on("click", "#saved", function(){
        $.get("/scrape", function(response){
            window.location.reload();
        }); 
    });

     $(document).on("click", ".delete-save", function(){
        var recipeid = $(this).data("id");


        var savedRecipe = {
            saved: false
        }

        var temp = $(this); 
        console.log(temp);

        $.ajax({
            url: '/recipes/'+recipeid, 
            type: 'PUT', 
            data: savedRecipe,
            success: function(result){
                if (result) {
                temp.parent(".uk-card-body").parent().remove();
                }
            }
        }) 

     });



     $(document).on("click", ".updateNote", function(e){

        e.preventDefault();

        var recipeID = $(this).data("id");
       
        var note = {
            title: $("#title").val().trim(),
            body: $("#body").val().trim()
        }
       $.post("/recipes/"+recipeID, note, function(response){
           console.log(response);

           $("#title").val("");
           $("#body").val("");
           window.location.reload();
       })
    })


    $(document).on("click", ".deleteNote", function(e){

            e.preventDefault();

            var recipeID = $(this).attr("recipeId");
            var noteID = $(this).attr("noteId");
            console.log(noteID["title"]);
            console.log(recipeID);
           
            var note = {
                title: "",
                body: ""
            }

           window.location.reload();

           // $.post("/recipes/"+recipeID, note, function(response){
           //     console.log(response);
           //      $("#title").val("");
           //      $("#body").val("");

           //     // $("#modal-sections").load("http://localhost:8080/saved" + " #modal-sections");
           //     // UIkit.modal("#modal-sections").hide();
           //     // UIkit.modal("#modal-sections").show();
           //     window.location.reload();
           // })
        })












