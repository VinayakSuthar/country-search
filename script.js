const form = document.getElementById('form');
const search = document.getElementById('search');
const country = document.getElementById('country');
const countries = document.getElementById('countries');
const loader = document.getElementById('loader');

function showLoader() {
  loader.hidden = false;
  countries.hidden = true;
}

function removeLoader() {
  loader.hidden = true;
  countries.hidden = false;
}

const url = (name) => `https://restcountries.com/v3.1/name/${name}`;

// get country data from the api
async function getCountryByName(countryName) {
  try{
    const resp = await fetch(url(countryName));
    const respData = await resp.json();

    addCountryToPage(respData);
  }catch(err) {
    console.log(err);
  }
}

// create a country element from the data recieved from api 
function addCountryToPage(respData) {
  const [countryData] = respData;
  // const [latitude, longitude] = countryData.latlng;

  const countryHeading = document.createElement('h2');
  const countyCapital = document.createElement('div');
  const imageDiv = document.createElement('div');

  // array list of languages of a country 
  function getLanguages() {
    let languages = "";

    for (let value in countryData.languages) {
      languages += countryData.languages[value] + ", ";
    }
    languages = languages.slice(0, -2);

    return languages;
  }

  // add data to the container 
  countryHeading.classList.add("country-heading");
  countryHeading.innerHTML = `${countryData.name.common}`;
  imageDiv.innerHTML = `<img src="${countryData.flags.png}" alt="${countryData.name.common} flag" />`;
  countyCapital.innerHTML = `
   Capital : ${countryData.capital} <br/>
   Languages : ${getLanguages()}  <br />
   Geographical location : ${countryData.subregion}
  `;
  country.innerHTML = "";
  country.appendChild(countryHeading);
  country.appendChild(imageDiv);
  country.appendChild(countyCapital);
}

form.addEventListener('submit',(e) => {
  e.preventDefault();
  const countryName = search.value;
  if(countryName) {
    getCountryByName(countryName)
  }
});

// fetch data for the list of countries
async function addCountriesToContainer() {
  showLoader();
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const respData = await response.json();
    removeLoader();
    listCountries(respData);
  } catch(err) {
    console.log("Error ",err);
  }
}

// create a list of all countries 
function listCountries(respData) {
  // list of names of the country
  let countriesList = respData.map((element) => {
    return element.name.common
  })
  // to sort the list of names of country alphabetically
  countriesList = countriesList.sort();
  // console.log(countriesList);
  countriesList.forEach(element => {
    const countryElement = document.createElement('a');
    countryElement.setAttribute("href","#title");
    countryElement.classList.add('country-box');
    countryElement.addEventListener("click", (ele) => {
      getCountryByName(ele.target.firstChild.data);
      console.log(ele.target.firstChild.data);
      console.log(ele);
    });
    countryElement.innerHTML = element;
    countries.appendChild(countryElement);
  });
}


addCountriesToContainer();