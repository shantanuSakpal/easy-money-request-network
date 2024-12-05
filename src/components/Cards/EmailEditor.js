"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
// DOnt use react-quill
// it is incompatible with newer version fo recat
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const EmailEditor = ({ recipientList }) => {
  const [content, setContent] = useState("Hey $name! You have been paid!");

  const variables = recipientList[0];

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

  const availableVars = getAvailableVariables(variables);

  return (
    <div className="flex flex-col mb-5 p-5">
      <h3 className={"font-semibold text-lg text-blueGray-700 mb-5"}>
        Draft Confirmation Email
      </h3>
      <div className="  mb-2">
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
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        style={{
          borderRadius: "0.25rem",
        }}
        className="bg-white"
      />
      <div className="mt-5">
        <span className=" font-semibold text-blueGray-700">Email Preview:</span>
      </div>
      <div
        className="mt-1 p-5 rounded-lg bg-white"
        dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
      />
    </div>
  );
};

export default EmailEditor;
