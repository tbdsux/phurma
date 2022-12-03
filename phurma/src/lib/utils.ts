export const join = (x: string | string[]) => {
  return Array.isArray(x) ? x.join("") : x;
};
