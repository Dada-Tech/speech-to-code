// - NLP -
// baseRecognizer.listen config can adjust fields such as
//    - includeSpectrogram
//    - probabilityThreshold
//    - includeEmbedding
const recognitionConfig = {
  probabilityThreshold: 0.98,
};

//  - Logging -
const LOGGING = true;
const LINE_BREAK_FORMATTED = '--------------------------'; // separator used in logging

//  - Code Console -
const START_INSTRUCTIONS = 'Press "Start" to being listening';


export const config = { recognitionConfig, LOGGING, LINE_BREAK_FORMATTED, START_INSTRUCTIONS }