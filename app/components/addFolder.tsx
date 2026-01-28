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
        <label className="mt-4 flex items-center">
          <input
            type="checkbox"
            checked={isSubfolder}
            onChange={(e) => setIsSubfolder(e.target.checked)}
          />
          <p className="ml-2">Make this a subfolder</p>
        </label>
      )}

      <div className="p-4 flex justify-end gap-2">
        <button className="text-white px-4 py-2 bg-[#453750] transition duration-300 ease-in-out hover:bg-[#5b4769] hover:scale-105 hover:shadow-lg"
        onClick={handleSubmit}>Create</button>
      </div>
    </Popup>
  );
}
