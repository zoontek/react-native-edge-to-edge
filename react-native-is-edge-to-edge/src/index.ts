export const isEdgeToEdge = () => true;

// @ts-expect-error noop on all platforms except Android
export const controlEdgeToEdgeValues = (values: Record<string, unknown>) => {};
