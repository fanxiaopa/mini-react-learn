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
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
}

let nextWorkOfUnit = null;
function workLoop(deadline) {
    let shouldYield = false;
    while(!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkUnitOfWork(nextWorkOfUnit);
        shouldYield = deadline.timeRemaining < 1;
    }
    requestIdleCallback(workLoop);
}

function performWorkUnitOfWork(work) {
    if (!work.dom) {
        // 1、创建dom
        const dom = work.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(work.type);
        work.dom = dom;
        work.parent.dom.append(dom);
        // 2、处理props
        Object.keys(work.props).forEach(key => {
            if (key !== 'children') {
                dom[key] = work.props[key];
            }
        });
    }
    // 3、转换链表 设置指针
    const { children } = work.props;
    let preChild = null;
    children.forEach((child, index) => {
        const newWork = {
            type: child.type,
            props: child.props,
            child: null, 
            parent: work,
            sibling: null,
            dom: null
        };
        if (index === 0) {
            work.child = newWork;
        } else {
            preChild.sibling = newWork;   
        }
        preChild = newWork;
    })
    // 4、返回下一个要执行的任务
    if (work.child) {
        return work.child;
    }
    if (work.sibling) {
        return work.sibling;
    }
    return work.parent?.sibling;
}
requestIdleCallback(workLoop);

export default { render, createElement }