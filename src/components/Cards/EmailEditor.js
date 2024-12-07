"use client";
import React, { useState, useEffect } from "react";

const EmailEditor = ({ recipientList, emailBody, setEmailBody }) => {
  const [content, setContent] = useState(
    emailBody ||
      `Hey $name! Congratulations on your win! 
      Your bounty rewards have been sent to your wallet: $walletAddress`
  );

  const variables = recipientList[0] || {};

  const interpolateVariables = (text, variables) => {
    return text.replace(/\$(\w+)/g, (match, variable) => {
      return variables[variable] || match;
    });
  };

  const getProcessedContent = () => {
    return interpolateVariables(content, variables);
  };

  const getAvailableVariables = () => {
    return Object.keys(variables).map((key) => `$${key}`);
  };

  const availableVars = getAvailableVariables();

  useEffect(() => {
    setEmailBody(content); // Update the email body whenever content changes
  }, [content, setEmailBody]);

  return (
    <div className="flex flex-col mb-5 p-5">
      <h3 className={"font-semibold text-lg text-blueGray-700 mb-5"}>
        Draft Confirmation Email
      </h3>
      <div className="mb-2">
        <span className="font-semibold text-blueGray-700">
          Available Variables:{" "}
        </span>
        {availableVars.map((variable) => (
          <span
            onClick={() => {
              setContent((prev) => `${prev} ${variable}`);
            }}
            key={variable}
            className="ml-2 bg-gray-500 py-1 px-2 rounded text-white cursor-pointer"
          >
            {variable}
          </span>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)} // Updates local state
        rows="10"
        className="mt-3 p-2 w-full border rounded bg-white"
        style={{ fontFamily: "monospace" }}
      />
      <div className="mt-5">
        <span className="font-semibold text-blueGray-700">
          Email body preview:
        </span>
      </div>
      <div className="mt-1 rounded-lg bg-white p-5">
        <pre>{getProcessedContent()}</pre>
      </div>
    </div>
  );
};

export default EmailEditor;
