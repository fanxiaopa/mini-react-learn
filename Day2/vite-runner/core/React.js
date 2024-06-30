import { getFiberParent, deleteOldFiber } from './utils';

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                const isTextNode =
                    typeof child === "string" || typeof child === "number";
                return isTextNode ? createTextNode(child) : child;
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
    wipRoot = {
        dom: container,
        props: {
            children: [el],
        },
    };
    nextWorkOfUnit = wipRoot;
}

let wipRoot = null;
let wipFiber = null;
let nextWorkOfUnit = null;

let deletions = [];
function workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
        // 更新时，当要更新的组件处理完后，退出循环（开始点：wipRoot，结束点：wipRoot?.sibling）
        if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
            nextWorkOfUnit = undefined;
        }
        shouldYield = deadline.timeRemaining < 1;
    }
    if (!nextWorkOfUnit && wipRoot) {        
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

function commitRoot() {
    deletions.forEach(commitDeletions);
    deletions = [];
    commitWork(wipRoot.child);
    commitHook();
    wipRoot = null;
}

function commitDeletions(fiber) {
    // 删除dom元素
    if (fiber.dom) {
        const fiberParent = getFiberParent(fiber);
        fiberParent.dom.removeChild(fiber.dom);
    } else {
        commitDeletions(fiber.child);
    }    
}


function commitWork(fiber) {
    if (!fiber) return;
    const fiberParent = getFiberParent(fiber);
    if (fiber.effectTag === 'update') {
        updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
    } else if (fiber.effectTag === 'placement') {
        if (fiber.dom) {
            fiberParent.dom.append(fiber.dom);
        }
    }
    
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function commitHook() {
    const run = (fiber) => {
        if (!fiber) return;
        // 判断是否是初始化，如果有alternate，则一定是update，不是init
        const isUpdate = Boolean(fiber.alternate);
        if (isUpdate) {
            fiber.effectHooks?.forEach((newHook, index) => {
                const oldHook = fiber.alternate?.effectHooks[index];
                const needUpdate = oldHook?.deps?.some((dep, i) => {
                    return dep !== newHook.deps?.[i];
                });
                if (needUpdate) {
                    newHook.cleanup = newHook.callback();
                }
            });
        } else {
            fiber.effectHooks?.forEach(hook => {
                hook.cleanup = hook.callback();
            })
        }
        run(fiber.child);
        run(fiber.sibling);
    }
    const cleanupRun = (fiber) => {
        if (!fiber) return;
        fiber.alternate?.effectHooks?.forEach(hook => {
            if (hook.deps.length > 0) {
                hook.cleanup?.();
            }
        })
        cleanupRun(fiber.child);
        cleanupRun(fiber.sibling);
    }
    // 先清理
    cleanupRun(wipRoot);
    // 再执行
    run(wipRoot);
}

function updateProps(dom, nextProps, preProps = {}) {
    // 1、old 有 new 没有 - 删除
    Object.keys(preProps).forEach((key) => {
        if (key != 'children') {
            if (!(key in nextProps)) {
                dom.removeAttribute(key);
            }
        }
    })
    // 2、old 没有 new 有 - 添加
    // 3、old 有 new 有 - 更新
    Object.keys(nextProps).forEach((key) => {
        if (key != 'children') {
            if (preProps[key] != nextProps[key]) {
                if (key.startsWith('on')) {
                    const eventType = key.slice(2).toLocaleLowerCase();
                    dom.removeEventListener(eventType, preProps[key]);
                    dom.addEventListener(eventType, nextProps[key]);
                } else {
                    dom[key] = nextProps[key];
                }
            }
        }
    })
}

function reconcileChildren(fiber, children) {
    let oldFiber = fiber.alternate?.child;
    // 3、转换链表 设置指针
    let preChild = null;
    children.forEach((child, index) => {
        // 判断是否是相同节点
        const isSameType = oldFiber && oldFiber.type === child.type;
        let newFiber;
        if (isSameType) {
            newFiber = {
                type: child.type,
                props: child.props,
                child: null,
                parent: fiber,
                sibling: null,
                dom: oldFiber.dom,
                effectTag: 'update',
                alternate: oldFiber
            }
        } else {
            // child可能为false，(在用变量控制元素的隐藏时, 可能为false)
            if (child) {
                newFiber = {
                    type: child.type,
                    props: child.props,
                    child: null,
                    parent: fiber,
                    sibling: null,
                    dom: null,
                    effectTag: 'placement',
                };
            }
            // 收集老节点，后面统一删除
            oldFiber && deletions.push(oldFiber);
        }
        
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }
      
        if (index === 0) {
            fiber.child = newFiber;
        } else {
            // 如果第一个字节点是undefined，那么要用第二个子节点
            if (!fiber.child) {
                fiber.child = newFiber;
            }
            if (preChild) {
                preChild.sibling = newFiber;
            }
        }
        if (newFiber) {
            preChild = newFiber;

        }
    });

    if (oldFiber) {
        deleteOldFiber(oldFiber);
    }
}

/**
 * @description 处理函数组件
 * @param {*} fiber
 */
function updateFunctionComponent(fiber) {
    // 处理function组件时，先将stateHooks清空，然后重新赋值
    stateHooks = [];
    effectHooks = [];
    stateHookIndex = 0;
    wipFiber = fiber;
    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
}

/**
 * @description 处理普通组件
 * @param {*} fiber
 */
function updateHostComponent(fiber) {
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
    const children = fiber.props.children;
    reconcileChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
    const isFunctionComponent = typeof fiber.type === "function";
    if (isFunctionComponent) {
        updateFunctionComponent(fiber);
    } else {
        updateHostComponent(fiber);
    }

    // 4、返回下一个要执行的任务
    if (fiber.child) {
        return fiber.child;
    }

    // 5、处理兄弟节点
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}
requestIdleCallback(workLoop);

// function update() {
//     // 必包，用于保存wipFiber；
//     let currentFiber = wipFiber;
//     return () => {
//         wipRoot = {
//             ...currentFiber,
//             alternate: currentFiber
//         }
//         nextWorkOfUnit = wipRoot;
//     }
// }

// 保存hooks
let stateHooks;
let stateHookIndex;
function useState(intial) {
    // 必包，用于保存wipFiber；
    let currentFiber = wipFiber;
    const oldHook = currentFiber?.alternate?.stateHooks[stateHookIndex];
    
    const stateHook = {
        state: oldHook ? oldHook.state : intial,
    }
    stateHooks.push(stateHook);
    stateHookIndex++;
    currentFiber.stateHooks = stateHooks;
  
    const setState = (_action) => {
        const action =  typeof _action === 'function' ? _action : () => _action;
        const state = action(stateHook.state);
        // 只有state变化时，才更新
        if (state !== stateHook.state) {
            stateHook.state = state;
            wipRoot = {
                ...currentFiber,
                alternate: currentFiber
            }
            nextWorkOfUnit = wipRoot;
        }
    }

    return [stateHook.state, setState]
}

let effectHooks;
function useEffect(callback, deps) {
    const effectHook = {
        callback,
        deps,
        cleanup: undefined
    };
    effectHooks.push(effectHook);

    wipFiber.effectHooks = effectHooks;       
}

export default { render, createElement, useState, useEffect };
