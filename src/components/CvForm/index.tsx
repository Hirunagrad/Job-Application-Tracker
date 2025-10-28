import React from "react";
import { useEffect, useState } from "react";
import type { JobEntry } from "../../../electron/preload";

declare global {
  interface Window {
    electronAPI: {
      onJobLinkDetected: (callback: (link: string) => void) => void;
      saveJobEntry: (entry: JobEntry) => void;
    };
  }
}

function ApplyForm() {
  const [jobLink, setJobLink] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [dateApplied, setDateApplied] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [links, setLinks] = useState<string[]>([]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onJobLinkDetected((newLink) => {
        setJobLink(newLink);
        setLinks((prev) => [newLink, ...prev]);
      });
    } else {
      console.warn("electronAPI not found");
    }
  }, []);

  const handleSave = () => {
    const entry: JobEntry = {
      jobLink,
      company,
      position,
      dateApplied,
      status,
      notes,
    };

    window.electronAPI.saveJobEntry(entry);

    // Clear form
    setJobLink("");
    setCompany("");
    setPosition("");
    setNotes("");
    setStatus("Applied");

    alert("Saved!");
  };
  return (
    <div>
      <h2>📋 Job Application Tracker</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          value={jobLink}
          onChange={(e) => setJobLink(e.target.value)}
          placeholder="Job Link"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
        />
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position"
        />
        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Offer</option>
        </select>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
        />
        <button onClick={handleSave}>Save</button>
      </div>
      <hr style={{ margin: "20px 0" }} />
      <h3>History of Detected Links</h3>
      <ul>
        {links.map((link, i) => (
          <li key={i}>
            <a href={link} target="_blank" rel="noreferrer">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApplyForm;
