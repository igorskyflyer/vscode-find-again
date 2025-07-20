<div align="center">
  <img src="https://raw.githubusercontent.com/igorskyflyer/vscode-find-again/main/assets/extension.png" alt="Icon of Find Again!, a Visual Studio Code extension" width="256" height="256">
</div>

<h1 align="center">Find Again!</h1>

<br>

<div align="center">
  🔎 Find Again! is a Visual Studio Code extension that lets you save and reuse your workspace's search queries. Whether you're tracking bugs, reviewing code, or running recurring tasks, you'll never lose a critical search again. You can share search configs between projects or with other devs! ⏳
</div>

<br>
<br>

<div align="center">
  <blockquote>
    <br>
    <h4>💖 Support further development</h4>
    <span>I work hard for every project, including this one
    <br>
    and your support means a lot to me!
    <br>
    <br>
    Consider buying me a coffee. ☕
    <br>
    <strong>Thank you for supporting my efforts! 🙏😊</strong></span>
    <br>
    <br>
    <a href="https://ko-fi.com/igorskyflyer" target="_blank"><img src="https://raw.githubusercontent.com/igorskyflyer/igorskyflyer/main/assets/ko-fi.png" alt="Donate to igorskyflyer" width="150"></a>
    <br>
    <br>
    <a href="https://github.com/igorskyflyer"><em>@igorskyflyer</em></a>
    <br>
    <br>
    <br>
  </blockquote>
</div>

<br>
<br>

## 📃 Table of contents

- [Features](#features)
- [Usage](#usage)
- [Changelog](#changelog)
- [License](#license)
- [Related](#related)
- [Author](#author)

---

## 🤖 Features

#### 🔍 Search Preset System
Users define custom searches inside a `search.faq` file – each with include/exclude globs, queries, and description metadata.  


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

<br>

## 🕵🏼 Usage

---

## 📝 Changelog

📑 The changelog is available here: [CHANGELOG.md](https://github.com/igorskyflyer/vscode-find-again/blob/main/CHANGELOG.md).

---

## 🪪 License

Licensed under the MIT license which is available here, [MIT license](https://github.com/igorskyflyer/vscode-find-again/blob/main/LICENSE.txt).

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
