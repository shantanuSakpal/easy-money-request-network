'use client'
import React, { useState } from "react";

export default function InvoiceForm({ invoiceData, setInvoiceData }) {
    //   const [invoiceData, setInvoiceData] = useState({
    //     creationDate: "2018-01-01T18:25:43.511Z",
    //     invoiceNumber: "123456789",
    //     note: "this is a very simple example of invoice",
    //     businessName: "",
    //     businessAddress: "",
    //     businessContact: "",
    //     businessEmail: ""
    //   });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //   const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(invoiceData);
    //   };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-lg font-bold">Invoice Details</h6>
                    {/* <button
                        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={handleSubmit}
                    >
                        Save Invoice
                    </button> */}
                </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form>
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                        Invoice Information
                    </h6>
                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-6/12 px-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    Creation Date
                                </label>
                                <input
                                    type="datetime-local"
                                    name="creationDate"
                                    value={invoiceData.creationDate}
                                    onChange={handleInputChange}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12 px-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    Invoice Number
                                </label>
                                <input
                                    type="text"
                                    name="invoiceNumber"
                                    value={"<RANDOM STRING>"}
                                    onChange={handleInputChange}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                        Business Information
                    </h6>
                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={invoiceData.businessName}
                                    onChange={handleInputChange}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    Business Address
                                </label>
                                <input
                                    type="text"
                                    name="businessAddress"
                                    value={invoiceData.businessAddress}
                                    onChange={handleInputChange}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12 px-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    name="businessContact"
                                    value={invoiceData.businessContact}
                                    onChange={handleInputChange}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12 px-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    Business Email
                                </label>
                                <input
                                    type="email"
                                    name="businessEmail"
                                    value={invoiceData.businessEmail}
                                    onChange={handleInputChange}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <div className="flex flex-wrap mt-6">
                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    Note
                                </label>
                                <textarea
                                    name="note"
                                    value={invoiceData.note}
                                    onChange={handleInputChange}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
