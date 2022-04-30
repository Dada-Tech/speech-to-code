import { BACKGROUND_NOISE_TAG } from "@tensorflow-models/speech-commands";
import { speechCodeConfig } from "./config.js";
import { setInstructions, getDateString, fileNameListen } from "./util.js";
import { onDictChange, wordDictFunctions, defaultWordDictionary } from "./dictionary.js";
import { updateCodeMirror } from "./code-console.js";

// noinspection JSUnusedLocalSymbols
const tf = require('@tensorflow/tfjs');
const speechCommands = require('@tensorflow-models/speech-commands');

const startButton = document.getElementById('start');
const uploadFilesButton = document.getElementById('upload-dataset');
const datasetFileInput = document.getElementById('dataset-file-input');
const datasetFileInputLabel = document.getElementById('dataset-file-input-label');
const downloadAsFileButton = document.getElementById('download-dataset');
const loadTransferModelButton = document.getElementById('load-transfer-model');
const savedTransferModelsSelect =
  document.getElementById('saved-transfer-models');
const evalModelOnDatasetButton =
  document.getElementById('eval-model-on-dataset');
const transferModelNameInput = document.getElementById('transfer-model-name');
const learnWordsInput = document.getElementById('learn-words');

let baseRecognizer;
let transferRecognizer;
let transferWords = []; // Array of words that the recognizer is trained to recognize.
let recognizer;
let transferDurationMultiplier = 2;
let wordDict = defaultWordDictionary;

// INIT
export async function initTensorNLP() {
  // When calling `create()`, you must provide the type of the audio input.
  // The two available options are `BROWSER_FFT` and `SOFT_FFT`.
  // - BROWSER_FFT uses the browser's native Fourier transform.
  // - SOFT_FFT uses JavaScript implementations of Fourier transform
  //   (not implemented yet).
  baseRecognizer = speechCommands.create('BROWSER_FFT');

  // Make sure that the underlying model and metadata are loaded via HTTPS
  // requests.
  await baseRecognizer.ensureModelLoaded();

  await populateSavedTransferModelsSelect();
}

// when the dictionary changes, update the word
onDictChange((newDict) => wordDict = newDict);

const predictWordStart = () => {
  // array of words that the recognizer is trained to recognize.
  transferWords = transferRecognizer.wordLabels();
  setInstructions('Trained!\nListening for words: ' + transferWords.join(','));

  // `listen()` takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  transferRecognizer.listen(onWordRecognize, speechCodeConfig.recognitionConfig);

  setStartButtonEnabled(false);
};

const predictWordStop = (seconds = 0) => {
  setTimeout(() => {
    recognizer.stopListening();
    console.log('listening ended');
  }, seconds * 1000);
  setStartButtonEnabled(true);
};

//  result.scores contains the probability scores that correspond to recognizer.wordLabels().
//  result.spectrogram contains the spectrogram of the recognized word.
const onWordRecognize = (result) => {
  let {scores} = result;
  // Turn scores into a list of (score,word) pairs.
  scores = Array.from(scores).map((s, i) => ({score: s, word: transferWords[i]}));
  // Find the most probable word.
  scores.sort((s1, s2) => s2.score - s1.score);
  const predictedWord = scores[0].word;

  setInstructions('Predicted word: ' + predictedWord);
  console.log(predictedWord);

  // stop when keyword stop is heard
  if (predictedWord === wordDictFunctions.stop) {
    predictWordStop();
  } else if (wordDict[predictedWord]) {
    updateCodeMirror(wordDict[predictedWord].code);
    console.log('pasting mapped value of ' + predictedWord, wordDict[predictedWord].code);
  }
};

// predict words on click
startButton.addEventListener('click', async () => {
  if (!recognizer) {
    setInstructions('...Training Transfer Model');
    await transferLearningModelTrain();
  }
  predictWordStart();
});

const setStartButtonEnabled = (enabled) => {
  startButton.disabled = !enabled
}

const transferLearningModelTrain = async () => {
  console.log(transferRecognizer.countExamples());

  // Start training of the transfer-learning model.
  // You can specify `epochs` (number of training epochs) and `callback`
  // (the Model.fit callback to use during training), among other configuration
  // fields.
  await transferRecognizer.train({
    epochs: 25,
    callback: {
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
      },
    },
  });

  recognizer = transferRecognizer;
  startButton.disabled = false
};

// *** bookmark-4 *** download file button
downloadAsFileButton.addEventListener('click', () => {
  const basename = getDateString();
  const artifacts = transferRecognizer.serializeExamples();

  // Trigger downloading of the data .bin file.
  const anchor = document.createElement('a');
  const blob = new Blob([artifacts], {type: 'application/octet-stream'});
  anchor.download = `${basename}.bin`;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.title = basename;
  document.body.appendChild(anchor);
  anchor.click();
});

// *** bookmark-6 *** UPLOAD DATASET FILE
uploadFilesButton.addEventListener('click', async () => {
  const files = datasetFileInput.files;
  if (files === null || files.length !== 1) {
    datasetFileInputLabel.innerHTML = speechCodeConfig.NO_FILE_MESSAGE_LABEL;
    throw new Error(speechCodeConfig.NO_FILE_ERROR_MESSAGE);
  }
  const datasetFileReader = new FileReader();
  datasetFileReader.onload = async (event) => {
    try {
      await loadDatasetInTransferRecognizer(event.target.result);
    } catch (err) {
      console.log(err);
      const originalTextContent = uploadFilesButton.textContent;
      uploadFilesButton.textContent = err.message;
      setTimeout(() => {
        uploadFilesButton.textContent = originalTextContent;
      }, 2000);
    }
  };
  datasetFileReader.onerror = () =>
    console.error(speechCodeConfig.FAILED_BINARY_FILE_READ_ERROR_MESSAGE);
  datasetFileReader.readAsArrayBuffer(files[0]);
});

// *** bookmark-5 *** LOAD Model BUTTON
loadTransferModelButton.addEventListener('click', async () => {
  const transferModelName = savedTransferModelsSelect.value;
  await baseRecognizer.ensureModelLoaded(); // Recognizer is the base model
  transferRecognizer = baseRecognizer.createTransfer(transferModelName); // transfer recognizer is the model you trained
  await transferRecognizer.load();
  transferModelNameInput.value = transferModelName;
  learnWordsInput.value = transferRecognizer.wordLabels().join(',');
  loadTransferModelButton.textContent = 'Model loaded!';
  recognizer = transferRecognizer;

  setStartButtonEnabled(true);
  setInstructions('Model Loaded!\n' + speechCodeConfig.START_INSTRUCTIONS)
});

// *** bookmark-3 *** Load dataset
async function loadDatasetInTransferRecognizer(serialized) {
  let modelName = transferModelNameInput.value;
  if (modelName == null || modelName.length === 0) {
    console.log('setting default model name as none was given');
    transferModelNameInput.value = getDateString();
    modelName = transferModelNameInput.value;
  }

  if (transferRecognizer == null) {
    transferRecognizer = baseRecognizer.createTransfer(modelName);
  }
  transferRecognizer.loadExamples(serialized);
  const exampleCounts = transferRecognizer.countExamples();
  transferWords = [];
  const modelNumFrames = transferRecognizer.modelInputShape()[1];
  const durationMultipliers = [];
  for (const word in exampleCounts) {
    transferWords.push(word);
    const examples = transferRecognizer.getExamples(word);
    for (const example of examples) {
      const spectrogram = example.example.spectrogram;
      // Ignore _background_noise_ examples when determining the duration
      // multiplier of the dataset.
      if (word !== BACKGROUND_NOISE_TAG) {
        durationMultipliers.push(Math.round(
          spectrogram.data.length / spectrogram.frameSize / modelNumFrames));
      }
    }
  }
  transferWords.sort();
  learnWordsInput.value = transferWords.join(',');

  // Determine the transferDurationMultiplier value from the dataset.
  transferDurationMultiplier =
    durationMultipliers.length > 0 ? Math.max(...durationMultipliers) : 1;
  console.log(speechCodeConfig.LINE_BREAK_FORMATTED);
  setInstructions('DataSet Loaded!\n' + speechCodeConfig.START_INSTRUCTIONS);
  setStartButtonEnabled(true);
  console.log(
    `Determined transferDurationMultiplier from uploaded ` +
    `dataset: ${transferDurationMultiplier}`);
  console.log(transferRecognizer);
  console.log(speechCodeConfig.LINE_BREAK_FORMATTED);
}

// *** bookmark-2 *** Populate Model fn
async function populateSavedTransferModelsSelect() {
  const savedModelKeys = await speechCommands.listSavedTransferModels();
  while (savedTransferModelsSelect.firstChild) {
    savedTransferModelsSelect.removeChild(savedTransferModelsSelect.firstChild);
  }
  if (savedModelKeys.length > 0) {
    for (const key of savedModelKeys) {
      const option = document.createElement('option');
      option.textContent = key;
      option.id = key;
      savedTransferModelsSelect.appendChild(option);
    }
    loadTransferModelButton.disabled = false;
  }
}

// *** bookmark-7 EVALUATE MODEL ON DATASET
evalModelOnDatasetButton.addEventListener('click', async () => {
  const files = datasetFileInput.files;
  if (files === null || files.length !== 1) {
    throw new Error(speechCodeConfig.NO_FILE_ERROR_MESSAGE);
  }
  const datasetFileReader = new FileReader();
  datasetFileReader.onload = async (event) => {
    try {
      if (transferRecognizer === null) {
        console.error(speechCodeConfig.NO_MODEL_ERROR_MESSAGE);
      }

      // Load the dataset and perform evaluation of the transfer
      // model using the dataset.
      transferRecognizer.loadExamples(event.target.result);
      const evalResult = await transferRecognizer.evaluate({
        windowHopRatio: 0.25,
        wordProbThresholds: [
          0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5,
          0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0,
        ],
      });
      console.log(evalResult);
    } catch (err) {
      const originalTextContent = evalModelOnDatasetButton.textContent;
      evalModelOnDatasetButton.textContent = err.message;
      setTimeout(() => {
        evalModelOnDatasetButton.textContent = originalTextContent;
      }, 2000);
    }
  };
  datasetFileReader.onerror = () =>
    console.error(speechCodeConfig.FAILED_BINARY_FILE_READ_ERROR_MESSAGE);
  datasetFileReader.readAsArrayBuffer(files[0]);
  setStartButtonEnabled(true);
});

// change dataset filename label on input
fileNameListen(datasetFileInput, datasetFileInputLabel, () => loadTransferModelButton.click())
