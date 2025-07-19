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

  return ''
}

function createStatusbar(): vscode.StatusBarItem {
  const statusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  )

  statusBar.tooltip = 'Open the Search'
  statusBar.command = 'extension.openSearch'
  statusBar.text = '$(search-editor-label-icon) Ready'

  return statusBar
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

  zep.onBeforeRun(() => {
    statusBar.text = `$(sync~spin) Reloading`
  })

  zep.onAfterRun(() => {
    statusBar.text = `$(search-editor-label-icon) Ready`
  })

  const watcher = vscode.workspace.createFileSystemWatcher(finder.getFaqPath())

  watcher.onDidChange(() => {
    zep.run()
  })

  context.subscriptions.push(statusBar)
  context.subscriptions.push(watcher)

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runSearchAll', async () => {
      if (finder.isValid()) {
        await finder.doSearch()
        return
      }

      vscode.window.showErrorMessage('No searches file was found.')
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openSearch', () => {
      vscode.commands.executeCommand('workbench.action.findInFiles')
    })
  )

  statusBar.show()

  await finder.initialize()
}

export function deactivate() {}
