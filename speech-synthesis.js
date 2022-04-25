import { app } from "./tensor-transfer-model.js";

app();

// Sample Based off of https://dev.to/princejoel/building-a-speech-to-text-app-with-javascript-4a4d
var speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new speechRecognition()
var textbox = $("#textbox")
var instructions = $("#instructions")
var content = ''
recognition.continuous = true
var output = document.getElementById("output");

var editor = CodeMirror.fromTextArea(document.getElementById('textbox'), {
  mode: "javascript",
  lineNumbers: true,
  theme: "darcula"
});
editor.save()

// recognition is started
recognition.onstart = function() {
  instructions.text("Listening...")
}

recognition.onspeechend = function() {
  instructions.text("Standby")
}

recognition.onerror = function() {
  instruction.text("An Error has occurred; Try Again")
}

// init values
const initvalue =
  '// Return a value to see it compile, or start programming with your voice and text.' +
  '\n// try simple commands like: "return X plus 5" then press compile.' +
  '\nlet x = 2\n'
updateCodeMirror(initvalue)

function updateCodeMirror(data) {
  // editor.replaceRange(transcript, {line: Infinity});
  // editor.replaceRange(transcript, CodeMirror.Pos(editor.lastLine()))
  var doc = editor.getDoc();
  var cursor = doc.getCursor(); // gets the line number in the cursor position
  doc.replaceRange(data, cursor); // adds a new line
}

// function updateCodeMirror(data) {
//   var cm = $('.CodeMirror')[0].CodeMirror;
//   var doc = cm.getDoc();
//   var cursor = doc.getCursor(); // gets the line number in the cursor position
//   var line = doc.getLine(cursor.line); // get the line contents
//   console.log(doc);
//   var pos = { // create a new object to avoid mutation of the original selection
//     line: (doc.size+5),
//     ch: line.length - 1 // set the character position to the end of the line
//   }
//   doc.replaceRange('\n'+data+'\n', pos); // adds a new line
// }

$("#run").click(function() {
  const code = editor.getDoc().getValue()
  const resultEl = document.getElementById('result')
  const fn = new Function(code)
  resultEl.innerHTML = 'Compiled Result:\n>> ' + fn()
})

recognition.onresult = function(event) {
  var current = event.resultIndex;
  var transcript = event.results[current][0].transcript // simple transcript api, do yourself
  var confidence = event.results[0][0].confidence * 100; // do yourself
  var formattedConfidence = parseFloat(confidence).toFixed(2);

  updateCodeMirror(transcript)
  output.innerHTML = "<b>Text: </b> " + transcript + "<br/> <b>Confidence: </b> " + formattedConfidence + "%";
  output.classList.remove("hide");

  recognition.stop()
}

$("#start-btn").click(function(event) {
  recognition.start()
})

textbox.on('input', function() {
  content = $(this).val()
})