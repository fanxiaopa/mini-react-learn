function createElement(type, props, ...children) {
    console.log('!!!')
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                return typeof child === 'string' ? createTextNode(child) : child
            })
        }
    };
}

function createTextNode(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    };
}

function render(el, container) {
    const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type);
    // 处理props
    Object.keys(el.props).forEach(key => {
        if (key !== 'children') {
            dom[key] = el.props[key];
        }
    });
    // 处理children
    el.props.children.forEach(child => {
        render(child, dom);
    });
    container.append(dom);
}

export default { render, createElement }