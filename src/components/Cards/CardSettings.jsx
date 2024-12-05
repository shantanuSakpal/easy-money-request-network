"use client";
import React, { useState } from "react";
import Papa from "papaparse";
// components

export default function CardSettings({ recipientList, setRecipientList }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    walletAddress: "",
    teamName: "",
    amount: 0,
    address: "",
    city: "",
    country: "",
    postalCode: "",
    notes: "",
    status: "pending",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    //check if fields are null
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.walletAddress === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setRecipientList((prev) => [...prev, formData]);
    setFormData({
      name: "",
      email: "",
      walletAddress: "",
      teamName: "",
      amount: 0,
      address: "",
      city: "",
      country: "",
      postalCode: "",
      notes: "",
      status: "pending",
    });

    //scrool up
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
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

        const parsedRecipients = results.data.map((row) => ({
          name: row["Name"] || "",
          email: row["Email"] || "",
          walletAddress: row["WalletAddress"] || "",
          teamName: row["TeamName"] || "",
          amount: parseFloat(row["Amount"]) || 0,
          address: row["Address"] || "",
          city: row["City"] || "",
          country: row["Country"] || "",
          postalCode: row["PostalCode"] || "",
          notes: row["Notes"] || "",
          status: "pending",
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
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            User Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Name <span className="text-lg text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
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
                  Email address <span className="text-lg text-red-500">*</span>
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

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
          </div>
          <hr className="mt-6 mb-6 border-b-1 border-blueGray-300" />
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Amount &#40;in ETH&#41;
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
          {/* <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Contact Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div> */}
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
