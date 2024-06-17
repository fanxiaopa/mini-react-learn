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
