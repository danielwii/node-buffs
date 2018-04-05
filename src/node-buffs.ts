// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"

import { JsonMap } from './typings'

const _ = {
  mapValues: require('lodash/mapValues')
}

// --------------------------------------------------------------
// Core Classes
// --------------------------------------------------------------

/**
 * @example
 * class ModuleNotifications extends AbstractReduxModuleWithSage {
 *   // set module name first
 *   constructor() {
 *     super('notifications');
 *   }
 *
 *   actionTypes() {
 *     return {
 *       NOTIFY: 'notify',
 *     };
 *   }
 *
 *   actions() {
 *     return {
 *       notify: message => dispatch =>
 *         dispatch({ type: this.actionTypesWrapper().NOTIFY, payload: { message } }),
 *     };
 *   }
 *
 *   sagas() {
 *     return [];
 *   }
 *
 *   initialState() {
 *     return { notifications: [] };
 *   }
 *
 *   reducer() {
 *     return (previousState = this.initialState(), action) => {
 *       const state = previousState || this.initialState();
 *       switch (action.type) {
 *         default:
 *           return { ...state, ...action.payload };
 *       }
 *     };
 *   }
 * }
 *
 * export default new ModuleNotifications().exports();
 */
export abstract class AbstractReduxModuleWithSage {
  private moduleName: string

  constructor(moduleName: string = 'root') {
    this.moduleName = moduleName
  }

  public exports() {
    return {
      actionTypes: this.actionTypesWrapper(),
      actions: this.actions(),
      sagas: this.sagas(),
      reducer: this.reducer()
    }
  }

  // ACTION: 'module::action'
  abstract actionTypes(): JsonMap

  // action: (args): dispatchFunction
  abstract actions(): JsonMap

  // takeLatest / takeEvery (actionType, actionSage)
  abstract sagas(): any[]

  abstract initialState(): JsonMap

  abstract reducer(): JsonMap

  protected actionTypesWrapper() {
    return _.mapValues(
      this.actionTypes(),
      (value: string) => `${this.moduleName}::${value}`
    )
  }
}

// --------------------------------------------------------------
// Core Functions
// --------------------------------------------------------------

/**
 *
 * @param {string} str
 * @returns {string}
 */
export const base64Encode = (str: string = ''): string => {
  return new Buffer(str).toString('base64')
}

export const reduxAction = (type: string, payload = {}, error = null) => ({
  type,
  payload,
  error
})

export * from './configs'
export * from './cryptor'
export * from './strings'
