/*
 * @Author: yxfan
 * @Date: 2024-06-01 15:17:35
 * @LastEditTime: 2024-06-12 21:07:32
 * @FilePath: /mini-react-learn/Day2/vite-runner/App.jsx
 * @Description: 
 */
import React from "./core/React.js";
// 这里vite会把jsx默认转化成 React.createElement方法调用

function Count({ num }) {
    function hnadleClick() {
        console.log('click');
    }
    return (
        <div>
            Count: {num}
            <button onClick={hnadleClick}>click</button>
        </div>
    );
}
function App() {
    return (
        <div>
            app
            {/* <h2>T</h2> */}
            <Count num={10} />
            {/* <Count num={20} /> */}

        </div>
    );
}
// console.log(App, () => {
//     return <div>111</div>;
// });
export default App;
