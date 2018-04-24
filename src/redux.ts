export const reduxAction = (type: string, payload = {}, error?: string | object) => ({
  type,
  payload,
  error,
});
