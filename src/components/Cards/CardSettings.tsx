"use client";
import React, { useEffect, useState } from "react";
import { RecipientType } from "@/types/actors";
import Papa from "papaparse";
// components

export default function CardSettings({
  recipientList,
  setRecipientList,
}: {
  recipientList: RecipientType[];
  setRecipientList: (list: RecipientType[]) => void;
}) {
  const [formData, setFormData] = useState<RecipientType>({
    id: "",
    name: "",
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    description: "",
    amount: "0",
    walletAddress: "0x" as `0x${string}`,
    phone: "",
    taxRegistration: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "walletAddress" && !value.startsWith("0x")
          ? `0x${value}`
          : value,
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.walletAddress ||
      Number(formData.amount) <= 0
    ) {
      alert("Please fill in all required fields and enter a valid amount");
      return;
    }

    // Generate a unique ID if not present
    const newRecipient = {
      ...formData,
      id: formData.id || crypto.randomUUID(),
      invoiceNumber: `INV-${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`, // Combine first and last name
    };

    setRecipientList((prev) => [...prev, newRecipient]);

    // Reset form
    setFormData({
      id: "",
      name: "",
      businessName: "",
      firstName: "",
      lastName: "",
      email: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      description: "",
      amount: "0",
      walletAddress: "0x" as `0x${string}`,
      phone: "",
      taxRegistration: "",
      deductions: "",
      invoiceNumber: "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Please select a CSV file to upload.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error("CSV Parsing Error:", results.errors);
          alert("Error uploading CSV. Please check the file format.");
          return;
        }

        const parsedRecipients = results.data.map((row: any) => ({
          id: crypto.randomUUID(),
          name: `${row["FirstName"] || ""} ${row["LastName"] || ""}`,
          businessName: row["BusinessName"] || "",
          firstName: row["FirstName"] || "",
          lastName: row["LastName"] || "",
          email: row["Email"] || "",
          streetAddress: row["StreetAddress"] || "",
          city: row["City"] || "",
          state: row["State"] || "",
          postalCode: row["PostalCode"] || "",
          country: row["Country"] || "",
          description: row["Description"] || "",
          amount: row["Amount"] || "0",
          walletAddress: (row["WalletAddress"]?.startsWith("0x")
            ? row["WalletAddress"]
            : `0x${row["WalletAddress"]}`) as `0x${string}`,
          phone: row["Phone"] || "",
          taxRegistration: row["TaxRegistration"] || "",
        }));

        setRecipientList((prev) => [...prev, ...parsedRecipients]);
      },
      error: (error) => {
        console.error("CSV Parsing Error:", error);
        alert("Error uploading CSV. Please try again.");
      },
    });
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-lg font-bold">Add Recipient</h6>
          <div className="flex  justify-between space-x-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              id="csvUpload"
            />
            <label
              htmlFor="csvUpload"
              className="bg-green-500 text-white hover:bg-green-600 font-bold uppercase text-sm px-6 py-2 rounded-md shadow-md hover:shadow-lg outline-none focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 ease-linear transition-all duration-150 cursor-pointer"
            >
              Upload CSV
            </label>
          </div>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          {/*Basic Information */}

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Basic Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  First Name <span className="text-lg text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Last Name <span className="text-lg text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Email <span className="text-lg text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/*Payment Information */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Payment Information
          </h6>

          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Wallet Address <span className="text-lg text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Amount (ETH) <span className="text-lg text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
          </div>
        </form>
        <div className="flex justify-end px-5 mt-5">
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase  px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150 "
            type="button"
            onClick={handleSubmit}
          >
            Add to list
          </button>
        </div>
      </div>
    </div>
  );
}
