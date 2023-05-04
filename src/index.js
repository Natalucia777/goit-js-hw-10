import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
// import './css/styles.css';
// import debounce from 'lodash.debounce';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('ul.country-list');
const countryInfo = document.querySelector('div.country-info');

const cleanMarkup = ref => (ref.innerHTML = '');
const onInput = e => {
  const inputText = e.target.value.trim();
  if (!inputText) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
  }
  fetchCountries(inputText)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info('Too many matches found.');
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(countryList);
      cleanMarkup(countryInfo);
      Notify.info('There is no contry!');
    });
};
const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(countryList);
    const markupInfo = createInfo(data);
    countryInfo.innerHTML = markupInfo;
  } else {
    cleanMarkup(countryInfo);
    const markupData = createMarkup(data);
    countryList.innerHTML = markupData;
  }
};
const createMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">
${name.official}</li>`
    )
    .join('');
};
const createInfo = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src= "${flags.png}" alt="${
        name.official
      }" width="40" height="40">${name.official}</h1>
<p>Capital: ${capital}</p>
<p>Population:${population}</p>
<p>Language: ${Object.values(languages)}</p>`
  );
};

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
