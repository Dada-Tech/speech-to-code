const dictionary = document.getElementById('dictionary');

export const wordDict = {
  function: {
    code: 'paste function',
    description: 'dummy text'
  },
  red: {
    code: 'paste function',
    description: 'will paste "Red"'
  },
  green: {
    code: 'paste function',
    description: 'will paste "Green"'
  },
}

export const wordDictFunctions = {
  stop: 'stop'
}

const setDict = () => {
  let dictString = ""
  Object.keys(wordDict).forEach(word => dictString += `${word}: ${wordDict[word].description}\n`)
  dictionary.innerHTML = dictString;
}

setDict();