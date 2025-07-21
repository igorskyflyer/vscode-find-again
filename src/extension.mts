// Author: Igor Dimitrijević (@igorskyflyer)

import { Zep } from '@igor.dvlpr/zep'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import * as vscode from 'vscode'
import { Finder } from './Finder.mjs'

function getActiveWorkspaceFolder(): string {
  if (
    !Array.isArray(vscode.workspace.workspaceFolders) ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    return ''
  }

  const activeEditor = vscode.window.activeTextEditor

  if (activeEditor) {
    const activeUri = activeEditor.document.uri
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeUri)

    if (workspaceFolder) {
      return workspaceFolder.uri.fsPath
    }
  }

  const fallbackFolder = vscode.workspace.workspaceFolders[0]
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

function spinStatus(statusbar: vscode.StatusBarItem): void {
  statusbar.text = `$(sync~spin) Reloading...`
  statusbar.tooltip = 'Reloading the search index...'
}

function postStatus(finder: Finder, statusbar: vscode.StatusBarItem): void {
  if (finder.isValid()) {
    statusbar.tooltip = 'Open the Search'
    statusbar.command = 'extension.openSearch'
    statusbar.text = `$(search-editor-label-icon) Ready • ${finder.getCount()}`
    return
  }

  statusbar.command = undefined
  statusbar.text = `$(search-editor-label-icon) N/A`

  if (!finder.faqExists()) {
    statusbar.tooltip = 'The search.faq file does not exist.'
    return
  }

  statusbar.tooltip = 'There was an error parsing the search.faq file.'
}

async function openFaqEditor(filePath: string): Promise<void> {
  const uri = vscode.Uri.file(filePath)
  const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri)

  vscode.window.showTextDocument(doc)
}

function createWorkspaceConfigDir(workspaceConfigDir: string): boolean {
  try {
    if (!existsSync(workspaceConfigDir)) {
      mkdirSync(workspaceConfigDir)
      return true
    }
  } catch {
    return false
  }

  return true
}

async function handleNoFaq(
  workspaceConfigDir: string,
  faqFile: string
): Promise<void> {
  const choiceNoFile: string | undefined =
    await vscode.window.showWarningMessage(
      'No "./vscode/search.faq" file was found. Create a search.faq file in the current workspace?',
      'Create'
    )

  if (choiceNoFile === 'Create') {
    if (!createWorkspaceConfigDir(workspaceConfigDir)) {
      vscode.window.showErrorMessage(
        'Could not crate the .vscode folder. Try again or create it manually.'
      )
      return
    }

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
        4
      )

      writeFileSync(faqFile, content, { encoding: 'utf-8' })
      await openFaqEditor(faqFile)
    } catch {
      vscode.window.showErrorMessage(
        'An error occurred while creating the file, try again or create the file manually.'
      )
    }
  }
}

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  const workspaceFolder: string = getActiveWorkspaceFolder()

  if (workspaceFolder === '') {
    vscode.window.showInformationMessage(
      'No active workspace, open a folder to start using "Find Again!".'
    )
    return
  }

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
        await handleNoFaq(finder.getWorkspaceConfigDir(), finder.getFaqPath())
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

export function deactivate(): void {}
