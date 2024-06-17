/*
 * @Author: yxfan
 * @Date: 2024-06-01 15:17:35
 * @LastEditTime: 2024-06-17 20:47:29
 * @FilePath: /mini-react-learn/Day2/vite-runner/App.jsx
 * @Description: 
 */
import React from "./core/React.js";
// 这里vite会把jsx默认转化成 React.createElement方法调用

let count = 0;
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
function ShowBar() {
    function handleShow() {
        showBar = !showBar;
        React.update();
    }
    function Foo() {
        return <div>foo</div>
    }
    return (
        <div id="yxfan">
            <div>{showBar ? <Foo/> : <p>bar</p>}</div>
            <button onClick={handleShow}>切换</button>
        </div>
    )
}
function App() {
    return (
        <div id="yxfan"> 
            {/* 10 */}
            {/* app */}
            {/* <h2>T</h2> */}
            {/* <Count num={10} /> */}
            <ShowBar />
            {/* <Count num={20} /> */}

        </div>
    );
}
// console.log(App, () => {
//     return <div>111</div>;
// });
export default App;
