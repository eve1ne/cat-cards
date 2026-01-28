"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-sm border-t mb-4 text-gray-500 flex flex-col items-center">
      <p className="mt-4">© 2024 Cat-Cards. All rights reserved.</p>
      <p>Early access / In progress</p>

      <div className="flex gap-4 mt-2">
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
      </div>
    </footer>

  );
}
