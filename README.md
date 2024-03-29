# speech-to-code
Limited Keyword Speech Synthesis Leveraging Transfer Learning  

## How to run
* yarn install  
* yarn start

## Permissions
It requires microphone permissions, asked via browser.

## Seeing Samples:
the samples that the datasets are comprised of are in an ArrayBuffer/byte form.
To See the actual samples (and to add more training data), upload a dataset file (found in /datasets) to https://storage.googleapis.com/tfjs-speech-model-test/2019-01-03a/dist/index.html in the "Dataset IO" section.

# Features

## NLP
This project primarily accepts a labelled dataset of word samples.  
Transfer learning is then used to re-train the model with the inputted dataset of entirely new words.

[Tensorflow Transfer Learning API](https://github.com/tensorflow/tfjs-models/tree/master/speech-commands#transfer-learning) docs describe this process in depth as:
> The modification process involves removing the top (output) dense layer of the original model and keeping the "base" 
> of the model. Due to its previous training, the base can be used as a good feature extractor for any data similar to 
> the original training data. The removed dense layer is replaced with a new dense layer configured specifically for 
> the new dataset.

## Speech Commands
You may upload your own pre-defined set of speech commands via this syntax


## Code Console
This project integrates a Javascript IDE in the browser to allow for simple Javascript programming.  

# Examples

### Word prediction
![speech-to-code-predicting-word.png](resources/speech-to-code-predicting-word.png)

### Command Dictionaries
![speech-to-code-command-dictionary.png](resources/speech-to-code-command-dictionary.png)

![speech-to-code-keyword-dictionary.png](resources/speech-to-code-keyword-dictionary.png)

## Videos
[speech-to-code-programming.mp4](resources/speech-to-code-programming.mp4)

[speech-to-code-categories-actions.mp4](resources/speech-to-code-categories-actions.mp4)

