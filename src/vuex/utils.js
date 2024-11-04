export const forEachValue = (obj, callback) => {
  Object.entries(obj).forEach(([key, value]) => {
    callback(key, value);
  });
};
