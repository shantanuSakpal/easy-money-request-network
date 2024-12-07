import { PayerType, RecipientType } from "@/types/actors";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function InvoiceTemplate({
  requestIds,
  payerDetails,
  invoiceData,
  recipient,
}: {
  requestIds: Array<string>;
  payerDetails: PayerType;
  invoiceData: any;
  recipient: Partial<RecipientType>;
}) {
  const { address } = useAccount();
  const formattedAmount = recipient.deductions
    ? (Number(recipient.amount) - Number(recipient.deductions)).toFixed(4)
    : Number(recipient.amount).toFixed(4);

  return (
    <div className="w-3/4 mx-auto p-8 bg-white">
      {/* Company Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {invoiceData.businessName || "N/A"}
          </h1>

          <p className="text-gray-600">
            {invoiceData.email || "Email not provided"} -{" "}
            {invoiceData.phone || "Contact not provided"}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">PAYMENT SLIP</h2>
          <p className="text-gray-600">
            Date: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            Invoice #: {invoiceData.invoiceNumber || "N/A"}
          </p>
        </div>
      </div>

      {/* Receiver Information */}
      <div className="mb-8 border-b pb-4">
        <h3 className="text-gray-700 font-semibold mb-2">Recipient Details:</h3>
        {recipient.name && (
          <p className="text-gray-600">Name: {recipient.name}</p>
        )}
        {recipient.businessName && (
          <p className="text-gray-600">
            Business Name: {recipient.businessName}
          </p>
        )}
        {recipient.email && (
          <p className="text-gray-600">Email: {recipient.email}</p>
        )}
        {recipient.walletAddress && (
          <p className="text-gray-600">
            Wallet Address: {recipient.walletAddress}
          </p>
        )}
        {recipient.phone && (
          <p className="text-gray-600">Phone: {recipient.phone}</p>
        )}
        {recipient.streetAddress && (
          <p className="text-gray-600">
            Address: {recipient.streetAddress}, {recipient.city || "N/A"},{" "}
            {recipient.state || "N/A"} {recipient.postalCode || "N/A"} -{" "}
            {recipient.country || "N/A"}
          </p>
        )}
        {recipient.taxRegistration && (
          <p className="text-gray-600">
            Tax Registration: {recipient.taxRegistration}
          </p>
        )}
      </div>

      {/* Payment Description */}
      <div className="mb-8 border-b pb-4">
        {
          <p className="text-gray-600 mb-2">
            Notes:
            {invoiceData.discription}
          </p>
        }
        {/* Request Links */}
        {
          <div className="mb-8">
            <h3 className="text-gray-700 font-semibold mb-4">Request Links</h3>
            <Link
              className="text-blue-500 underline"
              href={`https://scan.request.network/address/${address}`}
            >
              View Transaction on Request Scan
            </Link>
          </div>
        }
      </div>

      {/* Payment Details */}
      <div className="mb-8">
        <h3 className="text-gray-700 font-semibold mb-4">Payment Details</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Description</th>
              <th className="text-right p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Base</td>
              <td className="text-right p-2">{recipient.amount} ETH</td>
            </tr>
            {recipient.deductions && (
              <tr className="border-b">
                <td className="p-2">Deductions</td>
                <td className="text-right p-2">{recipient.deductions} ETH</td>
              </tr>
            )}
            <tr className="font-bold">
              <td className="p-2">Net Pay</td>
              <td className="text-right p-2">{formattedAmount} ETH</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-600 text-center border-t pt-4">
        <p>This is a computer-generated document. No signature required.</p>
      </div>
    </div>
  );
}
