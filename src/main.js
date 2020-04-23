import { cities as _cities } from "./data/navigation.json";
import { timezones as _timezones } from "./data/timezones.json";

/**
 * When the Nav Item is clicked we will set the selected classname onto it.
 */
const setSelectedState = (selected) => {
  if (selected) {
    const selectedElement = document.getElementsByClassName(selected)[0];
    selectedElement.classList.add("selected");
  }
};

/**
 * Here we need to remove the selected state from any other divs that may contain import PropTypes from 'prop-types'
 * otherwise we end up with multiple selected cities
 */
const removeSelectedState = () => {
  const navItems = document.querySelectorAll(".city-wrapper");

  navItems.forEach((item) => {
    item.classList.remove("selected");
  });
};

/**
 * In order to properly set the width of our sliding bar element to to be the size of our label
 * we need to get the label size and offset then set them in our element. This setting of the offset
 * along with the css transition is what gives us our "sliding" effect.
 */
const setSelectedBarWidthOffset = (selectedEl) => {
  const selectBar = document.getElementById("selected-bar");
  const selectedElement = document.getElementsByClassName(selectedEl)[0]
    .firstElementChild;

  const selectedWidth = selectedElement.clientWidth;
  const elementOffset = selectedElement.offsetLeft;

  selectBar.style.width = `${selectedWidth}px`;
  selectBar.style.left = `${elementOffset}px`;
};

const getUTCTime = async () => {
  const response = await fetch("http://worldclockapi.com/api/json/utc/now");
  const data = await response.json();
  return data;
};

const getTimeForCity = async (selectedCity) => {
  if (_timezones[selectedCity]) {
    const now = new Date();
    const userOffset = now.getTimezoneOffset();
    const cityOffset = _timezones[selectedCity];

    const userHourOffset = Math.floor(userOffset / 60);
    const userMinuteOffset = 60 * (userOffset % 60);

    const totalHourOffset = cityOffset.hour + userHourOffset;
    const totalMinuteOffset = cityOffset.minute + userMinuteOffset;

    const currentHours = now.getHours() + totalHourOffset;
    const currentMinutes = now.getMinutes() + totalMinuteOffset;

    const amPm = currentHours < 12 || currentHours > 24 ? "am" : "pm";

    let displayHours = currentHours;
    if (currentHours > 12) {
      displayHours = currentHours - 12;
    }
    if (currentHours > 24) {
      displayHours = currentHours - 24;
    }

    console.log(currentHours);
    console.log(currentMinutes);
    document.getElementById("hours").innerHTML = displayHours;
    document.getElementById("minutes").innerHTML = currentMinutes;
    document.getElementById("am-pm").innerHTML = amPm;
  }
};

/**
 * Gathering function to pull in the different parts of what happens when a city is selected
 */
const selectCity = (selectedCity) => {
  removeSelectedState();
  setSelectedState(selectedCity);
  setSelectedBarWidthOffset(selectedCity);
};

/**
 * The main entry function for creating and managing our Navigation Component
 */
const createNavBar = () => {
  const navigationEl = document.getElementById("navigation");
  _cities.forEach((city) => {
    const cityWrapper = document.createElement("div");
    cityWrapper.classList.add(city.section);
    cityWrapper.classList.add("city-wrapper");

    const navLabel = document.createElement("p");
    navLabel.innerHTML = city.label;
    navLabel.classList.add("nav-item");

    cityWrapper.append(navLabel);
    cityWrapper.tabIndex = 1;

    cityWrapper.onclick = async () => {
      selectCity(city.section);
      await getTimeForCity(city.section);
    };

    navigationEl.append(cityWrapper);
  });

  selectCity(_cities[0].section);
  window.onresize = () => setSelectedBarWidthOffset("selected");
};

//Initializing the Navigation on loading the page
createNavBar();
