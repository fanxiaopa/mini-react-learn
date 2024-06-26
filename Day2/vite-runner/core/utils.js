/*
 * @Author: yxfan
 * @Date: 2024-06-17 20:53:37
 * @LastEditTime: 2024-06-26 17:34:39
 * @FilePath: /Day2/vite-runner/core/utils.js
 * @Description: 
 */
/**
 * @description 递归向上找父节点，当fiber是function时，还要往上找
 * @param {*} fiber
 * @return {*}  
 */
export function getFiberParent(fiber) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent;
    }
    return fiberParent;
}


/**
 * @description 当新节点比老节点少时，删除多余的老节点
 * @param {*} oldFiber
 */
export function deleteOldFiber(oldFiber) {
    // 递归处理兄弟节点
    while(oldFiber) {
        deletions.push(oldFiber);
        oldFiber = oldFiber.sibling;
    }
}