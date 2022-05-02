import { fileNameListen, setTable } from "./util.js";
import { speechCodeConfig } from "./config.js";
export const defaultWordDictionary = require('../dictionary/default-dictionary.json');
export const wordDictFunctions = require('../dictionary/function-dictionary.json');

const functionDictionaryElement = document.getElementById('function-dictionary');
const dictionaryElement = document.getElementById('dictionary');
const dictionaryUploadButton = document.getElementById('upload-dictionary');
const dictionaryFileInput = document.getElementById('dictionary-file-input');
const dictionaryFileInputLabel = document.getElementById('dictionary-file-input-label');

/**
 * Populate table of the keyword dictionary
 * @param dictionary dictionary of words
 */
export const setWordDictionary = (dictionary) => {
  setTable(dictionaryElement, dictionary)
}

/**
 * Populate table of the function dictionary
 * @param dictionary dictionary of words
 */
export const setFunctionDictionary = (dictionary) => {
  setTable(functionDictionaryElement, dictionary)
}

export const onDictChange = (callbackFn) => {
  dictionaryUploadButton.addEventListener('click', async () => {
    const files = dictionaryFileInput.files;
    if (files == null || files.length !== 1) {
      dictionaryFileInputLabel.innerHTML = speechCodeConfig.NO_FILE_MESSAGE_LABEL;
      return;
    }
    
    const dictionaryFileReader = new FileReader();
    dictionaryFileReader.onload = async (event) => {
      try {
        // set new word dictionary
        const newWordDictionary = JSON.parse('' + event.target.result);
        setWordDictionary(newWordDictionary);
        callbackFn(newWordDictionary);
      } catch (err) {
        console.log(err);
      }
    };
    dictionaryFileReader.onerror = () => console.error(speechCodeConfig.FAILED_FILE_READ_ERROR_MESSAGE);
    dictionaryFileReader.readAsText(files[0]);
  });
}

// set table of special keyword functions
setFunctionDictionary(wordDictFunctions);

// set table of the default dictionary
setWordDictionary(defaultWordDictionary);

// change dictionary filename label on input
fileNameListen(dictionaryFileInput, dictionaryFileInputLabel, () => dictionaryUploadButton.click())