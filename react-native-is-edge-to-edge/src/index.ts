export const isEdgeToEdge = () => true;

// @ts-expect-error noop on all platforms except android
export const controlEdgeToEdgeValues = (values: Record<string, unknown>) => {};
