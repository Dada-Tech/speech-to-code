const CODE_MIRROR_INITIAL_VALUE =
  '// Return a value to see it printed upon compilation\n'
  + '// Otherwise follow instructions below.\n\n'
  + '\nlet x = 2\n'
  + 'return x'

const instructions = $("#instructions")
const compiledCodeOutputConsole = document.getElementById('result')

const setInstructions = (text) => {
  instructions.text(text)
}

// create CodeMirror text editor
const editor = CodeMirror.fromTextArea(document.getElementById('textbox'), {
  mode: "javascript",
  lineNumbers: true,
  theme: "darcula"
});
editor.save()

const updateCodeMirror = (data) => {
  var doc = editor.getDoc();
  var cursor = doc.getCursor(); // gets the line number in the cursor position
  doc.replaceRange(data, cursor); // adds a new line
}

// init values
updateCodeMirror(CODE_MIRROR_INITIAL_VALUE)

// compile code & print result
$("#run").click(() => {
  const code = editor.getDoc().getValue()
  const fn = new Function(code)
  compiledCodeOutputConsole.innerHTML = 'Compiled Result:\n>> ' + fn()
})
