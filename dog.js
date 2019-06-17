$.ajax({
    method: "POST",
    url: "https://api.petfinder.com/v2/oauth2/token",
    data: {
        grant_type: "client_credentials",
        client_id: "wCs60AHgyCrbWG1krL41opIHyPlrhUFLsQNWwLz8k5rmzRrEGg",
        client_secret: "7zyl5VWLecLoxMkrHsqtcZJjfWE0OTdaggVNxLFC"
    }
}).then(function (response) {
    var accessToken = response.access_token
    $.ajax({
        method: "GET",
        headers: {
            Authorization: "Bearer " + accessToken,
        },
        url: " https://api.petfinder.com/v2/animals?type=dog&limit=4"
    }).then(function (data) {

        var results = data;//store data from ajax request in result var
        var pictureDefault = "https://www.logoground.com/uploads/20172422017-06-034038115happy-cartoon-dog-logo.jpg"
        var photoToUse=""
        var dogDescriptionDefault = "N/A"
        var dogDescriptionToUse = ""
        var dogSound = new Audio();
        dogSound.src = "Dog Woof.mp3"
      

        console.log(data)
        //if theres no image the var pictureDefault will display the default pic
        for (var i = 0; i < results.animals.length; i++) {
            if(results.animals[i].photos.length === 0){
                pictureToUse = pictureDefault;
                
            }
            else{
                pictureToUse = results.animals[i].photos[0].medium;
            }//if theres no description available, N/A will be display
            if(results.animals[i].description.length ===0){
                dogDescriptionToUse = dogDescriptionDefault;
            }
            else{
                dogDescriptionToUse = results.animals[i].description
            }

            var dogDiv = $(`<div class="card" style="width: 18rem;">`); //creats and store div tag also so that pictures show up next to each other
            var p = $("<p class = name>").text(results.animals[i].name);//creats p tag with rating
            var dogImage = $(`<img class="card-img-top dog-card-photo">`);//creates img tag
            var pawMeButton = $(`<button type="button" class="btn btn-primary dog-button" data-toggle="modal" data-target="#more-info-modal"> Paw Me! Paw Me!</button>`)//creates button tag called paw me that opens modal
            
            //creates attribute for Paw M button
            pawMeButton.attr("pic", pictureToUse);
            pawMeButton.attr("name", results.animals[i].name);
            pawMeButton.attr("breeds", results.animals[i].breeds.primary);
            pawMeButton.attr("gender", results.animals[i].gender);
            pawMeButton.attr("description", results.animals[i].description);
            pawMeButton.attr("src", results.animals[i].url);
            

            dogImage.attr("src", pictureToUse);
            //adds paragraph and image tag to dogDiv
            dogDiv.append(dogImage);
            dogDiv.append(p);
            dogDiv.append(pawMeButton);//adds button to dogDiv
            $("#dog-gallery-container").prepend(dogDiv);//adds the dogDiv (div class) before the p tag

            $('.dog-button').on('click', (e) =>{
                console.log(e)
                
    
            //when you click on the "paw me" button the modal with pop up with the info below.
            $("#dog-image").attr("src",e.target.attributes.pic.nodeValue)
            $("#dog-name").text(e.target.attributes.name.nodeValue)
            $("#dog-breed").html("<b> Breed:  </b>"+ e.target.attributes.breeds.nodeValue)
            $("#dog-gender").html("<b> Gender: </b>" + e.target.attributes.gender.nodeValue)
            $("#dog-description").html("<b> About Me: </b>" + e.target.attributes.description.nodeValue)
            $("#dog-link").text(e.target.attributes.src.nodeValue)
            $("#dog-link").attr("href", e.target.attributes.src.nodeValue)
           

            })
        }

   
    })

})