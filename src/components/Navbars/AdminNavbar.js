"use client";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-end md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}

          <ConnectButton />
          {/* User */}
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
