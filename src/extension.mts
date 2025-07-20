// Author: Igor Dimitrijević (@igorskyflyer)

import { Zep } from '@igor.dvlpr/zep'
import * as vscode from 'vscode'
import { Finder } from './Finder.mjs'

function getActiveWorkspaceFolder(): string {
  const activeEditor = vscode.window.activeTextEditor

  if (activeEditor) {
    const activeUri = activeEditor.document.uri
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeUri)

    if (workspaceFolder) {
      return workspaceFolder.uri.fsPath
    }
  }

  const fallbackFolder = vscode.workspace.workspaceFolders?.[0]
  return fallbackFolder ? fallbackFolder.uri.fsPath : ''
}

function createStatusbar(): vscode.StatusBarItem {
  const statusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  )

  statusBar.show()

  return statusBar
}

function notifyCount(statusbar: vscode.StatusBarItem, count: number) {
  if (count > 0) {
    statusbar.backgroundColor = undefined
    statusbar.tooltip = 'Open the Search'
    statusbar.command = 'extension.openSearch'
    statusbar.text = `$(search-editor-label-icon) Ready • ${count}`
  } else {
    statusbar.backgroundColor = new vscode.ThemeColor(
      'statusBarItem.errorBackground'
    )
    statusbar.tooltip = 'There was an error parsing the search.faq file.'
    statusbar.command = undefined
    statusbar.text = `$(error) Error`
  }
}

export async function activate(context: vscode.ExtensionContext) {
  if (
    !Array.isArray(vscode.workspace.workspaceFolders) ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    return
  }

  const workspaceFolder: string = getActiveWorkspaceFolder()
  const finder: Finder = new Finder(workspaceFolder)
  const statusBar: vscode.StatusBarItem = createStatusbar()
  const zep: Zep = new Zep(() => {
    finder.initialize()
  }, 500)

  zep.onAfterRun(() => {
    notifyCount(statusBar, finder.getCount())
  })

  const watcher = vscode.workspace.createFileSystemWatcher(finder.getFaqPath())

  watcher.onDidChange(() => {
    statusBar.backgroundColor = undefined
    statusBar.text = `$(sync~spin) Reloading...`
    zep.run()
  })

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runSearchAll', async () => {
      if (finder.isValid()) {
        await finder.doSearch()
        return
      }

      vscode.window.showErrorMessage('No "./vscode/search.faq" file was found.')
    })
  )

  // used internally for the StatusBar command
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openSearch', () => {
      vscode.commands.executeCommand('workbench.action.findInFiles')
    })
  )

  context.subscriptions.push(statusBar)
  context.subscriptions.push(watcher)

  await finder.initialize()
  notifyCount(statusBar, finder.getCount())
}

export function deactivate() {}
