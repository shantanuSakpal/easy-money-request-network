"use client";

import React, { useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";

const TaxComponent = ({ jsonData }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateNotes = async () => {
    if (!jsonData || jsonData.length === 0) {
      setError("No data to process.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/tax-compliance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jsonData }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate notes");
      }

      const data = await response.json();
      setInsights(data.extractedJson);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Financial Insights</h2>
        <Button 
          color="primary" 
          onClick={handleGenerateNotes} 
          isLoading={loading}
        >
          Generate Insights
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      {insights && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Financial Summary</h3>
            <Chip color="primary" variant="flat">
              {insights.totalTransactions} Transactions
            </Chip>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-blue-600">
                  {insights.totalAmount} {jsonData[0]?.currency}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Estimated Taxes</p>
                <p className="text-xl font-bold text-red-600">
                  {insights.taxesToPay} {jsonData[0]?.currency}
                </p>
              </div>
            </div>

            {insights.payerSummary && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Payer Summary</h4>
                {Object.entries(insights.payerSummary).map(([address, summary]) => (
                  <div key={address} className="bg-gray-100 p-3 rounded-lg mb-2">
                    <p className="text-sm">
                      <span className="font-medium">Address:</span> {address}
                    </p>
                    <p className="text-sm">
                      Total Amount Paid: {summary.totalAmountPaid} {jsonData[0]?.currency}
                    </p>
                    <p className="text-sm">
                      Tax Liability: {summary.taxLiability} {jsonData[0]?.currency}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default TaxComponent;