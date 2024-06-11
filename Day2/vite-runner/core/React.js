function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child === "string"
                    ? createTextNode(child)
                    : child;
            }),
        },
    };
}

function createTextNode(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}

function render(el, container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el],
        },
    };
    root = nextWorkOfUnit;
}

let root = null;
let nextWorkOfUnit = null;
function workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
        shouldYield = deadline.timeRemaining < 1;
    }
    if (!nextWorkOfUnit && root) {
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

function commitRoot() {
    commitWork(root.child);
    root = null;
}

function commitWork(fiber) {
    if (!fiber) return;
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent;
    }
    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom);
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function updateProps(dom, props) {
    Object.keys(props).forEach((key) => {
        if (key !== "children") {
            dom[key] = props[key];
        }
    });
}

function initChildren(fiber, children) {
    // 3、转换链表 设置指针
    let preChild = null;
    children.forEach((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            parent: fiber,
            sibling: null,
            dom: null,
        };
        if (index === 0) {
            fiber.child = newFiber;
        } else {
            preChild.sibling = newFiber;
        }
        preChild = newFiber;
    });
}

function performWorkOfUnit(fiber) { 
    const isFunctionComponent = typeof fiber.type === "function";
    if (!isFunctionComponent) {
        if (!fiber.dom) {
            // 1、创建dom
            const dom =
                fiber.type === "TEXT_ELEMENT"
                    ? document.createTextNode("")
                    : document.createElement(fiber.type);
            fiber.dom = dom;
            // 2、处理props
            updateProps(dom, fiber.props);
        }
    }
   
    const children = isFunctionComponent ? [fiber.type()] : fiber.props.children;
    initChildren(fiber, children);
    // 4、返回下一个要执行的任务
    if (fiber.child) {
        return fiber.child;
    }
    if (fiber.sibling) {
        return fiber.sibling;
    }
    return fiber.parent?.sibling;
}
requestIdleCallback(workLoop);

export default { render, createElement };
