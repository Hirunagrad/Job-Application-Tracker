"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log("✅ Preload script loaded!");
// Expose limited API to React
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    onJobLinkDetected: (callback) => {
        electron_1.ipcRenderer.on("job-link", (_, link) => callback(link));
    },
    saveJobEntry: (entry) => {
        electron_1.ipcRenderer.send("save-job-entry", entry);
    },
});
