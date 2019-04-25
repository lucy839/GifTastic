// global variables
var topics = ["cat", "dog", "rabbit", "frog", "otter"];
var offSet;
var topic;
var favImgCount = 0;
if(localStorage.length != 0)
{
    favImgCount += localStorage.length + 1;
}

$(document).ready(function () {
    // when we put something into "giphy-input" and click "add-giphy" button, value entered will be pushed to topics array
    $("#add-giphy").on("click", function (event) {
        event.preventDefault();
        var newTopic = $("#giphy-input").val();
        if (newTopic !== "") {
            topics.push(newTopic);
            renderButtons();
            $("#giphy-input").val("");
        }
    });

    // make buttons when it is called using topics array
    function renderButtons() {
        $("#buttons-view").empty();
        for (var i = 0; i < topics.length; i++) {
            var giphyBtn = $("<button>");
            giphyBtn.addClass("giphy-btn");
            giphyBtn.attr("data-name", topics[i]);
            giphyBtn.attr("offsetNum", 0);
            giphyBtn.text(topics[i]);
            $("#buttons-view").append(giphyBtn);
        }
        // After button is made...when the button is clicked, 10 giphy images are loaded at a time
        $(".giphy-btn").on("click", function () {
            topic = $(this).attr("data-name");
            offSet = $(this).attr("offsetNum");
            displayGiphy();
            // offsetNum will increase by 10, so when it is clicked again, next 10 images can be loaded 
            $(this).attr("offsetNum", offSet += 10);
        });
    }

    // load giphy images when it is called using ajax method
    function displayGiphy() {
        // if is first time loading that topic's image, empty out the display section, we can find out this by offSet number
        if (offSet < 1) {
            $("#display").empty();
        }
        var mykey = config.MY_KEY;
        var secretkey = config.SECRET_KEY;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=2JAm3dCYilKMooS1kOwyy0LMuCRKUzK7&offset=" + offSet + "&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (var i = 0; i < 10; i++) {
                var totalDiv = $("<div>").attr("id", "giphy");
                var giphyDiv = $("<div class=giphy" + (i + offSet) + ">");
                // get title
                var title = response["data"][i]["title"];
                // get rate
                var rate = response["data"][i]["rating"];
                // write out title
                var pOne = $("<p>").text("Title: " + title);
                // write out rating
                var pTwo = $("<p>").text("Rating: " + rate);
                // get animating image url
                var animateURL = response["data"][i]["images"]["original"]["url"];
                // get still image url
                var stillURL = response["data"][i]["images"]["original_still"]["url"];
                // create image using animateURL and stillURL
                var image = $("<img>").attr("src", stillURL).attr("data-still", stillURL).attr("data-animate", animateURL).attr("data-state", "still").addClass("gif");
                // write out favorites option
                var favSection = $("<p>").html("Add to Favorites: ");
                // make favorite button 
                var favButton = $("<button>");
                favButton.attr("data-num", i + offSet).addClass("favorite").text("★").css("background", "yellow");
                // make button for download
                var downButton = $("<button>").text("download").addClass("down");
// ****** ??????????this worked in images, but when I tried this on Giphy I got forbidden access error. needs to learn how to do this
                var down= $("<a href = '"+ animateURL + "' download>").append(downButton);
                // attach buttons to favSection
                favSection.append(favButton).append(down);
                // each giphy#class will have its specific image, title, and rate info attached 
                giphyDiv.append(image).append(pOne).append(pTwo);
                // finally each giphy#class and favorite button section will be attached to display section
                totalDiv.append(giphyDiv).append(favSection);
                $("#display").append(totalDiv);
            }
            // when favorite button is clicked, attach image associated to the favorites section
            $(".favorite").on("click", function (event) {
                // number of image added to favorites increment
                favImgCount++;
                // favorite button clicked's data-num, which is same as specific number added to  each giphy class, will be assigned to variable favNum
                var favNum = $(this).attr("data-num");
                // new division with calls fav+favNum will be created to hold ones that are added to favorites and will be assigned to variable favlist
                var favlist = $("<div>").addClass("fav" + favNum);
                // giphy class with specific data number that favorite button has, will be assigned to variable favImg
                var favImg = $(".giphy" + favNum);
                // innerHTML from the giphy class that we stored to favImg will be assigned to favorite...this is similar to taking out image from giphy class
                var favorite = favImg[0].innerHTML;
// ****** ??????????When I add animated giphy image to favorites,  I want them to be still image... need to learn how to do this

                // create a button to delete, this is also specific to giphy image, so will contain favNum as its value, class called "checkbox"will be added
                // to be used when wil click the button, and will have text x inside the button, and add specific id as favImgCount number, then 
                // assign to deleteButton variable
                var deleteButton = $("<button>").attr("value", favNum).addClass("checkbox").text("X").attr("id", favImgCount);
                // add the image and delete button to the favorite list
                favlist.append(favorite).append(deleteButton);
                localStorage.setItem("list" + favImgCount, favorite);
                // attatch the favorite list to favorites section
                $(".favorites").append(favlist);
                $("#favorites").css("height", "auto");
            });
        });
    }

    // when webpage is loaded, some buttons choices, and a search button is available
    renderButtons();
    // for each keys in localStorage
    for (var i = 0; i <= localStorage.length; i++) {
        // get item
        var favorite = localStorage.getItem(localStorage.key(i));
        // attach to favorites section
        $(".favorites").append(favorite);
        if(localStorage.length !==0){
        $("#favorites").css("height", "auto");
        }else {
            $("#favorites").css("height", "110px");
        }
    }
    // make image animate and still when clicked
    $(document.body).on("click", ".gif", function () {
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else if (state === "animate") {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });
// **** ?????????  wanted to have this button attached and work in the local storage too...:( need to learn this 
// for now will use clear button instead to clear out local storage
    $(document.body).on("click", ".checkbox", function () {
        // this check box's value, which presents specific favorite list that holds the image , will be assigned to variable wrong
        var notFav = $(this).attr("value");
        // this spcific favorite list will be deleted
        $(".fav" + notFav).empty()
        // remove from the storage            
        var wrongNum = $(this).attr("id");
        localStorage.removeItem("list" + wrongNum);
        favImgCount--;
        if (localStorage.length ==0) {
            $("#favorites").css("height", "110px");
        }
    });

// clear button will clear out local storage and favorites
    $(document.body).on("click", "#clear", function () {
        localStorage.clear();     
        favImgCount = 0 ;
        $(".favorites").empty();
        $("#favorites").css("height", "110px");
    });
});
