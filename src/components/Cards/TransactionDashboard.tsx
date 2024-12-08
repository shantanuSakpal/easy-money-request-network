import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Chip, Button } from "@nextui-org/react";
import { Copy, ExternalLink, ChevronRight } from 'lucide-react';

// Types for better type safety
interface Transaction {
  requestId: string;
  currency: string;
  network: string;
  expectedAmount: string;
  state: string;
  reason: string;
  dueDate: string;
  payee: string;
  payer: string;
  paymentAddress: string;
}

interface FinancialInsights {
  totalTransactions: number;
  totalAmount: number;
  taxesToPay: number;
  payerSummary: Record<string, { totalAmountPaid: number, taxLiability: number }>;
  payeeSummary: Record<string, { totalAmountReceived: number }>;
}

interface DashboardProps {
  transactions: Transaction[];
  insights: FinancialInsights | null;
}

const TransactionDashboard: React.FC<DashboardProps> = ({ transactions, insights }) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const shortenAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Financial Insights Card */}
      {insights && (
        <Card className="bg-blue-50 border-2 border-blue-200">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-800">Financial Overview</h2>
            <Chip color="primary" variant="flat">
              {insights.totalTransactions} Transactions
            </Chip>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total Amount</p>
              <p className="text-xl font-semibold text-blue-700">
                {insights.totalAmount} {transactions[0]?.currency}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Estimated Taxes</p>
              <p className="text-xl font-semibold text-red-700">
                {insights.taxesToPay} {transactions[0]?.currency}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Transactions List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactions?.map((transaction, index) => (
          <Card 
            key={transaction.requestId} 
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="flex justify-between">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold">Transaction #{index + 1}</h3>
                <Chip 
                  color={transaction.state === 'created' ? 'success' : 'default'} 
                  size="sm" 
                  variant="flat"
                >
                  {transaction.state}
                </Chip>
              </div>
              <div>{transaction.reason}</div>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold">
                  {transaction.expectedAmount} {transaction.currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Network</span>
                <Chip size="sm" variant="dot" color="secondary">
                  {transaction.network}
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Due Date</span>
                <span>{transaction.dueDate}</span>
              </div>
            </CardBody>
            <CardFooter className="flex justify-between">
              <div className="space-x-2">
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="primary"
                  onClick={() => copyToClipboard(transaction.payee)}
                >
                  {copiedAddress === transaction.payee ? '✓' : <Copy size={16} />}
                </Button>
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  color="primary"
                  onClick={() => window.open(`https://sepolia.etherscan.io/address/${transaction.payee}`, '_blank')}
                >
                  <ExternalLink size={16} />
                </Button>
              </div>
              <Button 
                endContent={<ChevronRight size={16} />} 
                size="sm" 
                color="primary" 
                variant="flat"
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TransactionDashboard;