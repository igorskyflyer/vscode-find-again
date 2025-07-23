// Author: Igor Dimitrijević (@igorskyflyer)

import type { IFaqSearch } from './IFaqSearch.mjs'

export interface ISearchQuickPick extends IFaqSearch {
  // add the label prop for vscode.QuickPickItem
  label: string
  detail?: string
}
