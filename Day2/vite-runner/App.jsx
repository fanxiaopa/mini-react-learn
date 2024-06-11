import React from "./core/React.js";
// 这里vite会把jsx默认转化成 React.createElement方法调用

function Count({ num }) {
    return <div>Count: {num}</div>;
}
function App() {
    return (
        <div>
            app
            {/* <h2>T</h2> */}
            <Count num={10} />
            <Count num={20} />

        </div>
    );
}
// console.log(App, () => {
//     return <div>111</div>;
// });
export default App;
