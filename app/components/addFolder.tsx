"use client";

import { useState } from "react";
import Popup from "./popup/popup";

interface AddFolderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, isSubfolder: boolean) => void;
  hasCurrentFolder: boolean;
}

export default function AddFolder({
  isOpen,
  onClose,
  onCreate,
  hasCurrentFolder,
}: AddFolderProps) {
  const [name, setName] = useState<string>("");
  const [isSubfolder, setIsSubfolder] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), isSubfolder);
    setName("");
    setIsSubfolder(false);
    onClose();
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center mb-4">
        <img
          src="/images/black-folder.svg" 
          alt="Folder"
          className="inline w-5 h-5 mr-2"
        />
        <h2 className="text-lg font-bold">Create Folder</h2>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Folder name"
        autoFocus
      />

      {hasCurrentFolder && (
        <label style={{ marginTop: "0.75rem", display: "block" }}>
          <input
            type="checkbox"
            checked={isSubfolder}
            onChange={(e) => setIsSubfolder(e.target.checked)}
          />
          {" "}Make this a subfolder
        </label>
      )}

      <div className="p-4 flex justify-end gap-2">
        <button onClick={handleSubmit}>Create</button>
      </div>
    </Popup>
  );
}
