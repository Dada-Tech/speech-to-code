// - NLP -
// baseRecognizer.listen config can adjust fields such as
//    - includeSpectrogram
//    - probabilityThreshold
//    - includeEmbedding
const recognitionConfig = {
  probabilityThreshold: 0.95,
};

//  - Logging -
const LOGGING = true;
const LINE_BREAK_FORMATTED = '--------------------------'; // separator used in logging

//  - Instructions -
const START_INSTRUCTIONS = 'Press "Start" to being listening';

// Dictionary
const DICTIONARY_ACTION_LABEL = 'actions'

// - Error Messages -
const NO_FILE_MESSAGE_LABEL = 'Must select exactly one file! Click here to upload file.'
const NO_FILE_ERROR_MESSAGE = 'Must select exactly one file.';
const FAILED_FILE_READ_ERROR_MESSAGE = 'Failed to read file';
const FAILED_BINARY_FILE_READ_ERROR_MESSAGE = 'Failed to read binary data from file';
const NO_MODEL_ERROR_MESSAGE = 'There is no model!';

export const speechCodeConfig = {
  recognitionConfig,
  LOGGING,
  DICTIONARY_ACTION_LABEL,
  LINE_BREAK_FORMATTED,
  START_INSTRUCTIONS,
  NO_FILE_MESSAGE_LABEL,
  NO_FILE_ERROR_MESSAGE,
  FAILED_BINARY_FILE_READ_ERROR_MESSAGE,
  FAILED_FILE_READ_ERROR_MESSAGE,
  NO_MODEL_ERROR_MESSAGE
}