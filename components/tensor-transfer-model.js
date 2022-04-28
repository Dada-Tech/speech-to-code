import { setInstructions, getDateString } from "./util.js";

// noinspection JSUnusedLocalSymbols
const tf = require('@tensorflow/tfjs');
const speechCommands = require('@tensorflow-models/speech-commands');

const startButton = document.getElementById('start');
const uploadFilesButton = document.getElementById('upload-dataset');
const datasetFileInput = document.getElementById('dataset-file-input');
const datasetFileInputLabel = document.getElementById('dataset-file-input-label');
const downloadAsFileButton = document.getElementById('download-dataset');
const loadTransferModelButton = document.getElementById('load-transfer-model');
const durationMultiplierSelect = document.getElementById('duration-multiplier');
const savedTransferModelsSelect =
  document.getElementById('saved-transfer-models');
const evalModelOnDatasetButton =
  document.getElementById('eval-model-on-dataset');
const transferModelNameInput = document.getElementById('transfer-model-name');
const learnWordsInput = document.getElementById('learn-words');
const LINE_BREAK_FORMATTED = '--------------------------';

let baseRecognizer;
let transferRecognizer;
let transferWords = []; // Array of words that the recognizer is trained to recognize.
let recognizer;
let transferDurationMultiplier;
const BACKGROUND_NOISE_TAG = '_background_noise_';
const STOP_TAG = 'stop';


// baseRecognizer.listen config can adjust fields such as
//    - includeSpectrogram
//    - probabilityThreshold
//    - includeEmbedding
const recognitionConfig = {
  probabilityThreshold: 0.75,
};

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

  recognizer = baseRecognizer;

  await populateSavedTransferModelsSelect();

  // transferRecognizer = baseRecognizer;
  // predictWordStart();
}

const predictWordStart = () => {
  console.log('listening for words');
  // array of words that the recognizer is trained to recognize.
  transferWords = transferRecognizer.wordLabels();
  console.log(transferWords);

  // `listen()` takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  transferRecognizer.listen(onWordRecognize, recognitionConfig);
};

const predictWordStop = (seconds = 0) => {
  setTimeout(() => {
    baseRecognizer.stopListening();
    console.log('listening ended');
  }, seconds * 1000);
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
  document.querySelector('#output-tensor').textContent = predictedWord;

  console.log(predictedWord);
  // stop when keyword stop is heard
  if (predictedWord === STOP_TAG) {
    predictWordStop();
  }
};

// predict words on click
startButton.addEventListener('click', async () => {
  await transferLearningModelTrain();
  predictWordStart();
});

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
};


// *** bookmark-4 *** download file button
downloadAsFileButton.addEventListener('click', () => {
  const basename = getDateString();
  const artifacts = transferRecognizer.serializeExamples();
  const linkText = document.createTextNode(basename);

  // Trigger downloading of the data .bin file.
  const anchor = document.createElement('a');
  const blob = new Blob([artifacts], {type: 'application/octet-stream'});
  anchor.download = `${basename}.bin`;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.title = basename;
  anchor.appendChild(linkText);
  document.body.appendChild(anchor);
  anchor.click();
});

// *** bookmark-6 *** UPLOAD DATASET FILE
uploadFilesButton.addEventListener('click', async () => {
  const files = datasetFileInput.files;
  if (files == null || files.length !== 1) {
    throw new Error('Must select exactly one file.');
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
    durationMultiplierSelect.value = `${transferDurationMultiplier}`;
  };
  datasetFileReader.onerror = () =>
    console.error('Failed to binary data from file');
  datasetFileReader.readAsArrayBuffer(files[0]);
});

// *** bookmark-5 *** LOAD Model BUTTON
loadTransferModelButton.addEventListener('click', async () => {
  const transferModelName = savedTransferModelsSelect.value;
  await recognizer.ensureModelLoaded(); // Recognizer is the base model
  transferRecognizer = recognizer.createTransfer(transferModelName); // transfer recognizer is the model you trained
  await transferRecognizer.load();
  transferModelNameInput.value = transferModelName;
  learnWordsInput.value = transferRecognizer.wordLabels().join(',');
  loadTransferModelButton.textContent = 'Model loaded!';
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
    transferRecognizer = recognizer.createTransfer(modelName);
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
  console.log(LINE_BREAK_FORMATTED);
  setInstructions('DataSet Loaded!\n Press "Start" to being listening');
  console.log(
      `Determined transferDurationMultiplier from uploaded ` +
    `dataset: ${transferDurationMultiplier}`);
  console.log(transferRecognizer);
  console.log(LINE_BREAK_FORMATTED);

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
  if (files == null || files.length !== 1) {
    throw new Error('Must select exactly one file.');
  }
  const datasetFileReader = new FileReader();
  datasetFileReader.onload = async (event) => {
    try {
      if (transferRecognizer == null) {
        console.error('There is no model!');
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
    console.error('Failed to binary data from file');
  datasetFileReader.readAsArrayBuffer(files[0]);
});

// change filename label on input
datasetFileInput.addEventListener('change', () => {
  datasetFileInputLabel.innerHTML = datasetFileInput.files[0].name || 'Choose file';
  if(datasetFileInput.files.length > 0) {
    setInstructions('Click "Upload Dataset" to load the dataset.')
  }

});
