// Author: Igor Dimitrijević (@igorskyflyer)

import type { QuickPickItem } from 'vscode'
import type { IFaqSearch } from './IFaqSearch.mjs'

export interface ISearchQuickPick extends QuickPickItem, IFaqSearch {}
