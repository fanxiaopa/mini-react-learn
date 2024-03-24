/**@jsx CReact.createElement  */
import CReact from "./core/React.js";

// 这里vite会把jsx默认转化成 React.createElement方法调用，恰好与自己的React实现同名，因此进入自己的React逻辑中
const App = <div>app</div>

console.log(App, () => {
    return <div>111</div>
})
export default App;