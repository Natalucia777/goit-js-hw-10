import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

const createMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">
${name.official}</li>`
    )
    .join('');
};

function createInfo(data) {
  return data
    .map(
      ({ name, population, flags, languages, capital }) =>
        `<h2>
        <img src="${flags.svg}" alt="${name.official}" width="50" height="30">
        ${name.official}
        </h2>
        <ul>
            <li>
                <span>Capital:</span>
                ${capital}
            </li>
            <li>
                <span class="country-info-type">Population:</span>
                ${population}
            </li>
            <li>
                <span>Languages:</span>
                ${Object.values(languages).join(', ')}
            </li>
        </ul>`
    )
    .join('');
}

function onInput(e) {
  const searchBoxInput = e.target.value.trim();

  if (!searchBoxInput) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(searchBoxInput)
    .then(data => {
      if (data.length > 10) {
        Notify.info('Too many matches found.');
      } else if (data.length < 10 && data.length >= 2) {
        countryInfo.innerHTML = '';
        countryList.innerHTML = createMarkup(data);
      } else {
        countryList.innerHTML = '';
        countryInfo.innerHTML = createInfo(data);
      }
    })
    .catch(error => {
      countryInfo.innerHTML = '';
      countryList.innerHTML = '';
      if (error.message === '404') {
        Notify.failure('There is no contry!');
      } else {
        console.log(error);
      }
    });
}
