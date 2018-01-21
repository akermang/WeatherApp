let selectedCityName = "";
const url = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/";

let input = $("#cityName");
input.keyup(function() {
  let textToSearch = input.val();
  inputChanged(textToSearch);
});

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

    let itemSelected = this.element.find(".li-item");
    itemSelected.on("click", () => {
      liElementCliced(this.city.woeid);
      selectedCityName = this.city.title;
    });
  }
}

function liElementCliced(woeidCity) {
  getDataByQuery(woeidCity);
}

function getDataByQuery(QueryParams) {
  $.get(url + "api/location/" + QueryParams, function(response) {
    renderList(response.consolidated_weather);
  });
}

function renderList(data) {
  let citiesList = $(".select-section");
  emptyElement(citiesList);
  let comp = new ForcastListComponent(data);
  $(".select-section").append(comp.element);
}

class CitiesListComponent {
  constructor(citiesList) {
    this.citiesList = citiesList;
    this.createElement();
  }

  createElement() {
    this.element = $(`<ul></ul>`);

    for (let user of this.citiesList) {
      let liEl = $("<li></li>");
      let userComp = new CityItemComponent(user);
      liEl.append(userComp.element);
      this.element.append(liEl);
    }
  }
}

class ForcastListComponent {
  constructor(forcastList) {
    this.forcastList = forcastList;
    this.createElement();
  }

  createElement() {
    createHeader()
    this.element = $(`<ul class="forcast-ul"></ul>`);
    for (let listItem of this.forcastList) {
      let liEl = $("<li></li>");
      let itemComp = new ItemComponent(listItem);
      liEl.append(itemComp.element);
      this.element.append(liEl);
    }
  }
}

function createHeader(){
  let citiyName = $(`<h3 class="city-name">${selectedCityName}</h3>`);
    $(".select-section").append(citiyName)
}

class ItemComponent {
  constructor(listItem) {
    this.listItem = listItem;
    this.abbr = listItem.weather_state_abbr;
    this.icoUrl =  "https://www.metaweather.com/static/img/weather/" + this.abbr + ".svg";
    this.createElement();
  }

  createElement() {
    let temp = Math.floor(this.listItem.the_temp);
    this.element = $(`
        <div class="item-comp-div">
          <p class="spn-name">${selectedCityName}  </p>
          <p class="spn-name"> ${this.listItem.applicable_date}</p>
          
          <img class="weather-icon" src=${this.icoUrl} alt=${
      this.listItem.weather_state_abbr
    }> 
          <p class="spn-name">  TEMP:  ${temp}c</p>
          <p class="spn-name"> Humidety: ${this.listItem.humidity}%</p>
         
        </div>
      `);

    let img = this.element.find(".weather-icon");
    img.src = getIconSrcByKey(this.listItem.weather_state_abbr);
  }
}

function inputChanged(textToSearch) {
  $.get(url + "api/location/search/?query=" + textToSearch, function(response) {
    let div = $(".select-section");
    emptyElement(div);
    let comp = new CitiesListComponent(response);
    $(".select-section").append(comp.element);
  });
}

function emptyElement(element) {
  element.empty();
}

function getIconSrcByKey(key) {
  let src = url + "static/img/weather/" + key + ".svg";
  return src;
}
