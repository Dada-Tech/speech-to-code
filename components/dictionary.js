import { fileNameListen, setTable } from "./util.js";
import { dictionaryCategories, speechCodeConfig } from "./config.js";

export const defaultWordDictionary = require('../dictionaries/default-dictionary.json');
export const systemFunctionDictionary = require('../dictionaries/system-function-dictionary.json');

const functionDictionaryElement = document.getElementById('function-dictionary');
const dictionaryElement = document.getElementById('dictionary');
const dictionaryUploadButton = document.getElementById('upload-dictionary');
const dictionaryFileInput = document.getElementById('dictionary-file-input');
const dictionaryFileInputLabel = document.getElementById('dictionary-file-input-label');

/**
 * Populate table of the keyword dictionaries
 * @param dictionary dictionaries of words
 */
export const setWordDictionary = (dictionary) => {
  setTable(dictionaryElement, dictionary)
}

/**
 * Populate table of the function dictionaries
 * @param dictionary dictionaries of words
 */
export const setFunctionDictionary = (dictionary) => {
  setTable(functionDictionaryElement, dictionary)
}

/**
 * Extract dictionaries words of a category
 * @param dictionary word dictionaries
 * @param category dictionaries category
 * @returns object of categories
 */
export const getWordsByCategory = (dictionary, category) => {
  const activeWordDictionary = {}

  Object.entries(dictionary).forEach(([key, value]) => {
    if (value.category === category) {
      activeWordDictionary[key] = value
    }
  })
  return activeWordDictionary;
};

/**
 * Extract functions from keyword dictionaries
 * @param dictionary word dictionaries
 * @returns object of functions
 */
export const extractDictionaryFunctions = (dictionary) => {
  const activeFunctionDictionary = {}

  Object.entries(systemFunctionDictionary).forEach(([key, value]) => {
    // if it exists in passed in dictionaries
    if (dictionary[key]) {
      // function exists
      activeFunctionDictionary[key] = value
    }
  })
  return activeFunctionDictionary;
};

/**
 * Extract functions from keyword dictionaries
 * @param dictionary word dictionaries
 * @returns object of functions
 */
export const extractDictionaryWords = (dictionary) => {
  const activeWordDictionary = {}

  Object.entries(dictionary).forEach(([key, value]) => {
    // if it isn't category
    if (value.category !== dictionaryCategories.DICTIONARY_ACTION_LABEL) {
      // it's a non-function word
      activeWordDictionary[key] = value
    }
  })
  return activeWordDictionary;
};

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
        // set new word dictionaries
        const newWordDictionary = JSON.parse('' + event.target.result);
        setWordDictionary(extractDictionaryWords(newWordDictionary));
        setFunctionDictionary(extractDictionaryFunctions(newWordDictionary));
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
setFunctionDictionary(systemFunctionDictionary);

// set table of the default dictionaries
setWordDictionary(extractDictionaryWords(defaultWordDictionary));

// change dictionaries filename label on input
fileNameListen(dictionaryFileInput, dictionaryFileInputLabel, () => dictionaryUploadButton.click())