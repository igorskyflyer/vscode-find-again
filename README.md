<div align="center">
  <img src="https://raw.githubusercontent.com/igorskyflyer/vscode-find-again/main/assets/extension.png" alt="Icon of Find Again!, a Visual Studio Code extension" width="256" height="256">
  <h1 align="center">Find Again!</h1>
</div>

<br>

<div align="center">
  🔎 Find Again! is a Visual Studio Code extension that lets you save and reuse your workspace's search queries. Whether you're tracking bugs, reviewing code, or running recurring tasks, you'll never lose a critical search again. You can share search configs between projects or with other devs! ⏳
</div>

<br>
<br>

## 📃 Table of Contents

- [Features](#-features)
- [Usage](#-usage)
- [Changelog](#-changelog)
- [License](#-license)
- [Support](#-support)
- [Related](#-related)
- [Author](#-author)

---

## 🤖 Features

#### 🔍 Search Preset System
Users define custom searches inside a `search.faq` file, a centralized search index where each search entry supports include/exclude globs, queries, and description metadata.  


#### ⚡ Instant Access
Seamless Command Palette and shortcut integration with cached pick items for blazing-fast access.  


#### 🧠 Smart Caching Mechanism
The `search.faq`-based index is read once and cached at all times, minimizing runtime computation and reload lag.  


#### 💾 File Watcher Support
Automatically detects create/change/delete events for `search.faq` and re-indexes the search set.  


#### 🛠️ Debounced Index Reload with Zep
Uses [`Zep`](https://www.npmjs.com/package/@igor.dvlpr/zep) for throttled, graceful search refresh – prevents excessive filesystem calls.  


#### 🟡 StatusBar Feedback
Displays real-time indexing status, search availability, and errors/warnings using iconography and tooltips.  


#### 📄 Fallback Support with Creation Prompt
If the `search.faq` is missing, prompts the user to auto-generate a starter config with sample data.  


#### 🚫 Graceful Error Handling
Detects malformed `search.faq` file and offers to open it for inspection without crashing or blocking the flow.  


#### ✍🏻 Editable JSON File Format
Search definitions are human-readable, easy to version-control, and ideal for collaborative logic crafting.  


#### 🫱🏼‍🫲🏼 Perfect for Sharing
The `search.faq` search-index file is perfectly sharable between projects, even between developers!

---

## 🕵🏼 Usage

After installing the extension, open a folder and launch `Find Again!` via:
- the `Command Palette`: `Find Again!: Run a Search`,
- the keyboard shortcut:
  - `CTRL + ALT + F` (Windows, Linux)
  - `Command + Option + F` (macOS).

<br>

The extension expects a searches index – `search.faq` located in the current workspace's configuration folder `.vscode`. The searches index is a JSON file with custom properties. If one doesn't exist, an option to create one is presented. See [Examples](#️-example) below for more information.

<br>
<br>

<div align="center">
  <img src="https://raw.githubusercontent.com/igorskyflyer/vscode-find-again/main/assets/promo/find-again-demo-regular-search.png" alt="">
  <em>Figure 1. Find Again! – regular search</em>
</div>

<br>
<br>

<div align="center">
  <img src="https://raw.githubusercontent.com/igorskyflyer/vscode-find-again/main/assets/promo/find-again-demo-regex-search.png" alt="">
  <em>Figure 2. Find Again! – regex search</em>
</div>

<br>
<br>

<div align="center">
  <img src="https://raw.githubusercontent.com/igorskyflyer/vscode-find-again/main/assets/promo/find-again-demo-command-palette.png" alt="">
  <em>Figure 3. Find Again! – Command Palette</em>
</div>

---

## 🗒️ Example

Here's an example of how a `search.faq` file looks like:

```json
{
    "searches": {
        "My TS Search": {
            "query": "Exists",
            "include": "./src/*.ts",
            "caseSensitive": true,
            "description": "Search TypeScript source files"
        },
        "My Docs Search": {
            "query": "#{1,6}",
            "include": "./*.md",
            "caseSensitive": false,
            "regex": true,
            "description": "Find all Headers in Docs"
        }
    }
}
```

---

## 📝 Changelog

📑 The changelog is available here: [CHANGELOG.md](https://github.com/igorskyflyer/vscode-find-again/blob/main/CHANGELOG.md).

---

## 🪪 License

Licensed under the MIT license which is available here, [MIT license](https://github.com/igorskyflyer/vscode-find-again/blob/main/LICENSE.txt).

---

## 💖 Support

<div align="center">
  I work hard for every project, including this one and your support means a lot to me!
  <br>
  Consider buying me a coffee. ☕
  <br>
  <br>
  <a href="https://ko-fi.com/igorskyflyer" target="_blank"><img src="https://raw.githubusercontent.com/igorskyflyer/igorskyflyer/main/assets/ko-fi.png" alt="Donate to igorskyflyer" width="180" height="46"></a>
  <br>
  <br>
  <em>Thank you for supporting my efforts!</em> 🙏😊
</div>

---

## 🧬 Related

[@igor.dvlpr/aria](https://www.npmjs.com/package/@igor.dvlpr/aria)

> _🧬 Meet Aria, an efficient Adblock filter list compiler, with many features that make your maintenance of Adblock filter lists a breeze! 🦖_

<br>

[@igor.dvlpr/keppo](https://www.npmjs.com/package/@igor.dvlpr/keppo)

> _🎡 Parse, manage, compare and output SemVer-compatible version numbers. 🛡_

<br>

[@igor.dvlpr/vscode-folderpicker](https://www.npmjs.com/package/@igor.dvlpr/vscode-folderpicker)

> _✨ Provides a custom Folder Picker API + UI for Visual Studio Code. 🎨_

<br>

[@igor.dvlpr/node-clone-js](https://www.npmjs.com/package/@igor.dvlpr/node-clone-js)

> _🧬 A lightweight JavaScript utility allowing deep copy-by-value of nested objects, arrays and arrays of objects. 🪁_

<br>

[@igor.dvlpr/zing](https://www.npmjs.com/package/@igor.dvlpr/zing)

> _🐌 Zing is a C# style String formatter for JavaScript that empowers Strings with positional arguments - composite formatting. 🚀_

---

## 👨🏻‍💻 Author
Created by **Igor Dimitrijević** ([*@igorskyflyer*](https://github.com/igorskyflyer/)).
