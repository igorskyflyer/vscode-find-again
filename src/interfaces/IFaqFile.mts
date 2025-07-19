// Author: Igor Dimitrijević (@igorskyflyer)

import type { IFaqSearch } from './IFaqSearch.mjs'

export interface IFaqFile {
  searches: { [key: string]: IFaqSearch }
}
