"use client";

import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { 
  FaMoneyBillWave,  // Total Transactions
  FaArrowDown,      // Total Incoming 
  FaArrowUp,        // Total Outgoing
  FaUsers           // Unique Payers
} from "react-icons/fa";

function TaxComponent({ jsonData }) {
  // Calculate summary statistics
  const totalTransactions = jsonData?.length || 0;
  const totalAmount = jsonData?.reduce((sum, transaction) => {
    return sum + parseFloat(transaction.expectedAmount || '0');
  }, 0);

  const uniquePayers = new Set(jsonData?.map(transaction => transaction.payer)).size;

  // Separate incoming and outgoing transactions
  const { incomingTransactions, outgoingTransactions } = jsonData?.reduce((acc, transaction) => {
    // Assuming transactions are outgoing if the payer is the user's address
    if (transaction.payer === transaction.payee) {
      acc.outgoingTransactions++;
    } else {
      acc.incomingTransactions++;
    }
    return acc;
  }, { incomingTransactions: 0, outgoingTransactions: 0 }) || { incomingTransactions: 0, outgoingTransactions: 0 };

  const cardData = [
    {
      title: "Total Transactions",
      value: totalTransactions,
      color: "text-blue-600",
      icon: FaMoneyBillWave
    },
    {
      title: "Total Incoming",
      value: incomingTransactions,
      color: "text-green-600",
      icon: FaArrowDown
    },
    {
      title: "Total Outgoing",
      value: outgoingTransactions,
      color: "text-red-600",
      icon: FaArrowUp
    },
    {
      title: "Unique Payers",
      value: uniquePayers,
      color: "text-purple-600",
      icon: FaUsers
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {cardData.map((card, index) => (
        <Card key={index} className="shadow-lg h-42">
          <CardBody className="flex flex-col justify-between p-6">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium text-gray-600">{card.title}</p>
              <div className="bg-gray-100 p-3 rounded-full">
                <card.icon className={`text-2xl ${card.color}`} />
              </div>
            </div>
            <div className="flex items-center justify-center text-center">
              <p className={`text-4xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default TaxComponent;