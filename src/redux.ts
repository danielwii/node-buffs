export interface Action {
  transient?: boolean;
  type: string;
  payload: object;
  error?: string | object;
}

export const reduxAction = (type: string, payload = {}, error?: string | object): Action => ({
  type,
  payload,
  error,
});

export const transientAction = (type: string, payload = {}, error?: string | object): Action => ({
  transient: true,
  type,
  payload,
  error,
});
