"use client";
import React from "react";

export default function LandingPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Hero Section */}
        <header className="bg-green-600 text-white py-20 px-5 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Easy Money</h1>
          <p className="text-lg mb-6">
            The simplest way to manage your finances and payments in the Web3
            world.
          </p>
          <button className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg shadow hover:bg-gray-200">
            Get Started
          </button>
        </header>

        {/* Features Section */}
        <section className="flex flex-wrap justify-center p-10 bg-white gap-6">
          <div className="max-w-sm p-6 border rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Feature 1
            </h2>
            <p>Streamlined Web3 payments with minimal gas fees.</p>
          </div>
          <div className="max-w-sm p-6 border rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Feature 2
            </h2>
            <p>Integrated tax generation for easy compliance.</p>
          </div>
          <div className="max-w-sm p-6 border rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Feature 3
            </h2>
            <p>Secure wallet storage with blockchain transaction support.</p>
          </div>
        </section>

        {/* Call to Action Section */}
        <footer className="bg-gray-800 text-white py-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="mb-6">
            Join Easy Money today and revolutionize your Web3 payments.
          </p>
          <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-500">
            Sign Up Now
          </button>
        </footer>
      </div>
    </>
  );
}
