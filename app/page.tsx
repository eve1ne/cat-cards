"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <section className="bg-[#453750] py-16 px-6">
        <div className="relative mx-auto h-[320px] w-[320px] sm:h-[500px] sm:w-[500px]">
          <Image
            src="/images/cat-trans-home.svg"
            alt="Transparent pixel cat illustration"
            width={485}
            height={484}
            priority
            className="absolute top-0 left-0 z-10 scale-90 sm:scale-100"
          />
          <Image
            src="/images/logo-home.svg"
            alt="Cat Cards Logo"
            width={550}
            height={411}
            priority
            className="absolute top-32 left-20 z-20 scale-115 w-[420px] sm:w-[550px]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6">
        <h1 className="pt-28 text-3xl font-bold">What Are Cat-Cards?</h1>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Image
            src="/images/pixel-mouse.svg"
            alt="Cat Pixel Paw"
            width={100}
            height={100}
            priority
            className="w-32 sm:w-40"
          />

          <p className="text-gray-600 max-w-lg">
            An AI-powered study pixel cat companion that turns messy notes into clear
            summaries and organized sessions, so studying feels simpler, calmer, and
            more fun!
          </p>
        </div>


        <h1 className="pt-28 text-3xl font-bold">How Can I Start?</h1>
        
        <p className="mt-2 mb-28 text-gray-600 leading-relaxed">
          <b>1.</b> Create an account!
          <br /><br />
          <b>2.</b> Upload class notes, paste text, or add study material from a lecture or
          exam.
          <br /><br />
          <b>3.</b> Your pixel study buddy cleans up your notes, creates structured sections,
          and generates a clear summary.
          <br /><br />
          <b>4.</b> Review your organized notes, save them into folders, and come back anytime
          to continue studying.
          <br /><br />
          <b>5.</b> Enjoy a cozy, distraction-free experience with a pixel companion that
          reacts as you study.
        </p>

        <div className="flex justify-center mb-32">
          <Link href="/signup">
            <button className="bg-[#453750] text-white px-6 py-3 transition duration-300 ease-in-out hover:bg-[#5b4769] hover:scale-105 hover:shadow-lg">
              Get Started!
            </button>
          </Link>
        </div>

      </section>

    </main>
  )
}
