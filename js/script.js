const url = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/";
const icoUrl = "https://www.metaweather.com/static/img/weather/";
let selectCont = $(".select-section");
let selectedCityName = "";
const loader = $(".loader");
const message = $(".message")

function getDataByQuery(QueryParams, callback) {
  loader.show();
  $.get(url + QueryParams, function(response) {
    if(response.consolidated_weather  || response.length > 0){
      callback(response);
      loader.hide();
    }else {
      loader.hide();
      message.show();
      setTimeout(()=>{message.hide()},1200)
    }  
  });
}

let input = $("#cityName");
input.keyup(function() {
  let textToSearch = input.val();
  inputChanged(textToSearch);
});

function inputChanged(textToSearch) {
  let letters = /^[a-zA-Z]/;
  if(textToSearch.match(letters)){
    let query = "search/?query=" + textToSearch;

    getDataByQuery(query, (response)=>{
      selectCont.empty();
      let comp = new CitiesListComponent(response);
      selectCont.append(comp.element);
    })
  }
}

class CitiesListComponent {
  constructor(citiesList) {
    this.citiesList = citiesList;
    this.createElement();
  }

  createElement() {
    this.element = $(`<ul></ul>`);

    for (let city of this.citiesList) {
      let cityComp = new CityItemComponent(city);
      this.element.append(cityComp.element);
    }
  }
}

class CityItemComponent {
  constructor(city) {
    this.city = city;
    this.createElement();
  }

  createElement() {
    this.element = $(`
        <div>
          <div class= "li-item">
            <span class="spn-name">${this.city.title}</span>          
          </div>
        </div>
      `);

    this.element.on("click", () => {
      liElementCliced(this.city.woeid);
      selectedCityName = this.city.title;
    });
  }
}

function liElementCliced(woeidCity) {
  getDataByQuery(woeidCity,
     (response)=> renderList(response.consolidated_weather));
}

function renderList(data) {
  selectCont.empty();
  let comp = new ForcastListComponent(data);
  selectCont.append(comp.element);
}

class ForcastListComponent {
  constructor(forcastList) {
    this.forcastList = forcastList;
    this.createElement();
  }

  createElement() {
    createCityHeader();
    this.element = $(`<ul class="forcast-ul"></ul>`);
    for (let listItem of this.forcastList) {
      let itemComp = new ItemComponent(listItem);
      this.element.append(itemComp.element);
    }
  }
}

function createCityHeader() {
  let citiyName = $(`<h3 class="city-name">${selectedCityName}</h3>`);
  selectCont.append(citiyName);
}

class ItemComponent {
  constructor(listItem) {
    this.listItem = listItem;
    this.abbr = listItem.weather_state_abbr;
    this.icoUrl = icoUrl + this.abbr + ".svg";
    this.createElement();
  }

  createElement() {
    let temp = Math.floor(this.listItem.the_temp);
    this.element = $(`
        <div class="item-comp-div">
          <p class="spn-name">${selectedCityName}  </p>
          <p class="spn-name"> ${this.listItem.applicable_date}</p>
          <img class="weather-icon" src=${this.icoUrl} alt=${
             this.listItem.weather_state_abbr}> 
          <p class="spn-name">  TEMP:  ${temp}c</p>
          <p class="spn-name"> Humidety: ${this.listItem.humidity}%</p>
        </div>
      `);

    let img = this.element.find(".weather-icon");
    img.src = this.icoUrl;
  }
}