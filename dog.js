
// Google Maps
var map, infoWindow;

// Initialize and add the map
function initMap() {
    //creates map on the screen using Seattle lat/lng; asks user location and takes them there at zoom 12
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 47.6062, lng: -122.3321 },
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

// if location isn't accessed gives error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
} // End of map function

// Document ready function
$(document).ready(function () {
    $('#map').hide();
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


                var dogDiv = $(`<div class="card dog-card" style="width: 18rem;" >`); //creats and store div tag also so that pictures show up next to each other
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
                    var DogSound = new Audio("./assets/Images & Sound/DogWoof.mp3");
                    $('.dog-button').click(e => DogSound.play());
                })


            }
        })
    });

    // Dog Parks
    // Adding click event listener to all buttons 
    $(document).on("click", "#park-button", function () {

        // Empty html <div>
        $(".add-card").empty();

        // Performing the AJAX request from Seattle Parks and Recreation; initial ten off leash dog parks  
        $.ajax({
            url: "https://data.seattle.gov/resource/j9km-ydkc.json?feature_desc=Dog Off Leash Area",
            type: "GET",
        }).then(function (data) {
            console.log("data from Seattle Parks", data);

            // Creating the map markers
            for (var i = 0; i < data.length; i++) {

                // console.log(typeof data[i].location.latitude)
                // console.log(typeof data[i].location.longitude)

                // TODO modify label
                // var infowindow = new google.maps.InfoWindow({
                //     content: data[i].name
                // });

                // Add 10 dog park markers to map
                var marker = new google.maps.Marker({
                    position: { lat: parseFloat(data[i].location.latitude), lng: parseFloat(data[i].location.longitude) },
                    map: map,
                    title: data[i].name,
                    icon: 'https://lh3.googleusercontent.com/SSfWxjRchUV8ODwecknrfaOv7DmaZy6Kw7zH-z_GlHSOyUQjFeP_LB4aIT5FTEJuIDs=s40-rw'
                });

                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });

            } // End of for loop

            // Creating 6 cards
            for (var i = 0; i < 6; i++) {

                // Creating and storing a div tag
                var dogParkDiv = $(`<div class="card text-center" style="width: 18rem;">`);

                // Creating a paragraph tag with the result info
                var dogParkInfo = $("<p>").html("<br> <h4>" + data[i].name + "</h4>" + "<h6> <b> <br>" + " Hours: " + "</b> " + data[i].hours + " </h6>");

                // Appending the paragraph tag to the dogParkDiv
                dogParkDiv.append(dogParkInfo);

                // Prepending the dogParkDiv to the HTML page 
                $(".add-card").prepend(dogParkDiv);
            }

        }); // End of Seattle Parks AJAX data

        // Performing the AJAX request from Seattle Parks and Recreation for Northacres Park
        $.ajax({
            url: "https://data.seattle.gov/resource/j9km-ydkc.json?name=Northacres Park",
            type: "GET",
        }).then(function (data1) {
            console.log("data from Northacres ", data1);

            var marker = new google.maps.Marker({
                position: { lat: parseFloat(data1[0].location.latitude), lng: parseFloat(data1[0].location.longitude) },
                map: map,
                title: data1[0].name,
                icon: 'https://lh3.googleusercontent.com/SSfWxjRchUV8ODwecknrfaOv7DmaZy6Kw7zH-z_GlHSOyUQjFeP_LB4aIT5FTEJuIDs=s40-rw'
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        });

        // Performing the AJAX request from Seattle Parks and Recreation for Woodland Park
        $.ajax({
            url: "https://data.seattle.gov/resource/j9km-ydkc.json?name=Woodland Park",
            type: "GET",
        }).then(function (data2) {
            console.log("data from Woodland ", data2);

            var marker = new google.maps.Marker({
                position: { lat: parseFloat(data2[0].location.latitude), lng: parseFloat(data2[0].location.longitude) },
                map: map,
                title: data2[0].name,
                icon: 'https://lh3.googleusercontent.com/SSfWxjRchUV8ODwecknrfaOv7DmaZy6Kw7zH-z_GlHSOyUQjFeP_LB4aIT5FTEJuIDs=s40-rw'
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        });

        // Performing the AJAX request from Seattle Parks and Recreation for Regrade Park
        $.ajax({
            url: "https://data.seattle.gov/resource/j9km-ydkc.json?name=Regrade Park",
            type: "GET",
        }).then(function (data3) {
            console.log("data from Regarade ", data3);

            var marker = new google.maps.Marker({
                position: { lat: parseFloat(data3[0].location.latitude), lng: parseFloat(data3[0].location.longitude) },
                map: map,
                title: data3[0].name,
                icon: 'https://lh3.googleusercontent.com/SSfWxjRchUV8ODwecknrfaOv7DmaZy6Kw7zH-z_GlHSOyUQjFeP_LB4aIT5FTEJuIDs=s40-rw'
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        });

        // Performing the AJAX request from Seattle Parks and Recreation for Magnolia Park
        $.ajax({
            url: "https://data.seattle.gov/resource/j9km-ydkc.json?name=Magnolia Park",
            type: "GET",
        }).then(function (data4) {
            console.log("data from Magnolia ", data4);

            var marker = new google.maps.Marker({
                position: { lat: parseFloat(data4[0].location.latitude), lng: parseFloat(data4[0].location.longitude) },
                map: map,
                title: data4[0].name,
                icon: 'https://lh3.googleusercontent.com/SSfWxjRchUV8ODwecknrfaOv7DmaZy6Kw7zH-z_GlHSOyUQjFeP_LB4aIT5FTEJuIDs=s40-rw'
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        });

    }) // End of on click dog park function


    // Dog Friendly Restaurants 
    $("#rest-button").on("click", function (event) {
        event.preventDefault();
        $(".add-card").empty();

        var settings = {
            "async": true,
            "crossDomain": true,
            // "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=dog+restaurant&location=bellevue,WA",
            "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term='dog+friendly'+restaurants&latitude=47.589982&longitude=-122.297814",
            "method": "GET",
            "headers": {
                // "accept": "application/json",
                // "Access-Control-Allow-Origin": "*",
                "Authorization": "Bearer SDAEnMNqSOPl9_I9468qC_1PDuSvS67-h-HCkR6lPtwoYMA1bqU1yVT5pP1SUh_Cr3j4GucEh32EuhxxdUXZn7vBtrJ7V7zaD3ZgWmFIxsIDR0B3BY9ix3QxmeyLXHYx",
                "cache-control": "no-cache",

            }
        }
        $.ajax(settings).then(function (response) {

            var bizName = [];
            var bizLong = [];
            var bizLat = [];
            var bizAddressStreet = []
            var bizAddressState = [];
            var bizRating = [];
            var bizPrice = [];
            var bizUrl = [];
            var bizPhone = [];
            var restDiv = [];
            var p = [];

            console.log(response);

            for (i = 0; i < 6; i++) {

                bizName[i] = response.businesses[i].name;
                bizLong[i] = response.businesses[i].coordinates.longitude;
                bizLat[i] = response.businesses[i].coordinates.latitude;
                bizAddressStreet[i] = response.businesses[i].location.display_address[0];
                bizAddressState[i] = response.businesses[i].location.display_address[1];
                bizRating[i] = response.businesses[i].rating;
                bizPrice[i] = response.businesses[i].price;
                bizUrl[i] = response.businesses[i].url;
                bizPhone[i] = response.businesses[i].display_phone;

                restDiv = $(`<div class="card text-center">`); //creats and store div tag also so that pictures show up next to each other
                p = $(`<div class=".card${i}"-title" style="width: 18rem;">`).html('<h4><a href="' + bizUrl[i] + '">' + bizName[i] + '</a></h4>' + bizAddressStreet[i] + '<br>' + bizAddressState[i] + '<p>' + bizPhone[i] + '</p><p>' + 'Rating:' + bizRating[i] + '</p><p>' + 'Price:' + bizPrice[i] + '</p>');//creats p tag with rating

                restDiv.append(p);

                $(".add-card").append(restDiv);//adds the dogDiv (div class) before the p tag

                console.log(typeof(bizLong[i]));
                console.log(bizLong[i]);
                console.log(bizLat[i]);


                // Add dog friendly restaurant markers to map
                var markerRest = new google.maps.Marker({
                    position: { lat: bizLat[i], lng: bizLong[i] },
                    map: map,
                    title: bizName[i],
                    icon: 'https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1577-food-fork-knife_4x.png&highlight=ff000000,f57c00,ff000000&scale=1.0'
                });

                markerRest.addListener('click', function () {
                    infowindow.open(map, markerRest);
                });


            }
        });
        // End of on click button for restaurants
    });
    // End of document ready function
})
$('.btn').click(function () {
    $('#carouselExampleIndicators').hide();
    $('#map').show();
    // document.getElementById('#map').style.display = "block";
});