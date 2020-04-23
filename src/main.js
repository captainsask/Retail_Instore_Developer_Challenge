import { cities as _cities } from "./navigation.json";

const navItemOnClick = (selected) => {
  const selectedElement = document.getElementsByClassName(selected)[0];
  selectedElement.classList.add("selected");
};

const removeSelectedState = () => {
  const navItems = document.querySelectorAll(".city-wrapper");

  navItems.forEach((item) => {
    item.classList.remove("selected");
  });
};

const setSelectedBarWidth = (selectedEl) => {
  const selectBar = document.getElementById("selected-bar");
  const selectedElement = document.getElementsByClassName(selectedEl)[0]
    .firstElementChild;

  const selectedWidth = selectedElement.clientWidth;
  const elementOffset = selectedElement.offsetLeft;

  selectBar.style.width = `${selectedWidth}px`;
  selectBar.style.left = `${elementOffset}px`;
};

const selectCity = (selectedCity) => {
  removeSelectedState();
  navItemOnClick(selectedCity);
  setSelectedBarWidth(selectedCity);
};

const createNavBar = () => {
  const navigationEl = document.getElementById("navigation");
  _cities.forEach((city, index) => {
    const cityWrapper = document.createElement("div");
    cityWrapper.classList.add(city.section);
    cityWrapper.classList.add("city-wrapper");

    const navLabel = document.createElement("p");
    navLabel.innerHTML = city.label;
    navLabel.classList.add("nav-item");

    cityWrapper.append(navLabel);
    cityWrapper.tabIndex = 1;

    cityWrapper.onclick = () => {
      selectCity(city.section);
    };

    navigationEl.append(cityWrapper);
  });

  selectCity(_cities[0].section);
  window.onresize = () => setSelectedBarWidth("selected");
};

createNavBar();
