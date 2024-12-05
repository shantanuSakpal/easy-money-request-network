"use client";
/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import NotificationDropdown from "@/components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "@/components/Dropdowns/UserDropdown.js";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { app } from "@/config/firebase";
import { useAuthStore } from "@/store/auth";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BrandLogo } from "../BrandLogo";

export default function Sidebar() {
  const auth = getAuth(app);
  const isLoggedIn = useAuthStore((state) => state.isUserValid);
  const setIsUserValid = useAuthStore((state) => state.setIsUserValid);
  const [collapseShow, setCollapseShow] = useState("hidden");
  const pathname = usePathname(); // Get current pathname

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setIsUserValid(false);
    } catch (error) {
      console.error("Error signing out:", error.message);
      // Optionally add user notification here
    }
  };

  const isRouteActive = (route) => {
    return pathname === route;
  };

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <BrandLogo />
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <BrandLogo />
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (isRouteActive("/")
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  href="/"
                >
                  <i
                    className={
                      "fas fa-table mr-2 text-sm " +
                      (isRouteActive("/") ? "opacity-75" : "text-blueGray-300")
                    }
                  ></i>
                  Home
                </Link>
              </li>
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (isRouteActive("/disbursement")
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  href="/disbursement"
                >
                  <i
                    className={
                      "fas fa-table mr-2 text-sm " +
                      (isRouteActive("/disbursement")
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  Disbursement
                </Link>
              </li>
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (isRouteActive("/dashboard")
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  href="/dashboard"
                >
                  <i
                    className={
                      "fas fa-tv mr-2 text-sm " +
                      (isRouteActive("/dashboard")
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>
                  Dashboard
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />

            {!isLoggedIn && (
              <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                <li className="items-center">
                  <Link
                    className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                    href="/login"
                  >
                    <i className="fas fa-fingerprint text-blueGray-400 mr-2 text-sm"></i>{" "}
                    Login
                  </Link>
                </li>
              </ul>
            )}

            {isLoggedIn && (
              <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                <li className="items-center">
                  <button
                    className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                    href="/login"
                    onClick={signOutUser}
                  >
                    <i className="fas fa-fingerprint text-blueGray-400 mr-2 text-sm"></i>{" "}
                    Logout
                  </button>
                </li>
              </ul>
            )}
            <ConnectButton />
          </div>
        </div>
      </nav>
    </>
  );
}
