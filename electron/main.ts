import { app, BrowserWindow, clipboard, ipcMain } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import path from "path";
import type { JobEntry } from "./preload";
//import { JobEntry } from "./preload"; // import type

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, "../dist/index.html"));
  }
}

// Clipboard watcher
let lastClipboardText = "";
function watchClipboard() {
  setInterval(() => {
    const text = clipboard.readText();

    if (text && text !== lastClipboardText) {
      lastClipboardText = text;

      if (
        text.includes("linkedin.com/jobs") ||
        text.includes("glassdoor.com/Job")
      ) {
        console.log("📋 New Job Link Detected:", text);
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
          windows[0].webContents.send("job-link", text);
          const win = windows[0];

          // Temporarily make always on top
          win.setAlwaysOnTop(true);
          win.focus();
          win.show(); // make sure window is visible
          setTimeout(() => win.setAlwaysOnTop(false), 1000); // remove alwaysOnTop after 1s
        }
      }
    }
  }, 2000);
}

// Handle saving job entry
ipcMain.on("save-job-entry", (_, entry: JobEntry) => {
  const filePath = path.join(app.getPath("documents"), "job_applications.csv");

  const line = `"${entry.jobLink}","${entry.company}","${entry.position}","${entry.dateApplied}","${entry.status}","${entry.notes}"\n`;

  if (!fs.existsSync(filePath)) {
    const header = "Job Link,Company,Position,Date Applied,Status,Notes\n";
    fs.writeFileSync(filePath, header, { encoding: "utf-8" });
  }

  fs.appendFileSync(filePath, line, { encoding: "utf-8" });
  console.log("Saved entry to CSV:", line);
});

app.whenReady().then(() => {
  createWindow();
  watchClipboard();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
