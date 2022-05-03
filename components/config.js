// - NLP -
// baseRecognizer.listen config can adjust fields such as
//    - includeSpectrogram
//    - probabilityThreshold
//    - includeEmbedding
const recognitionConfig = {
  probabilityThreshold: 0.80,
};

//  - Logging -
const LOGGING = true;
const LINE_BREAK_FORMATTED = '--------------------------'; // separator used in logging

//  - Instructions -
const START_INSTRUCTIONS = 'Press "Start" to being listening';
const BEGINNING_INSTRUCTIONS = 'Start by choosing a Dataset file to upload or loading a saved Model';

// Dictionary
const DICTIONARY_ACTION_LABEL = 'actions'
const DICTIONARY_TEXT_LABEL = 'text'
const DICTIONARY_WAKE_WORD_LABEL = 'javascript'
const DICTIONARY_PAUSE_LABEL = 'pause'
const DICTIONARY_CATEGORIES_LABEL = 'categories'
const DICTIONARY_STOP_LABEL = 'stop'
const DICTIONARY_CODE_LABEL = 'code'

// - Error Messages -
const NO_FILE_MESSAGE_LABEL = 'Must select exactly one file! Click here to upload file.'
const NO_FILE_ERROR_MESSAGE = 'Must select exactly one file.';
const FAILED_FILE_READ_ERROR_MESSAGE = 'Failed to read file';
const FAILED_BINARY_FILE_READ_ERROR_MESSAGE = 'Failed to read binary data from file';
const NO_MODEL_ERROR_MESSAGE = 'There is no model!';

export const speechCodeConfig = {
  recognitionConfig,
  LOGGING,
  BEGINNING_INSTRUCTIONS,
  LINE_BREAK_FORMATTED,
  START_INSTRUCTIONS,
  NO_FILE_MESSAGE_LABEL,
  NO_FILE_ERROR_MESSAGE,
  FAILED_BINARY_FILE_READ_ERROR_MESSAGE,
  FAILED_FILE_READ_ERROR_MESSAGE,
  NO_MODEL_ERROR_MESSAGE
}

export const dictionaryCategories = {
  DICTIONARY_ACTION_LABEL,
  DICTIONARY_CODE_LABEL,
  DICTIONARY_CATEGORIES_LABEL,
  DICTIONARY_TEXT_LABEL,
  DICTIONARY_WAKE_WORD_LABEL,
  DICTIONARY_PAUSE_LABEL,
  DICTIONARY_STOP_LABEL
}