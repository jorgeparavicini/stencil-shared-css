import { guid } from '.';
var crossTagReferenceCounts = new Map();
export function componentConnected(element) {
    var root = element.getRootNode();
    var referenceCounts = crossTagReferenceCounts.get(element.tagName) || new WeakMap();
    var referenceCount = referenceCounts.get(root) || 0;
    if (referenceCount === 1) {
        if (element.ownerDocument !== root) {
            // TODO: add root to element
        }
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', "assets/" + guid + "-" + element.tagName + ".css");
        var parent_1 = root instanceof ShadowRoot ? root : document.head;
        parent_1.appendChild(link);
    }
    referenceCounts.set(root, referenceCount);
    crossTagReferenceCounts.set(element.tagName, referenceCounts);
}
