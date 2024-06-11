// 这里vite会把jsx默认转化成 React.createElement方法调用, 所以要引入一次React
import React from "./core/React.js";


import ReactDOM from "./core/ReactDom.js";
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);



