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

/**
 * To avoid using libraries or making outside calls we will use the timezone offset
 * from the users system combined with the timezone offset from the timezones json
 * to calculate the time in the specific city,
 *
 * Ideally we would be able to pull in timezones from another api however for the exercise
 * I have used a user maintained JSON file
 */

const getTimeForCity = async (selectedCity) => {
  // if the user has not update the timezones for a city we won't display the clock
  document.getElementById("clock-wrapper").style.display = "none";
  //If there is a timezone entry for that city though we will do our calculations to dispaly the local time
  if (_timezones[selectedCity]) {
    document.getElementById("clock-wrapper").style.display = "flex";
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
    const displayMinutes =
      currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;

    document.getElementById("hours").innerHTML = displayHours;
    document.getElementById("minutes").innerHTML = displayMinutes;
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
  getTimeForCity(selectedCity);
};

/**
 * The main entry function for creating and managing our Navigation Component
 */
const init = () => {
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
init();
