'use client'
import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";

const NotificationDropdown = () => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = useRef(null);
  const popoverDropdownRef = useRef(null);
  const popperInstance = useRef(null);

  useEffect(() => {
    if (dropdownPopoverShow && btnDropdownRef.current && popoverDropdownRef.current) {
      popperInstance.current = createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "left-start",
        strategy: "fixed",
        modifiers: [
          {
            name: "preventOverflow",
            options: {
              boundary: window
            }
          }
        ]
      });
    }

    return () => {
      if (popperInstance.current) {
        popperInstance.current.destroy();
        popperInstance.current = null;
      }
    };
  }, [dropdownPopoverShow]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownPopoverShow(!dropdownPopoverShow);
  };

  return (
    <>
      <a
        className="text-blueGray-500 py-1 px-3"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={toggleDropdown}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>
      <div
        ref={popoverDropdownRef}
        className={`${dropdownPopoverShow ? "block" : "hidden"} bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48`}
      >
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Edit
        </a>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-red-500"
          }
          onClick={(e) => e.preventDefault()}
        >
          Delete
        </a>
      </div>
    </>
  );
};

export default NotificationDropdown;
