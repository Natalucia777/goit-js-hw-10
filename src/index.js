import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from "notiflix";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector("input.search-box");
const countryList = document.querySelector("ul.country-list");
const countryInfo = document.querySelector("div.country-info");

const cleanMarkup = ref => (ref.innerHTML = '');
const onInput = e => {
  const inputText = e.target.value.trim();
  if (!inputText) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
  }
fetchCountries(inputText).then(data => {
  console.log(data);
  if (data.lenght > 10) {
    Notify.info('Many matches found.');
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
    const markupData = createMarkup(data);
    countryInfo.innerHTML = markupData;
  }
};
const createMarkup = data => {
  return data.map(({ name, flag }) =>
`<li><img src="${flag.png}" alt="${name.official}" width="60" height="40">
${name.official}</li>`,
    ).join(""); };
