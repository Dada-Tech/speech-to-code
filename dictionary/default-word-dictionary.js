const dictionary = document.getElementById('dictionary');

export const wordDict = {
  function: {
    code: 'function temp() {\n' +
      '  \n' +
      '}\n',
    description: 'create a javascript function'
  },
  ifelse: {
    code: 'if () {\n' +
      '  \n' +
      '} else {\n' +
      '  \n' +
      '}\n',
    description: 'paste an empty if-else block'
  },
  trycatch: {
    code: 'try {\n' +
      '\n' +
      '} catch (e) {\n' +
      '  console.log(\'an error has occurred: \', e);\n' +
      '}\n',
    description: 'paste a formatted try-catch block with error printing'
  },
  red: {
    code: '"Red"',
    description: 'will paste the word "Red"'
  },
  green: {
    code: '"Green"',
    description: 'will paste the word "Green"'
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