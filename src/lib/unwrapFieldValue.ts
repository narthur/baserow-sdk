export function unwrapFieldValue(value: unknown): unknown {
  const uw = (v: unknown): unknown => {
    const isWrapped = typeof v === "object" && v !== null && "value" in v;
    return isWrapped ? v.value : v;
  };

  if (Array.isArray(value)) {
    return value.map(uw);
  }

  return uw(value);
}
