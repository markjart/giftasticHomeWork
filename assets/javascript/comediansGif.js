$( document ).ready(function() {

// Global Variables
// An array of initial comedians, new comedians will be unshift'ed to the front of the array, placing them at the top of the buttons list.
var comedians = [
	//new comedians go here
	"Bill Hicks", 
	"Carol Burnett",
	"Jon Stewart",
	"George Carlin",
	"Steve Martin",
	"Gilda Radner",
	"Richard Pryor",
	"Maria Bamford",
	"Patton Oswalt",
	"Steven Colbert",
	"Brian Posehn",
	"Zach Galifianakis"];

// randomly pull comedian from comedians as var comediansLoad for use with initial queryURL
var comediansLoad = comedians[Math.floor(Math.random() * comedians.length)];
	console.log(comediansLoad);

var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + comediansLoad + "&api_key=n7QqmkGOHtxZLupOSZU5N9vKloQCZVy7&limit=12&offset=10&rating=r";

//Displaying comedian name and calling ajaxGetUrl function using queryURL with comediansLoad on page load.
document.getElementById("ComedianName").innerHTML = comediansLoad;
ajaxGetUrl();

// Functions
// turned ajax call into ajaxGetUrl function for use at page load and in displayGifs function
// Function that displays the gifs for random comedian from comediansLoad.
function ajaxGetUrl() {
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(response) {
        console.log(response);  //console test to make sure something returns
        $("#gifsView").empty(); // erasing this div 
        var results = response.data; //shows results of gifs
        for (var i=0; i<results.length; i++){
            var gifDiv = $("<div>"); //div for the gifs to go inside
            gifDiv.addClass("gifDiv rounded");
			// pulling gif
            var gifImage = $("<img>");
            gifImage.attr("src", results[i].images.fixed_height_still.url); // still image stored into src of image
            gifImage.attr("data-still",results[i].images.fixed_height_still.url); // still image
            gifImage.attr("data-animate",results[i].images.fixed_height.url); // animated image
            gifImage.attr("data-state", "still"); // set the image state
            gifImage.addClass("image");
            gifDiv.append(gifImage);
            // pulling still image of gif
            // adding div of gifs to gifsView div
            $("#gifsView").prepend(gifDiv);
            // pulling title of gif
			var titleLength = results[i].title.length;
			//console.log(titleLength);
			if (titleLength >= 30) {
				var gifTitle = $("<h6>").text("\"" + results[i].title.substring(0,30) + "...\"");
				gifDiv.append(gifTitle);
			}
			else {
				gifTitle = $("<h6>").text("\"" + results[i].title.substring(0,30) + "\"");
				gifDiv.append(gifTitle);
			}
            // pulling rating of gif
            var gifRating = $("<p>").text("Rating: " + results[i].rating);
            gifDiv.append(gifRating);	
        }
    });
}

// Function that displays gif buttons
function displayGifButtons(){
    $("#gifButtonsView").empty(); // erasing anything in this div id so that it doesnt duplicate the results
    for (var i = 0; i < comedians.length; i++){
		var gifButton = $("<button>");
        gifButton.addClass("comedian btn btn-outline-light")
        gifButton.attr("data-name", comedians[i]);
		//gifButton.attr("data-toggle", "tooltip");
		//gifButton.attr("data-placement", "top");
		//gifButton.attr("title", "Click me again to load different Gifs");
        gifButton.text(comedians[i]);
        $("#gifButtonsView").append(gifButton);
    }
}
// Function to add a new comedian button
function addNewButton(){
    $("#addGif").on("click", function(){
    var createComedian = $("#comedianInput").val().trim();
    if (createComedian == ""){
      return false; // added so user cannot add a blank button
    }
    comedians.unshift(createComedian);
    displayGifButtons();
    return false;
    });
}
// Function that displays the gifs
function displayGifs(){
    var comedian = $(this).attr("data-name");
	//randomized the offset between 1 - 50 so clicking same comedian button will generate different gif results
	var randOffset = Math.floor(Math.random() * 50);
    queryURL = "https://api.giphy.com/v1/gifs/search?q=" + comedian + "&api_key=n7QqmkGOHtxZLupOSZU5N9vKloQCZVy7&limit=12&offset=" + randOffset + "&rating=pg-13";
    console.log(queryURL); //displays the constructed url
	ajaxGetUrl();
	document.getElementById("ComedianName").innerHTML = comedian;
}
// Calling Functions & Methods
displayGifButtons(); // displays list of comedians already created
addNewButton();
// Document Event Listeners
$(document).on("click", ".comedian", displayGifs);
$(document).on("click", ".image", function(){
    var state = $(this).attr('data-state');
    if ( state == 'still'){
        $(this).attr('src', $(this).data('animate'));
        $(this).attr('data-state', 'animate');
    }else{
        $(this).attr('src', $(this).data('still'));
        $(this).attr('data-state', 'still');
    }
});
});