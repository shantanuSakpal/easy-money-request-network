import Image from "next/image";
import React from "react";
import logo from "@/assets/easy-money-new-logo.png";
import Link from "next/link";
export const BrandLogo = () => {
  return (
    <Link href={"/"} className="flex items-center space-x-2">
      {/* Image with green tint */}
      <div className="w-12 h-12">
        <Image
          src={logo} // Replace with the actual path to your image
          alt="Easy Money"
          className="w-full h-full object-cover rounded-lg "
        />
      </div>
      {/* Brand Name */}
      <div className="text-green-600 font-bold text-2xl">Easy Money</div>
    </Link>
  );
};
