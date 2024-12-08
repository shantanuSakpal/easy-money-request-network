"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { FaPaperPlane } from "react-icons/fa";

const UserMessage = ({ text }) => {
  return (
    <div className=" flex flex-row gap-3 items-start justify-start mt-5 w-full">
      <div className=" flex items-center justify-center rounded-full w-10 h-10 bg-theme-purple ">
        <FaUser className="" />
      </div>
      <div className={styles.userMessage}>{text}</div>
    </div>
  );
};

const AssistantMessage = ({ text, logo, name }) => {
  return (
    <div className=" flex flex-row gap-3 items-start justify-start my-5 w-full">
      <div className="flex items-center gap-5">
        <Image
          src={logo || "/default-assistant-logo.png"}
          className="rounded-full"
          alt={name || "Assistant"}
          width={40}
          height={40}
        />
      </div>
      <div className={styles.assistantMessage}>
        <ReactMarkdown
          className=""
          remarkPlugins={[remarkGfm]}
          components={{
            a({ node, children, href, ...props }) {
              return (
                <a href={href} className="text-blue-500 underline" {...props}>
                  {children}
                </a>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const Chatbot = ({ relevantData }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [logo, setLogo] = useState("/easy-money-new-logo.png"); 
  const [name, setName] = useState("TaxGPT");
  const [taxData, settaxData] = useState(relevantData);

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text, taxdata) => {
    try {
      const response = await fetch("/api/tax-compliance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text,  taxdata}),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", text: data.message }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", text: "Sorry, I encountered an error. Please try again." }
      ]);
    } finally {
      setInputDisabled(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput }
    ]);

    // Send message and disable input
    sendMessage(userInput, taxData);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  return (
    <div
      className="flex flex-col items-center"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="w-full justify-center flex gap-3 items-center mt-5 mb-2">
        <Image
          src={logo}
          className="rounded-full"
          alt={name}
          width={30}
          height={30}
        />
        <p className="text-xl font-bold">{name}</p>
      </div>
      <div className="flex flex-col items-start overflow-auto pl-5 w-full h-full text-sm">
        {messages.length > 0 ? (
          <div>
            {messages.map((msg, index) => (
              msg.role === "user" ? (
                <UserMessage 
                  key={index} 
                  text={msg.text} 
                />
              ) : (
                <AssistantMessage 
                  key={index} 
                  text={msg.text} 
                  logo={logo}
                  name={name}
                />
              )
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex justify-center items-center text-center text-gray-400 text-3xl w-full  my-auto mt-20">
            <p className="w-full text-center">Ask your All Tax Related Doubts</p>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-between items-center p-2 bg-white shadow-md rounded-lg mx-auto  w-full"
      >
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={
            inputDisabled ? "Answering..." : "What do you want to build?"
          }
          disabled={inputDisabled}
        />
        <button
          type="submit"
          className="rounded-full h-10 w-10 flex items-center justify-center bg-theme-purple-light hover:text-theme-purple-dark"
          disabled={inputDisabled}
        >
          <FaPaperPlane className="text-lg" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;