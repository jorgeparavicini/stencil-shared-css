const crossTagReferenceCounts = new Map();
export function componentConnected(element, ref, styleConnected) {
    var _a;
    // Get the generate stylesheet name.
    // The name __cssFilename will be added to the object at compile time.
    const stylesheetName = ref.constructor['__cssFilename'];
    // The Element reference from stencil points to the parent of the shadowRoot.
    // But we need the element inside the shadow dom, hence we try to get the shadowRoot
    // If that fails just use the element and get the root node of that.
    // This way the component doesn't use shadow doms and the style tag can be added to the parent of the component.
    const root = ((_a = element.shadowRoot) !== null && _a !== void 0 ? _a : element).getRootNode();
    const referenceCounts = crossTagReferenceCounts.get(element.tagName) || new WeakMap();
    const info = referenceCounts.get(root) || { count: 0 };
    const referenceCount = info.count + 1;
    // No style sheet has been attached yet.
    if (referenceCount === 1) {
        if (element.ownerDocument !== root) {
            // Remember the root for clean up.
            ref.__rootNode = root;
        }
        // Create the stylesheet from the generated stylesheet name.
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', `assets/${stylesheetName}`);
        // Add the create stylesheet to the dom
        const parent = root instanceof ShadowRoot ? root : document.head;
        parent.appendChild(link);
        // Persist the created HTML Element in the info object.
        // Will be used in the cleanup.
        info.container = link;
        // Invoke style connected callback
        styleConnected === null || styleConnected === void 0 ? void 0 : styleConnected();
    }
    referenceCounts.set(root, info);
    crossTagReferenceCounts.set(element.tagName, referenceCounts);
}
export function componentDisconnected(element, ref) {
    const referenceCounts = crossTagReferenceCounts.get(element.tagName);
    if (!referenceCounts)
        return;
    const root = ref.__rootNode || element.ownerDocument;
    const info = referenceCounts.get(root) || { count: 0 };
    const referenceCount = info.count - 1;
    if (referenceCount < 1) {
        referenceCounts.delete(root);
        const style = info.container;
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }
    else {
        info.count = referenceCount;
        referenceCounts.set(root, info);
    }
}
