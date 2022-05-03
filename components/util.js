import { speechCodeConfig } from "./config.js";
import { Toast } from "bootstrap";

const toastElement = document.getElementById('custom-toast');
const toastText = document.getElementById('custom-toast-body');
const toast = new Toast(toastElement);
const loggingEnabled = speechCodeConfig.LOGGING;

const instructions = $("#instructions")

export const setInstructions = (text) => {
  instructions.text(text)
}

export const logMessage = (message) => {
  if (loggingEnabled) {
    console.log(message);
  }
}

/** Get the base name of the downloaded files based on current dataset. */
export const getDateString = () => {
  const d = new Date();
  const year = `${d.getFullYear()}`;
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  if (month.length < 2) {
    month = `0${month}`;
  }
  if (day.length < 2) {
    day = `0${day}`;
  }
  let hour = `${d.getHours()}`;
  if (hour.length < 2) {
    hour = `0${hour}`;
  }
  let minute = `${d.getMinutes()}`;
  if (minute.length < 2) {
    minute = `0${minute}`;
  }
  let second = `${d.getSeconds()}`;
  if (second.length < 2) {
    second = `0${second}`;
  }
  return `${year}-${month}-${day}T${hour}.${minute}.${second}`;
}

// change filename label on input
export const fileNameListen = (FileInputElement, FileInputLabel, onChangeFn) => {
  FileInputElement.addEventListener('change', () => {
    FileInputLabel.innerHTML = FileInputElement.files[0].name || 'Choose file';
    if (FileInputElement.files.length > 0) {
      onChangeFn()
    }
  });
}

/**
 * @param element element to populate
 * @param dictionary dictionary of words
 */
export const setTable = (element, dictionary) => {
  const dictBody = element.getElementsByTagName('tbody')[0];
  dictBody.innerHTML = '';

  Object.keys(dictionary).forEach(word => {
    // create <tr>
    const tr = document.createElement("tr");

    // create <td> for word
    const keywordTd = document.createElement("td");
    // create <b> for word
    const keywordTextNode = document.createElement("b");
    keywordTextNode.innerHTML = word;
    keywordTd.appendChild(keywordTextNode);

    // create <td> for description
    const descriptionTd = document.createElement("td");
    const descriptionTextNode = document.createTextNode(dictionary[word].description);
    descriptionTd.appendChild(descriptionTextNode);

    // create <td> for code
    const codeTd = document.createElement("td");
    // create <pre> for code
    const codePre = document.createElement("pre");
    codePre.innerHTML = dictionary[word]?.code ?? 'N/A';
    codeTd.appendChild(codePre);

    // create <td> for category
    const categoryTd = document.createElement("td");
    const categoryTextNode = document.createTextNode(dictionary[word]?.category ?? 'N/A');
    categoryTd.appendChild(categoryTextNode);

    // add <td> rows to <tr>
    tr.appendChild(keywordTd);
    tr.appendChild(descriptionTd);
    tr.appendChild(codeTd);
    tr.appendChild(categoryTd);

    // add <tr> row to <tbody>
    dictBody.appendChild(tr);
  })
}

// show toast message
export const toastMessage = (message) => {
  toastText.innerHTML = message;
  toast.show()
}
