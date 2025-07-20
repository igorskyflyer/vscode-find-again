// Author: Igor Dimitrijević (@igorskyflyer)

import { Zep } from '@igor.dvlpr/zep'
import { writeFileSync } from 'node:fs'
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

function createStatus(): vscode.StatusBarItem {
  const statusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1000
  )

  statusBar.show()

  return statusBar
}

function spinStatus(statusbar: vscode.StatusBarItem) {
  statusbar.text = `$(sync~spin) Reloading...`
  statusbar.tooltip = 'Reloading the search index...'
}

function postStatus(finder: Finder, statusbar: vscode.StatusBarItem) {
  if (finder.isValid()) {
    statusbar.tooltip = 'Open the Search'
    statusbar.command = 'extension.openSearch'
    statusbar.text = `$(search-editor-label-icon) Ready • ${finder.getCount()}`
    return
  }

  statusbar.command = undefined
  statusbar.text = `$(search-editor-label-icon) N/A`

  if (!finder.faqExists()) {
    statusbar.tooltip = "The search.faq file doesn't exist."
    return
  }

  statusbar.tooltip = 'There was an error parsing the search.faq file.'
}

async function openFaqEditor(filePath: string) {
  const uri = vscode.Uri.file(filePath)
  const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri)

  vscode.window.showTextDocument(doc)
}

async function handleNoFaq(filePath: string) {
  const choiceNoFile: string | undefined =
    await vscode.window.showWarningMessage(
      'No "./vscode/search.faq" file was found. Create a search.faq file in the current workspace?',
      'Create'
    )

  if (choiceNoFile === 'Create') {
    try {
      const content: string = JSON.stringify(
        {
          searches: {
            'My JS Search': {
              'include': '**/*.js',
              'caseSensitive': false,
              'description': 'Search JavaScript files'
            }
          }
        },
        null,
        2
      )

      writeFileSync(filePath, content, { encoding: 'utf-8' })
      await openFaqEditor(filePath)
    } catch {
      vscode.window.showErrorMessage(
        'An error occurred while creating the file, try again or create the file manually.'
      )
    }
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
  const statusBar: vscode.StatusBarItem = createStatus()
  const zep: Zep = new Zep(() => {
    finder.initialize()
  }, 500)

  zep.onAfterRun(() => {
    postStatus(finder, statusBar)
  })

  const watcher = vscode.workspace.createFileSystemWatcher(finder.getFaqPath())

  watcher.onDidCreate(() => {
    spinStatus(statusBar)
    zep.run()
  })

  watcher.onDidChange(() => {
    spinStatus(statusBar)
    zep.run()
  })

  watcher.onDidDelete(() => {
    spinStatus(statusBar)
    zep.run()
  })

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runSearchAll', async () => {
      if (!finder.faqExists()) {
        await handleNoFaq(finder.getFaqPath())
        return
      }

      if (finder.isValid()) {
        await finder.doSearch()
        return
      } else {
        const choiceOpenFaq: string | undefined =
          await vscode.window.showErrorMessage(
            'There was an error parsing the search.faq file. Open the file?',
            'Open'
          )

        if (choiceOpenFaq === 'Open') {
          await openFaqEditor(finder.getFaqPath())
        }
      }
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
  postStatus(finder, statusBar)
}

export function deactivate() {}
