import React from "./core/React.js";
// 这里vite会把jsx默认转化成 React.createElement方法调用

function S() {
    return <h3>sun</h3>
}
function T() {
    return <h2>T<S></S></h2>;
}
function App() {
    return (
        <div>
            app
            {/* <h2>T</h2> */}
            <T />
        </div>
    );
}
// console.log(App, () => {
//     return <div>111</div>;
// });
export default App;
