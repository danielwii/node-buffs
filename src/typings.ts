// --------------------------------------------------------------
// Define Types
// --------------------------------------------------------------

export interface JsonMap {
  [member: string]: string | number | boolean | null | JsonArray | JsonMap
}

export interface JsonArray
  extends Array<string | number | boolean | null | JsonArray | JsonMap> {}

export type Json = JsonMap | JsonArray | string | number | boolean | null

export type Func = () => any

export type FOptionsLoader = Json | Func
