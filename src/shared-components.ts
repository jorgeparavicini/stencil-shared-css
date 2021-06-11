const crossTagReferenceCounts: Map<
  string,
  WeakMap<Node, { referenceCount: number; styleUrl?: string }>
> = new Map();

export function componentConnected(element: HTMLElement) {
  const root = element.getRootNode();
  const referenceCounts =
    crossTagReferenceCounts.get(element.tagName) || new WeakMap();
  const rootReference = referenceCounts.get(root) || { referenceCount: 0 };
  const referenceCount = rootReference.referenceCount + 1;
  rootReference.referenceCount = referenceCount;
}
