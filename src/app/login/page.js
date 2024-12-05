"use client";
import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/config/firebase.js";

export default function Login() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  disbursement;

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Signed in user:", user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-screen">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign in with
                  </h6>
                </div>
                <button
                  onClick={handleGoogleSignIn}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    cursor: "pointer",
                    background: "#ffffff",
                    width: "100%",
                  }}
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    style={{ width: "20px", height: "20px" }}
                  />
                  Google
                </button>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2"></div>
              {/* <div className="w-1/2 text-right">
                <Link href="/register" className="text-blueGray-200">
                  <small>Create new account</small>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
