var selectedCityName = "";
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
    this.element = $(`<ul></ul>`);

    for (let listItem of this.forcastList) {
      let liEl = $("<li></li>");
      let itemComp = new ItemComponent(listItem);
      liEl.append(itemComp.element);
      this.element.append(liEl);
    }
  }
}

class ItemComponent {
  constructor(listItem) {
    this.listItem = listItem;
    this.abbr = listItem.weather_state_abbr;
    this.icoUrl =
      "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/static/img/weather/" + this.abbr + ".svg";
    this.createElement();
  }

  createElement() {
    this.element = $(`
        <div class="item-comp-div">
          <p class="spn-name">${selectedCityName}: 
          <span class="spn-name"> ${this.listItem.applicable_date}</span>
          </p> 
          <img class="weather-icon" src=${this.icoUrl} alt=${
      this.listItem.weather_state_abbr
    }> 
          <p class="spn-name">  TEMP:  ${this.listItem.the_temp}c</p>
          <p class="spn-name"> HUMIDETY: ${this.listItem.humidity}%</p>
         
        </div>
      `);

    let img = this.element.find(".weather-icon");
    img.src = getIconSrcByKey(this.listItem.weather_state_abbr);
  }
}

function inputChanged(textToSearch) {
  $.get(
    "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=" + textToSearch,
    function(response) {
      let div = $(".select-section");
      emptyElement(div);
      let comp = new CitiesListComponent(response);
      $(".select-section").append(comp.element);
    }
  );
}

function liElementCliced(woeidCity) {
  getDataByQuery(woeidCity);
}

function getDataByQuery(QueryParams) {
  $.get("https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/" + QueryParams, function(
    response
  ) {
    console.log(response.consolidated_weather);
    renderList(response.consolidated_weather);
  });
}

function emptyElement(element) {
  element.empty();
}

function renderList(data) {
  let citiesList = $(".select-section ul");
  emptyElement(citiesList);
  // let comp = new UsersListComponent(data);
  // $(".select-section").append(comp.element);
  let comp = new ForcastListComponent(data);
  $(".select-section").append(comp.element);
}
function getIconSrcByKey(key) {
  let src = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/static/img/weather/" + key + ".svg";
  return src;
}
