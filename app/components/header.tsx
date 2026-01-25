"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-300 shadow-md flex items-center justify-between p-4">
      <div className="header-left">
        <Link href="/" className="logo">
          <Image
            src="/images/logo-header.svg"
            alt="Header Logo"
            width={64}
            height={64}
            priority
            />
        </Link>
      </div>

      <nav className="header-nav">
        <Link href="/profile">Profile</Link>
      </nav>
    </header>
  );
}
