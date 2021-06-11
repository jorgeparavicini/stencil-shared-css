import { guid } from '.';

const crossTagReferenceCounts: Map<string, WeakMap<Node, number>> = new Map();

export function componentConnected(element: HTMLElement) {
  const root = element.getRootNode();
  const referenceCounts =
    crossTagReferenceCounts.get(element.tagName) || new WeakMap();
  const referenceCount = referenceCounts.get(root) || 0;

  if (referenceCount === 1) {
    if (element.ownerDocument !== root) {
      // TODO: add root to element
    }

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', `assets/${guid}-${element.tagName}.css`);
    const parent = root instanceof ShadowRoot ? root : document.head;
    parent.appendChild(link);
  }

  referenceCounts.set(root, referenceCount);
  crossTagReferenceCounts.set(element.tagName, referenceCounts);
}
