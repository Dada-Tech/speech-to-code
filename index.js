import { app } from "./tensor-transfer-model.js";

app();

var instructions = $("#instructions")
const compiledCodeOutputConsole = document.getElementById('result')

// create CodeMirror text editor
var editor = CodeMirror.fromTextArea(document.getElementById('textbox'), {
  mode: "javascript",
  lineNumbers: true,
  theme: "darcula"
});
editor.save()

// post instructions
instructions.text("Listening...")

// remove hidden on first instruction
// output.classList.remove("hide");

// init values
const initvalue =
  '// Return a value to see it compile, or start programming with your voice and text.' +
  '\n// try simple commands like: "return X plus 5" then press compile.' +
  '\nlet x = 2\n'
updateCodeMirror(initvalue)

function updateCodeMirror(data) {
  var doc = editor.getDoc();
  var cursor = doc.getCursor(); // gets the line number in the cursor position
  doc.replaceRange(data, cursor); // adds a new line
}

// compile code & print result
$("#run").click(function() {
  const code = editor.getDoc().getValue()
  const fn = new Function(code)
  compiledCodeOutputConsole.innerHTML = 'Compiled Result:\n>> ' + fn()
})
