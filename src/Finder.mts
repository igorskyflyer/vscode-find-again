// Author: Igor Dimitrijević (@igorskyflyer)

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as vscode from 'vscode'
import type { IFaqFile } from './interfaces/IFaqFile.mjs'
import type { IFaqSearch } from './interfaces/IFaqSearch.mjs'
import type { ISearchQuickPick } from './interfaces/ISearchQuickPick.mjs'

const MAX_LABEL: number = 32
const MAX_GLOB: number = 256
const MAX_META: number = 128

const MIN_DESCRIPTOR = 3
const MIN_GLOB = 2
const MIN_SINGLE = 2

export class Finder {
  #root: string
  #count: number
  #cacheSearch: Map<string, IFaqSearch>
  #cacheItems: ISearchQuickPick[]
  #valid: boolean
  #stale: boolean

  constructor(workspaceFolder: string) {
    this.#root = workspaceFolder ?? ''
    this.#cacheSearch = new Map<string, IFaqSearch>()
    this.#cacheItems = []
    this.#count = 0
    this.#valid = false
    this.#stale = true
  }

  isValid(): boolean {
    return this.#valid
  }

  getFaqPath(): string {
    return join(this.#root, '.vscode', 'search.faq')
  }

  getCount(): number {
    return this.#count
  }

  #processValue(value: string | undefined, min: number, max: number): string {
    if (typeof value !== 'string' || value.length < min) {
      return ''
    }

    if (value.length > max) {
      return value.substring(0, max)
    }

    return value
  }

  #generatePickItems() {
    if (this.#cacheSearch.size === 0 || !this.#stale) {
      return
    }

    let id: number = 0

    this.#cacheItems = []

    this.#cacheSearch.forEach((search: IFaqSearch, label: string) => {
      this.#cacheItems.push({
        label: `🔍 ${this.#processValue(label, MIN_DESCRIPTOR, MAX_LABEL)}`,
        description: this.#processValue(
          search.description,
          MIN_DESCRIPTOR,
          MAX_META
        ),

        id: id,
        include: this.#processValue(search.include, MIN_GLOB, MAX_GLOB),
        exclude: this.#processValue(search.exclude, MIN_GLOB, MAX_GLOB),
        query: this.#processValue(search.query, MIN_SINGLE, MAX_META),
        caseSensitive: search.caseSensitive ?? false,
        regex: search.regex ?? false
      })

      id++
    })
  }

  async initialize() {
    this.#count = 0
    this.#valid = false
    this.#stale = true

    this.#cacheSearch.clear()
    this.#cacheItems = []

    try {
      const contents: string = readFileSync(this.getFaqPath(), {
        encoding: 'utf-8'
      })
      const json: IFaqFile = JSON.parse(contents)

      if (typeof json.searches !== 'object') {
        return
      }

      for (const entry in json.searches) {
        const key: string = this.#processValue(entry, MIN_DESCRIPTOR, MAX_LABEL)

        if (key === '') {
          continue
        }

        this.#cacheSearch.set(key, json.searches[entry])
        this.#count++
      }
    } catch {
      this.#valid = false
      return
    }

    this.#generatePickItems()
    this.#stale = false
    this.#valid = true
  }

  async doSearch(): Promise<void> {
    const selected: ISearchQuickPick | undefined =
      await vscode.window.showQuickPick(this.#cacheItems, {
        ignoreFocusOut: false,
        matchOnDescription: true,
        matchOnDetail: true,
        title: 'Pick a search to perform'
      })

    if (typeof selected === 'object' && typeof selected.id === 'number') {
      vscode.commands.executeCommand('workbench.action.findInFiles', {
        query: selected.query,
        filesToInclude: selected.include,
        filesToExclude: selected.exclude,
        isCaseSensitive: selected.caseSensitive,
        isRegex: selected.regex,

        triggerSearch: true
      })
    }
  }
}
