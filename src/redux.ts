export const reduxAction = (type: string, payload = {}, error?: string | object) => ({
  type,
  payload,
  error,
});

export const reduxTAction = (type: string, payload = {}, error?: string | object) => ({
  transient: true,
  type,
  payload,
  error,
});
