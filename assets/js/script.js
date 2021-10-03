var openModal = document.getElementById("open-modal");
var closeModal = document.getElementById("close-modal");
var modalContainer = document.getElementById("modal-container");
var day = (moment().format("DDDDYYYY"));
var dayInc = 0;
var hour = moment().hours();
var campSiteName = "";
var campSiteID = "";
var campID = [];
const validStates = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA",
                  "MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
                  "TX","UT","VT","VA","WA","WV","WI","WY"];
const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
              "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts",
              "Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
              "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
              "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const centerOfStates = ["32.7794, -86.8287","64.0685, -152.2782","34.2744, -111.6602","34.8938, -92.4426","37.1841, -119.4696","38.9972, -105.5478",
                        "41.6219, -72.7273","38.9896, -75.5050","28.6305, -82.4497","32.6415, -83.4426","20.2927, -156.3737","44.3509, -114.6130",
                        "40.0417, -89.1965","39.8942, -86.2816","42.0751, -93.4960","38.4937, -98.3804","37.5347, -85.3021","31.0689, -91.9968","45.3695, -69.2428","39.0550, -76.7909",
                        "42.2596, -71.8083","44.3467, -85.4102","46.2807, -94.3053","32.7364, -89.6678","38.3566, -92.4580","47.0527, -109.6333","41.5378, -99.7951","39.3289, -116.6312",
                        "43.6805, -71.5811","40.1907, -74.6728","34.4071, -106.1126","42.9538, -75.5268","35.5557, -79.3877","47.4501, -100.4659","40.2862, -82.7937","35.5889, -97.4943",
                        "43.9336, -120.5583","40.8781, -77.7996","41.6762, -71.5562","33.9169, -80.8964","44.4443, -100.2263","35.8580,- 86.3505","31.4757, -99.3312","39.3055, -111.6703",
                        "44.0687, -72.6658","37.5215, -78.8537","47.3826, -120.4472","38.6409, -80.6227","44.6243, -89.9941","42.9957, -107.5512"];

const Sector = [
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
let pixabayApiKey = "22722015-2600ce20055da0a54f573e666";
let searchPage = 0;
let searchLimit = 10;

// var ug = import {useGeographic} from 'ol/proj';
const useGeographic = require("ol/proj").useGeographic;
useGeographic();

// Open Layerts appears keyless 

function validateInput(){
  if(validStates.indexOf((document.querySelector("#searchTerm").value).toUpperCase()) >= 0) {
    gatherCampsites();
  }else{
    var campsEl = document.getElementById("camp-list");
    while (campsEl.hasChildNodes()) {  
      campsEl.removeChild(campsEl.firstChild);
    };   
    btnColor = "btn-prev";
    $('#camp-list').append(
      $('<li>').append(  
      $(document.createElement('button')).prop({
          type: 'button',
          innerHTML: "Please Enter a valid State Code",
          class: btnColor,
          id: "State-Fail",
          style: "width: 210px"
        })
      )
    )
        
  }  
}


//Pull all the campsites based on State NPS API. 
//Use JQuery to build a button list
function gatherCampsites(){
  var searchStr = (document.querySelector("#searchTerm").value).toUpperCase();
  let loiArray = [];
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
        // const startMarker = new Feature({
        //   type: 'icon',
        //   geometry: new Point(campSiteResponse.data[i].latLong),
        // });
      };
      //Add a "no Camp", next or previous button if needed use JQuery
      if (campSiteResponse.total == 0){
        var campsEl = document.getElementById("camp-list");
        while (campsEl.hasChildNodes()) {  
          campsEl.removeChild(campsEl.firstChild);
        };   
        btnColor = "btn-next";
        $('#camp-list').append(
          $('<li>').append(  
          $(document.createElement('button')).prop({
              type: 'button',
              innerHTML: "No Campsites Found",
              class: btnColor,
              id: "No-camp-error",
              style: "width: 210px"
            })
          )
        )
      };
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
      let str = centerOfStates[(validStates.indexOf(searchStr))];
      let myArr = str.split(",");
      currentLocation = {lat:myArr[0].trim(),lng:myArr[1].trim()};
      updateMap(6.5);

      // const vectorLayer = new VectorLayer({
      //   source: new VectorSource({
      //     features: [startMarker],
      //   }),
      //   style: function (feature) {
      //     return styles[feature.get('type')];
      //   },
      // });
  
      // map.addLayer(vectorLayer);


      //API to pull in a background image
      var state = states[(validStates.indexOf(searchStr))];
      state.split(" ").join("%20");
      var api3Url = "https://pixabay.com/api/?key="+pixabayApiKey+"&q=state%20of%20"+state+"&image_type=photo&orientation=horizontal&category=nature&editors_choice=false&safesearch=true";
      fetch(api3Url)
      .then(backgroundResponse => backgroundResponse.json())
      .then(backgroundResponse => {
        // console.log(backgroundResponse)
        //set background
        var randomInt = Math.floor(Math.random()*backgroundResponse.hits.length);
        document.getElementById("body").style.backgroundImage="url("+ backgroundResponse.hits[randomInt].largeImageURL +")"; 
      });
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
          updateMap(16); 
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
      updateMap(16); 
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

openModal.addEventListener("click",function(){
  modalContainer.classList.add("show");
});

closeModal.addEventListener("click",function(){
  modalContainer.classList.remove("show");
});

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

function updateMap(zoom){

  //clear map
  var mapEl = document.getElementById("map");
  while (mapEl.hasChildNodes()) {  
    mapEl.removeChild(mapEl.firstChild);
  };
  //if we have long get map data
  const place = [currentLocation.lng,currentLocation.lat];
  const point = new ol.geom.Point(place);
  if (parseFloat(currentLocation.lng)){
    var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM({
          }),
        }),
        new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [new ol.Feature(point)],
          }),
          style: new ol.style.Style({
            image: new ol.style.Circle({
              radius: 19,
              fill: new ol.style.Fill({color: 'red'}),
            }),
          }),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([currentLocation.lng, currentLocation.lat]),
      zoom: zoom
    })
  });
  }else{
    mapEl.innerText = "No Data Available"
  };
};