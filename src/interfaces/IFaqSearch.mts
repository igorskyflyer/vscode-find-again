// Author: Igor Dimitrijević (@igorskyflyer)

export interface IFaqSearch {
  // runtime-defined
  id: number

  // user-defined
  description?: string
  query?: string
  include?: string
  exclude?: string
  regex?: boolean
  caseSensitive?: boolean
}
