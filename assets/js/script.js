var openModal = document.getElementById("open-modal");
var closeModal = document.getElementById("close-modal");
var modalContainer = document.getElementById("modal-container");
var day = (moment().format("DDDDYYYY"));
var dayInc = 0;
var hour = moment().hours();
var campSiteName = "";
var campSiteID = "";
var campID = [];
var Sector = [
  "N",
  "NNE",
  "NNE",
  "NE",
  "NE",
  "ENE",
  "ENE",
  "E",
  "E",
  "ESE",
  "ESE",
  "SE",
  "SE",
  "SSE",
  "SSE",
  "S",
  "S",
  "SSW",
  "SSW",
  "SW",
  "SW",
  "WSW",
  "WSW",
  "W",
  "W",
  "WNW",
  "WNW",
  "NW",
  "NW",
  "NNW",
  "NNW",
  "N",
];
let loiArray = [];
let currentLocation = {lat:"",lng:""};
let npsApiKey = "71YJlvXLD5CwfW1xEAbx30SgczpxdaZPp5HVB1eL";
let openWeatherApiKey = "c6372f1324c78c2e38ccaa1ebef5b15c";
let searchPage = 0;
let searchLimit = 10;
// Open Layerts appears keyless 


//Pull all the campsites based on State NPS API. 
//Use JQuery to build a button list
function gatherCampsites(){
  var searchStr = (document.querySelector("#searchTerm").value).toUpperCase();
  var apiUrl =
    "https://developer.nps.gov/api/v1/campgrounds?stateCode=" +
    searchStr +
    "&api_key=" +
    npsApiKey +
    "&start=" +
    searchPage +
    "&limit=" +
    searchLimit;
  //Use of API, JSON
  fetch(apiUrl)
    .then(campSiteResponse => campSiteResponse.json())
    .then(campSiteResponse =>{
      // console.log(campSiteResponse);
      //DOM manipulation
      var campsEl = document.getElementById("camp-list");
      while (campsEl.hasChildNodes()) {  
        campsEl.removeChild(campsEl.firstChild);
      };
      for (let i = 0; i < campSiteResponse.data.length; i++) {
        var campText = campSiteResponse.data[i].name;
        //turn button red if no lat/long data
        if (campSiteResponse.data[i].latLong){
          loiArray[i] = campSiteResponse.data[i].latLong;
          var btnColor = "waves-effect waves-light btn-small";
        }else{
          var btnColor = "btn-error"
        }
        $('#camp-list').append(
            $('<li>').append(  
            $(document.createElement('button')).prop({
                type: 'button',
                innerHTML: campText,
                class: btnColor,
                style: "width: 210px",
                id: campSiteResponse.data[i].id,
            })
            )      
        );
        //DOM manipulation
        var btn = document.getElementById(campSiteResponse.data[i].id);
        btn.addEventListener("click", specCampsites);
      };
      //Add a next or previous button if needed use JQuery
      if (campSiteResponse.total > (searchPage + searchLimit)){
        btnColor = "btn-next";
        $('#camp-list').append(
          $('<li>').append(  
          $(document.createElement('button')).prop({
              type: 'button',
              innerHTML: "NEXT PAGE",
              class: btnColor,
              id: "NEXT-PAGE",
              style: "width: 210px"
            })
          )
        )
        //DOM manipulation    
        var btn = document.getElementById("NEXT-PAGE");
        btn.addEventListener("click", nextPage);
      };
      if (searchPage >= searchLimit){
        btnColor = "btn-prev";
        $('#camp-list').append(
          $('<li>').append(  
          $(document.createElement('button')).prop({
              type: 'button',
              innerHTML: "PREV PAGE",
              class: btnColor,
              id: "PREV-PAGE",
              style: "width: 210px"
            })
          )
        )
        //DOM manipulation    
        var btn = document.getElementById("PREV-PAGE");
        btn.addEventListener("click", prevPage);
      };
    })
    //DOM manipulation    
    var btn = document.getElementById("searchTerm");
    btn.addEventListener("click", resetSearchPage);
};

function nextPage(){
  searchPage = searchPage + searchLimit;
  gatherCampsites();
};

function prevPage(){
  searchPage = searchPage - searchLimit;
  gatherCampsites();
};

function resetSearchPage(){
  searchPage = 0;
  searchLimit = 10;
};

function clearSearchPage(){
  //DOM manipulation    
  var campsEl = document.getElementById("camp-list");
  while (campsEl.hasChildNodes()) {  
    campsEl.removeChild(campsEl.firstChild);
  };
  var btn = document.getElementById("searchTerm");
  btn.value = "";
};

//Function for looking up specific campsite by it's id (associated with the buttons id)
function specCampsites(){
    searchStr = this.id;
    if(searchStr.includes("fav-")){
      campSiteID = searchStr.slice(4);
    }else{
      campSiteID = searchStr;
    }
  //clear the info tabs JQuery
    modalContainer.classList.remove("show");
    $('#swipe-1').html('');
    $('#swipe-2').html('');
    $('#swipe-3').html('');
    $('#swipe-4').html('');
  var txtHeight = document.getElementById("swipe-1");
  var apiUrl =
    "https://developer.nps.gov/api/v1/campgrounds?id=" +
    campSiteID +
    "&api_key=" +
    npsApiKey;
  //Use of API, JSON
  fetch(apiUrl)
  .then(campSiteResponse => campSiteResponse.json())
  .then(campSiteResponse =>{
    // console.log(campSiteResponse)
    campSiteName = campSiteResponse.data[0].name;
    campID = campSiteResponse.data[0].id;
    //populate all the tabs with data use JQuery
    if (campSiteResponse.data[0].name){
      campSiteName = campSiteResponse.data[0].name
      $('#swipe-1').append(
        $('<p>').text(  
          "Name: " + campSiteResponse.data[0].name
        )      
      );    
    }
    if ((campSiteResponse.data[0].fees[0])){
      $('#swipe-2').append(
        $('<p>').text(  
          "Fees: " + campSiteResponse.data[0].fees[0].cost + " " + campSiteResponse.data[0].fees[0].description
        )      
      );    
    }else{
      $('#swipe-2').append(
        $('<p>').text(  
          "Fees: " + "No Available Data"
        )      
      );    
    }
    if ((campSiteResponse.data[0].description)){
      $('#swipe-1').append(
        $('<p>').text(  
          "Description: " + campSiteResponse.data[0].description
        )      
      );    
    }else{
      $('#swipe-1').append(
        $('<p>').text(  
          "Description: " + "No Available Data"
        )      
      );    
    }
    if ((campSiteResponse.data[0].directionsOverview)){
      $('#swipe-3').append(
        $('<p>').text(  
          "Directions: " + campSiteResponse.data[0].directionsOverview
        )      
      );    
    }else{
      $('#swipe-3').append(
        $('<p>').text(  
          "Directions: " + "No Available Data"
        )      
      );    
    }
    if ((campSiteResponse.data[0].reservationInfo)){
      $('#swipe-2').append(
        $('<p>').text(  
          "Reservation Info: " + campSiteResponse.data[0].reservationInfo
        )      
      );    
    }else{
      $('#swipe-2').append(
        $('<p>').text(  
          "Reservation Info: " + "No Available Data"
        )      
      );    
    }      
    if ((campSiteResponse.data[0].reservationUrl)){
      $('#swipe-4').append(
        $('<p>').text(  
          "Reservation URL: "
        )      
      );    
    }      
    if ((campSiteResponse.data[0].reservationUrl)){
      $('#swipe-4').append(
        campSiteResponse.data[0].reservationUrl.link(campSiteResponse.data[0].reservationUrl)
      );    
    }      
    if ((campSiteResponse.data[0].regulationsurl)){
      $('#swipe-4').append(
        $('<p>').text(  
          "Regulations URL: "
        )      
      );    
    }      
    if ((campSiteResponse.data[0].regulationsurl)){
      $('#swipe-4').append(
          campSiteResponse.data[0].regulationsurl.link(campSiteResponse.data[0].regulationsurl)
      );    
    }      
    if ((campSiteResponse.data[0].url)){
      $('#swipe-4').append(
        $('<p>').text(  
          "URL: "
        )      
      );    
    }      
    if ((campSiteResponse.data[0].url)){
      $('#swipe-4').append(
          campSiteResponse.data[0].url.link(campSiteResponse.data[0].url)
      );    
    }  
    //set global location    
    currentLocation = {lat:campSiteResponse.data[0].latitude,lng:campSiteResponse.data[0].longitude};
    //if we have lat/long lookup forcast and update map
    if (campSiteResponse.data[0].latLong){
      //Nested fetch, Use of API, JSON
      var api2Url = "https://api.openweathermap.org/data/2.5/onecall?lat="+campSiteResponse.data[0].latitude+"&lon="+campSiteResponse.data[0].longitude+"&exclude=minutely,hourly&appid=" +  openWeatherApiKey;
      fetch(api2Url)
      .then(weatherResponse => weatherResponse.json())
      .then(weatherResponse => {
        // console.log(weatherResponse)
        //setting 5 day forcast
          updateMap(); 
          //DOM manipulation    
          for (let i = 1; i < 7; i++) {
            document.querySelector("#Day"+i).textContent = (moment().add(i, 'd')).format("L");
            document.querySelector("#Day"+i+"-temp").textContent = "Hi Temp: " + (((weatherResponse.daily[i].temp.max-273.15) * (9/5)) + 32).toFixed(2);
            document.querySelector("#Day"+i+"-wind").textContent = "Wind: " + Sector[(Math.round(weatherResponse.daily[i].wind_deg / 11.25))] + "@" + weatherResponse.daily[i].wind_speed.toFixed(0);
            document.querySelector("#Day"+i+"-hum").textContent = "Humidity: " + weatherResponse.daily[i].humidity;
            document.querySelector("#Day"+i+"-icon").src="http://openweathermap.org/img/wn/" + weatherResponse.daily[i].weather[0].icon + "@2x.png";
          };
      });
    }else{
      updateMap(); 
      for (let i = 1; i < 7; i++) {
        document.querySelector("#Day"+i).textContent = (moment().add(i, 'd')).format("L");
        document.querySelector("#Day"+i+"-temp").textContent = "Hi Temp: " + "NDA";
        document.querySelector("#Day"+i+"-wind").textContent = "Wind: " + "NDA";
        document.querySelector("#Day"+i+"-hum").textContent = "Humidity: " + "NDA";
        document.querySelector("#Day"+i+"-icon").src="";
      };
    }
    if(localStorage.getItem("ID")){
      var campIDArray = JSON.parse(localStorage.getItem("ID"));
      if(campIDArray.indexOf(campSiteResponse.data[0].id) >= 0){
        $('#favorite-btn').text("Remove from Favorites").click(removeFavorite)
      }else{
        $('#favorite-btn').text("Add to Favorites").click(addFavorite)
      };
    }else{
      $('#favorite-btn').text("Add to Favorites").click(addFavorite)
    };  
  });
};

// $(document.createElement('button')).prop({
//   type: 'button',
//   innerHTML: "PREV PAGE",
//   class: btnColor,
//   id: "PREV-PAGE",
//   style: "width: 210px"
// })
// $(document).ready(function() {
//   $("#favorite-btn").on("click", addFavorite()); 
// });
//   $(document).ready(function() {
//     $("#remove-btn").on("click", function() {
//       localStorage.removeItem("Location", campSiteName);
//     })
//   });
//   })
// })

openModal.addEventListener("click",function(){
  modalContainer.classList.add("show");
});

closeModal.addEventListener("click",function(){
  modalContainer.classList.remove("show");
});
// $(document).ready(function() {
//   $("#open-modal").on("click", function(){
//     modalContainer.classList.add(".show");
//   })
// })

// $(document).ready(function() {
//   $("#close-modal").on("click", function(){
//     modalContainer.classList.remove(".show");
//   })
// })

function addFavorite(){
  var campArray = JSON.parse(localStorage.getItem("Location")) || [];
  var campIDArray = JSON.parse(localStorage.getItem("ID")) || [];
    if(campArray.indexOf(campSiteName) == -1) {
      campArray.push(campSiteName);
      localStorage.setItem("Location", JSON.stringify(campArray));
    };
    if(campIDArray.indexOf(campID) == -1) {
      campIDArray.push(campID);
      localStorage.setItem("ID", JSON.stringify(campIDArray));
    };
    $('#favorite-btn').text("Remove from Favorites").click(removeFavorite);
};

function removeFavorite(){
  var campArray = JSON.parse(localStorage.getItem("Location"));
  var campIDArray = JSON.parse(localStorage.getItem("ID"));
    if(campIDArray.indexOf(campSiteID) >= 0) {
      campArray.splice(campIDArray.indexOf(campSiteID),1);
      localStorage.setItem("Location", JSON.stringify(campArray));

      campIDArray.splice(campIDArray.indexOf(campSiteID),1);
      localStorage.setItem("ID", JSON.stringify(campIDArray));
    };
  $('#favorite-btn').text("Add to Favorites").click(addFavorite);
};

function populateModal(){
  var locationArray = JSON.parse(localStorage.getItem("Location"));
  var arrayID = JSON.parse(localStorage.getItem("ID"));
  var campsEl = document.getElementById("popModal");
  while (campsEl.hasChildNodes()) {  
    campsEl.removeChild(campsEl.firstChild);
  };
  for (let i = 0; i < locationArray.length; i++) {
    var campText = locationArray[i];
    var arrayText = arrayID[i];
    $('#popModal').append(
        $('<li>').append(  
        $(document.createElement('button')).prop({
            type: 'button',
            innerHTML: campText,
            class: "waves-effect waves-light btn-small",
            style: "width: 210px",
            id: "fav-" + arrayText,
        })
        )      
    );
    var btn = document.getElementById("fav-" + arrayText);
    btn.addEventListener("click", specCampsites);
  };
}

function updateMap(){
  //clear map
  var mapEl = document.getElementById("map");
  while (mapEl.hasChildNodes()) {  
    mapEl.removeChild(mapEl.firstChild);
  };
  //if we have long get map data
  if (parseFloat(currentLocation.lng)){
  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([currentLocation.lng, currentLocation.lat]),
      zoom: 16
    })
  });
  }else{
    mapEl.innerText = "No Data Available"
  };
};