const _ = {
  isString: require('lodash/isString')
}

/**
 * cast camel case to underscore case
 * @param {string} str
 * @returns {string}
 */
export const toUnderscore = (str: string) => {
  if (_.isString(str) && str.length > 1) {
    const trimStr = str.trim()
    return (
      trimStr[0].toLowerCase() +
      trimStr.slice(1).replace(/[A-Z]/g, match => '_' + match.toLowerCase())
    )
  }
  return str
}

/**
 * cast underscore case to camel case
 * @param {string} str
 * @returns {string}
 */
export const toCamelCase = (str: string) => {
  if (_.isString(str) && str.includes('_') && str.length > 1) {
    const trimStr = str.trim()
    const strings = trimStr.split('_')
    return (
      strings[0] +
      strings
        .slice(1)
        .map(s => s[0].toUpperCase() + s.slice(1))
        .join('')
    )
  }
  return str
}
