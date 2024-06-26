/*
 * @Author: yxfan
 * @Date: 2024-06-01 15:17:35
 * @LastEditTime: 2024-06-26 17:30:38
 * @FilePath: /Day2/vite-runner/App.jsx
 * @Description: 
 */
import React from "./core/React.js";
// 这里vite会把jsx默认转化成 React.createElement方法调用

let count = 0;
let showBar = true;
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

    const foo = (
        <div>
            foo
            <div>children1</div>
            <div>children2</div>
        </div>
    )
    return (
        <div id="yxfan">
        
            <div>{showBar ? foo : <div>bar</div>}</div>
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
