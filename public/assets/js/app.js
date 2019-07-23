  

  $("#scrape").on("click", function(){
        $.get("/scrape", function(response){
            window.location.reload();
        }); 
    });
  

    $(".change-save").on("click", function(){
        var recipeid = $(this).data("id");


        var savedRecipe = {
            saved: true
        }

        var temp = $(this); 

        $.ajax({
            url: '/recipes/'+recipeid, 
            type: 'PUT', 
            data: savedRecipe
            success: function(result){
                if (result) {
                temp.parent(".uk-card-body").parent().remove();
                }
            }
        }) 

     });