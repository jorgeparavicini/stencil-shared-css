"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentConnected = void 0;
const crossTagReferenceCounts = new Map();
function componentConnected(element, id) {
    const root = element.getRootNode();
    const referenceCounts = crossTagReferenceCounts.get(element.tagName) || new WeakMap();
    const referenceCount = referenceCounts.get(root) || 0;
    if (referenceCount === 1) {
        if (element.ownerDocument !== root) {
            // TODO: add root to element
        }
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', `assets/${id.toString}.css`);
        const parent = root instanceof ShadowRoot ? root : document.head;
        parent.appendChild(link);
    }
    referenceCounts.set(root, referenceCount);
    crossTagReferenceCounts.set(element.tagName, referenceCounts);
}
exports.componentConnected = componentConnected;
