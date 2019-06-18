// Google Maps
var map, infoWindow;

// Initialize and add the map
function initMap() {
    //creates map on the screen, using Seattle lat/lng asks user location and takes them there at zoom 12
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 47.6062, lng: 122.3321 },
        zoom: 12
    });
    infoWindow = new google.maps.InfoWindow;

    //if location is accessed, takes the screen to the users location.
    if (navigator.geolocation) {
        console.log('geolocation exists')
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("inside success callback")
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
// if location isnt accessed gives error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

$(function () {
    // Dog Adoption
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
            url: " https://api.petfinder.com/v2/animals?type=dog&limit=8"
        }).then(function (data) {

            var results = data;//store data from ajax request in result var
            var pictureDefault = "https://www.logoground.com/uploads/20172422017-06-034038115happy-cartoon-dog-logo.jpg";
            var pictureToUse = "";
            var dogDescriptionDefault = "N/A";
            var dogDescriptionToUse = "";

            var dogSound = new Audio();
            dogSound.src = "Dog Woof.mp3"


            console.log(data)
            //if theres no image the var pictureDefault will display the default pic
            for (var i = 0; i < results.animals.length; i++) {
                if (results.animals[i].photos.length === 0) {
                    pictureToUse = pictureDefault;

                }
                else {
                    pictureToUse = results.animals[i].photos[0].medium;
                }//if theres no description available, N/A will be display
                if (results.animals[i].description.length === 0) {
                    dogDescriptionToUse = dogDescriptionDefault;
                }
                else {
                    dogDescriptionToUse = results.animals[i].description
                }

                var dogDiv = $(`<div class="card" style="width: 18rem;">`); //creats and store div tag also so that pictures show up next to each other
                var p = $("<p class = name>").text(results.animals[i].name);//creats p tag with rating
                var dogImage = $(`<img class="card-img-top dog-card-photo">`);//creates img tag
                var pawMeButton = $(`<button type="button" class="btn btn-primary dog-button" data-toggle="modal" data-target="#more-info-modal"> Paw Me! Paw Me!</button>`)//creates button tag called paw me that opens modal

                //creates attribute for pawMe button
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

                $('.dog-button').on('click', (e) => {
                    console.log(e)


                    //when you click on the "paw me" button the modal with pop up with the info below.
                    $("#dog-image").attr("src", e.target.attributes.pic.nodeValue)
                    $("#dog-name").text(e.target.attributes.name.nodeValue)
                    $("#dog-breed").html("<b> Breed:  </b>" + e.target.attributes.breeds.nodeValue)
                    $("#dog-gender").html("<b> Gender: </b>" + e.target.attributes.gender.nodeValue)
                    $("#dog-description").html("<b> About Me: </b>" + e.target.attributes.description.nodeValue)
                    $("#dog-link").text(e.target.attributes.src.nodeValue)
                    $("#dog-link").attr("href", e.target.attributes.src.nodeValue)


                })
            }


        })

    })

    // Dog Parks
    // Adding click event listener to all buttons <<TODO Change this to only the Park Button>>
    $(document).on("click", "#park-button", function () {
        // Empty html <div>
        $("#dogParks-appear-here").empty();

        // Performing the AJAX request from Seattle Parks and Recreation; initial ten off leash dog parks  
        $.ajax({
            url: "https://data.seattle.gov/resource/j9km-ydkc.json?feature_desc=Dog Off Leash Area",
            type: "GET",
        }).then(function (data) {
            console.log("data from Seattle Parks", data);

            // Looping through each result item
            for (var i = 0; i < data.length; i++) {

                // Creating and storing a div tag
                var dogParkDiv = $(`<div class="card" style="width: 18rem;">`);

                // Creating a paragraph tag with the result info
                var dogParkInfo = $("<p>").text("Dog Park Info: " + data[i].name + " hours: " + data[i].hours);

                console.log("lat " + data[i].location.latitude);
                console.log("lng " + data[i].location.longitude);

                // Auto generate dog park pins
                var infowindow = new google.maps.InfoWindow({
                    content: data[i].name
                });

                console.log(typeof data[i].location.latitude)
                console.log(typeof data[i].location.longitude)

                var marker = new google.maps.Marker({
                    position: { lat: parseFloat(data[i].location.latitude), lng: parseFloat(data[i].location.longitude) },
                    map: map,
                    title: data[i].name,

                    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                });

                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });

                // Appending the paragraph tag to the dogParkDiv
                dogParkDiv.append(dogParkInfo);

                // Prepending the dogParkDiv to the HTML page 
                $(".add-card").prepend(dogParkDiv);

                // End of for loop
            }
            // End of Seattle Parks AJAX data
        });




        // Northacres Park
        // $.ajax({
        //   url: "https://data.seattle.gov/resource/j9km-ydkc.json?name=Northacres Park",
        //   type: "GET",
        //   // data: {
        //   //   "$limit": 100,
        //   //   "$$app_token": "3R7XyKNOQtmYrrVv2BUjkrWzg"
        //   // }
        // }).done(function (data1) {
        //   console.log("data from Northacres ", data1);

        //   // Creating and storing a div tag
        //   var dogParkDiv = $("<div>");

        //   // Creating a paragraph tag with the result
        //   var dogParkInfo = $("<p>").text("Dog Park Info: " + data1[0].name + ", Location: latitude " +data1[0].location.latitude+ " longitude "+ data1[0].location.latitude+ ", hours: "+ data1[0].hours);

        //   // Appending the paragraph ta1 to the dogParkDiv
        //   dogParkDiv.append(dogParkInfo);

        //   // Prepending the dogParkDiv to the HTML page 
        //   $("#dogParks-appear-here").prepend(dogParkDiv);
        // });

        // Woodland Park
        // $.ajax({
        //   url: "https://data.seattle.gov/resource/j9km-ydkc.json?name=Woodland Park",
        //   type: "GET",
        //   // data: {
        //   //   "$limit": 5000,
        //   //   "$$app_token": "3R7XyKNOQtmYrrVv2BUjkrWzg"
        //   // }
        // }).done(function (data2) {
        //   console.log("data from Woodland ", data2);

        //   // Creating and storing a div tag
        //   var dogParkDiv = $("<div>");

        //   // Creating a paragraph tag with the result
        //   var dogParkInfo = $("<p>").text("Dog Park Info: " + data2[0].name + ", Location: latitude " +data2[0].location.latitude+ " longitude "+ data2[0].location.latitude+ ", hours: "+ data2[0].hours);

        //   // Appending the paragraph ta1 to the dogParkDiv
        //   dogParkDiv.append(dogParkInfo);

        //   // Prepending the dogParkDiv to the HTML page 
        //   $("#dogParks-appear-here").prepend(dogParkDiv);
        // });

        // Regrade Park
        // $.ajax({
        //   url: "https://data.seattle.gov/resource/j9km-ydkc.json?name=Regrade Park",
        //   type: "GET",
        //   // data: {
        //   //   "$limit": 5000,
        //   //   "$$app_token": "3R7XyKNOQtmYrrVv2BUjkrWzg"
        //   // }
        // }).done(function (data3) {
        //   console.log("data from Regarade ", data3);

        //   // Creating and storing a div tag
        //   var dogParkDiv = $("<div>");

        //   // Creating a paragraph tag with the result
        //   var dogParkInfo = $("<p>").text("Dog Park Info: " + data3[0].name + ", Location: latitude " +data3[0].location.latitude+ " longitude "+ data3[0].location.latitude+ ", hours: "+ data3[0].hours);

        //   // Appending the paragraph ta1 to the dogParkDiv
        //   dogParkDiv.append(dogParkInfo);

        //   // Prepending the dogParkDiv to the HTML page 
        //   $("#dogParks-appear-here").prepend(dogParkDiv);
        // });

        // Magnolia Park
        // $.ajax({
        //   url: "https://data.seattle.gov/resource/j9km-ydkc.json?name=Magnolia Park",
        //   type: "GET",
        //   // data: {
        //   //   "$limit": 5000,
        //   //   "$$app_token": "3R7XyKNOQtmYrrVv2BUjkrWzg"
        //   // }
        // }).done(function (data4) {
        //   console.log("data from Magnolia ", data4);

        //   // Creating and storing a div tag
        //   var dogParkDiv = $("<div>");

        //   // Creating a paragraph tag with the result
        //   var dogParkInfo = $("<p>").text("Dog Park Info: " + data4[0].name + ", Location: latitude " +data4[0].location.latitude+ " longitude "+ data4[0].location.latitude+ ", hours: "+ data4[0].hours);

        //   // Appending the paragraph ta1 to the dogParkDiv
        //   dogParkDiv.append(dogParkInfo);

        //   // Prepending the dogParkDiv to the HTML page 
        //   $("#dogParks-appear-here").prepend(dogParkDiv);
        // });




        // End of onclick function
    })
    // End of document ready function
})
