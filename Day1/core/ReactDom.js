import React from './React.js';

const ReactDOM = {
    createRoot(container) {
        return {
            render(component) {
                React.render(component, container)
            }
        }
    }
}

export default ReactDOM;