// tf imported from script CDN
// speechCommands imported from script CDN

let baseRecognizer;
let words = []; // Array of words that the recognizer is trained to recognize.

// baseRecognizer.listen config can adjust fields such as
//    - includeSpectrogram
//    - probabilityThreshold
//    - includeEmbedding
const recognitionConfig = {
  probabilityThreshold: 0.75
}

const predictWordStart = () => {
  // `listen()` takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  baseRecognizer.listen(onWordRecognize, recognitionConfig);
}

const predictWordStop = (seconds = 0) => {
  setTimeout(() => {
    baseRecognizer.stopListening()
    console.log('listening ended');
  }, seconds * 1000);
}

//  result.scores contains the probability scores that correspond to recognizer.wordLabels().
//  result.spectrogram contains the spectrogram of the recognized word.
const onWordRecognize = (result) => {
  let {scores} = result;
  // Turn scores into a list of (score,word) pairs.
  scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
  // Find the most probable word.
  scores.sort((s1, s2) => s2.score - s1.score);
  document.querySelector('#output-tensor').textContent = scores[0].word;

  // stop when keyword stop is heard
  if(scores[0].word === 'stop') {
    predictWordStop();
  }
}

export async function app() {
  // When calling `create()`, you must provide the type of the audio input.
  // The two available options are `BROWSER_FFT` and `SOFT_FFT`.
  // - BROWSER_FFT uses the browser's native Fourier transform.
  // - SOFT_FFT uses JavaScript implementations of Fourier transform
  //   (not implemented yet).
  baseRecognizer = speechCommands.create('BROWSER_FFT');

  // Make sure that the underlying model and metadata are loaded via HTTPS
  // requests.
  await baseRecognizer.ensureModelLoaded();

  // array of words that the recognizer is trained to recognize.
  words = baseRecognizer.wordLabels();

  predictWordStart();
}
