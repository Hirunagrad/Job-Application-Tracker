import { contextBridge, ipcRenderer } from "electron";

console.log("✅ Preload script loaded!");

// Define the type for a job entry
export type JobEntry = {
  jobLink: string;
  company: string;
  position: string;
  dateApplied: string;
  status: string;
  notes: string;
};

// Expose limited API to React
contextBridge.exposeInMainWorld("electronAPI", {
  onJobLinkDetected: (callback: (link: string) => void) => {
    ipcRenderer.on("job-link", (_, link) => callback(link));
  },

  saveJobEntry: (entry: JobEntry) => {
    ipcRenderer.send("save-job-entry", entry);
  },
});
