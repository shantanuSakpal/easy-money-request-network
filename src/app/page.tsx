"use client";
import React from "react";
import { motion } from "framer-motion"; // For animations
import {
  FaEthereum,
  FaFileInvoice,
  FaBolt,
  FaShieldAlt,
  FaUsers,
  FaClock,
  FaMoneyBill,
} from "react-icons/fa";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Batch Payments,{" "}
              <span className="text-yellow-300">Simplified</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Pay multiple recipients in one transaction. Save time by automatic
              invoicing and email and automate your Web3 payments.
            </p>
            <Link
              href={"/disbursement"}
              className="px-8 py-4 mt-5 bg-white text-green-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Start Paying
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <div className="text-green-600 text-3xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Use Cases Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-lg text-center"
              >
                <div className="text-green-600 text-2xl mb-3 text-center mx-auto flex justify-center">
                  {useCase.icon}
                </div>
                <h3 className="font-bold mb-2 text-lg">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-green-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Payment Process?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of organizations saving time and money with our
            platform.
          </p>
          <button className="px-8 py-4 bg-white text-green-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition">
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: <FaBolt />,
    title: "One-Click Batch Payments",
    description:
      "Pay multiple recipients in a single transaction, saving time and gas fees.",
  },
  {
    icon: <FaFileInvoice />,
    title: "Automated Emails",
    description:
      "Invoices and transaction details are automatically sent to recipients",
  },
  {
    icon: <FaMoneyBill />,
    title: "Finance Manager",
    description:
      "Get real-time visibility into your transactions, and track your finances",
  },
];

const useCases = [
  {
    icon: <FaUsers />,
    title: "Payroll",
    description: "Process employee salaries in crypto efficiently",
  },
  {
    icon: <FaEthereum />,
    title: "Hackathons",
    description: "Distribute prizes to multiple winners easily",
  },
  {
    icon: <FaClock />,
    title: "DAO Operations",
    description: "Manage contributor payments seamlessly",
  },
  {
    icon: <FaFileInvoice />,
    title: "Grant Distribution",
    description: "Handle multiple grant payments efficiently",
  },
];
