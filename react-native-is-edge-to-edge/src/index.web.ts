export const isEdgeToEdge = () => true;

// @ts-expect-error values is unused as the function is noop on web
export const controlEdgeToEdgeValues = (values: Record<string, unknown>) => {};
