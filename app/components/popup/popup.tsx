"use client";

import { ReactNode } from "react";
import "./popup.css";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Popup({
  isOpen,
  onClose,
  title,
  children,
}: PopupProps) {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <header className="popup-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </header>

        <div className="popup-content">{children}</div>
      </div>
    </div>
  );
}
