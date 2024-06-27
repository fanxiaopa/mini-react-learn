/*
 * @Author: yxfan
 * @Date: 2024-06-01 15:17:35
 * @LastEditTime: 2024-06-27 16:23:45
 * @FilePath: /mini-react-learn/Day2/vite-runner/App.jsx
 * @Description: 
 */
import React from "./core/React.js";
// 这里vite会把jsx默认转化成 React.createElement方法调用

let count = 0;
let countApp = 0;
let countBar = 0;
let countFoo = 0;
let showBar = false;
function Count({ num }) {
    function hnadleClick() {
        count++;
        React.update();
    }
    return (
        <div id="yxfan2"> 
            Count: {count}
            <button onClick={hnadleClick}>click</button>
        </div>
    );
}
function Foo() {
    const update = React.update();
    function handleClick() {
        countFoo++;
        update();
    }
    console.log('Foo render');
    return (
        <div id="foo">
            {countFoo}
            <button onClick={handleClick}>切换</button>
        </div>
    )
}
function Bar() {
    const update = React.update();
    function handleClick() {
        countBar++;
        update();
    }
    console.log('Bar render');

    function Bar2() {
        return (
            <div>bar2</div>
        )
    }
    return (
        <div id="bar">
            {countBar}
            <button onClick={handleClick}>切换</button>
            {/* <Bar2 /> */}
        </div>
    )
}
function App() {
    const update = React.update();
    function handleClick() {
        countApp++;
        update();
    }

    console.log('App render');
    return (
        <div id="yxfan1"> 
            {countApp}
            <button onClick={handleClick}>点击</button>
            <h2>子组件bar</h2>
            <Bar />
            <h2>子组件foo</h2>
            <Foo />

        </div>
    );
}
// console.log(App, () => {
//     return <div>111</div>;
// });
export default App;
