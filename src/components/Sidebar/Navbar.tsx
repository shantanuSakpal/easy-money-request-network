"use client";
/*eslint-disable*/
import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import NotificationDropdown from "@/components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "@/components/Dropdowns/UserDropdown.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { app } from "@/config/firebase";
import { useAuthStore } from "@/store/auth";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BrandLogo } from "../BrandLogo";

export default function Navbar() {
  const auth = getAuth(app);
  const isLoggedIn = useAuthStore((state) => state.isUserValid);
  const setIsUserValid = useAuthStore((state) => state.setIsUserValid);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current pathname

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setIsUserValid(false);
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  const isRouteActive = (route: any) => {
    return pathname === route;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <BrandLogo />
        </div>

        {/* Menu Button for Mobile */}
        <button
          className="md:hidden block text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className="fas fa-bars text-xl"></i>
        </button>

        {/* Links for Desktop */}
        <div
          className={`md:flex items-center space-x-6 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <Link
            href="/"
            className={`text-sm font-bold ${
              isRouteActive("/") ? "text-lightBlue-500" : "text-gray-700"
            }`}
          >
            Home
          </Link>
          <Link
            href="/disbursement"
            className={`text-sm font-bold ${
              isRouteActive("/disbursement")
                ? "text-lightBlue-500"
                : "text-gray-700"
            }`}
          >
            Disbursement
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-bold ${
              isRouteActive("/dashboard")
                ? "text-lightBlue-500"
                : "text-gray-700"
            }`}
          >
            Dashboard
          </Link>

          {/* Auth Buttons */}
          {!isLoggedIn && (
            <Link
              href="/login"
              className="text-sm font-bold text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
          )}
          {isLoggedIn && (
            <button
              onClick={signOutUser}
              className="text-sm font-bold text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          )}

          {/* Connect Wallet */}
          <div className="mt-2 md:mt-0">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
