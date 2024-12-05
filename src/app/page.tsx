"use client";
import React, { useState, useEffect } from "react";
import AdminNavbar from "@/components/Navbars/AdminNavbar";
import HeaderStats from "@/components/Headers/HeaderStats";
import CardTable from "@/components/Cards/CardTable.js";
import CardSettings from "@/components/Cards/CardSettings";
import EmailEditor from "@/components/Cards/EmailEditor";

export default function Tables() {
  // status : pending , completed , delayed
  const [recipientList, setRecipientList] = useState([
    {
      name: "Mohammed Mehdi",
      email: "mohdmehdi2003@gmail.com",
      wallet_addr: "0x07126127C6e1039b60496aF2e14e7b5515A40e40",
      team_name: "Random_state_42",
      ammount: 7500,
      address: "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09",
      city: "New York",
      country: "United States",
      postal_code: 400059,
      notes: "Thank you for taking part in this event",
      status: "pending",
    },
  ]);

  // pageMode addingUser -> writingEmail
  const [pageMode, setPageMode] = useState("addingUser");

  const goPageForward = () => {
    if (pageMode === "addingUser") {
      setPageMode("writingEmail");
    }
  };

  // Function to go backward
  const goPageBackward = () => {
    if (pageMode === "writingEmail") {
      setPageMode("addingUser");
    }
  };

  return (
    <>
      <AdminNavbar />
      <HeaderStats />
      <div className="flex flex-col flex-wrap mt-4">
        <CardTable
          recipientList={recipientList}
          setRecipientList={setRecipientList}
        />
        {pageMode == "addingUser" && (
          <CardSettings
            recipientList={recipientList}
            setRecipientList={setRecipientList}
          />
        )}
        {pageMode == "writingEmail" && (
          <EmailEditor
            recipientList={recipientList}
            setRecipientList={setRecipientList}
          />
        )}

        <div className="flex ">
          <button
            className={`${
              pageMode === "addingUser"
                ? "opacity-25 bg-lightBlue-500 cursor-not-allowed"
                : "bg-lightBlue-500 active:bg-lightBlue-600"
            } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
            type="button"
            onClick={goPageBackward}
            disabled={pageMode === "addingUser"}
          >
            Previous Section
          </button>

          <button
            className={`${
              pageMode === "writingEmail"
                ? "opacity-25 bg-lightBlue-500 cursor-not-allowed"
                : "bg-lightBlue-500 active:bg-lightBlue-600"
            } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
            type="button"
            onClick={goPageForward}
            disabled={pageMode === "writingEmail"}
          >
            Next Section
          </button>
        </div>
      </div>
    </>
  );
}
