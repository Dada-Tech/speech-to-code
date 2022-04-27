import { initCodeConsole } from './components/code-console.js';
import { initTensorNLP } from './components/tensor-transfer-model.js';

// Index of app
const App = () => {
  initCodeConsole();
  initTensorNLP();
}



App();