import { defaultWordDictionary } from "../dictionary/default-word-dictionary.js";
import { fileNameListen, setTable } from "./util.js";
import { speechCodeConfig } from "./config.js";

const functionDictionaryElement = document.getElementById('function-dictionary');
const dictionaryElement = document.getElementById('dictionary');
const dictionaryUploadButton = document.getElementById('upload-dictionary');
const dictionaryFileInput = document.getElementById('dictionary-file-input');
const dictionaryFileInputLabel = document.getElementById('dictionary-file-input-label');

export const wordDictFunctions = {
  stop: {
    description: 'stop listening for keywords'
  }
}

/**
 * Populate table of keywords in a dictionary
 * @param dictionary dictionary of words
 */
export const setDict = (dictionary) => {
  setTable(dictionaryElement, dictionary)
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
        // set new dictionary
        const newDict = JSON.parse('' + event.target.result);
        setDict(newDict);
        callbackFn(newDict);
      } catch (err) {
        console.log(err);
      }
    };
    dictionaryFileReader.onerror = () => console.error(speechCodeConfig.FAILED_FILE_READ_ERROR_MESSAGE);
    dictionaryFileReader.readAsText(files[0]);
  });
}

// set table of special keyword functions
setTable(functionDictionaryElement, wordDictFunctions);

// set table of the default dictionary
setDict(defaultWordDictionary);

// change dictionary filename label on input
fileNameListen(dictionaryFileInput, dictionaryFileInputLabel, () => dictionaryUploadButton.click())

