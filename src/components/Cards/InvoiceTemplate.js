const InvoiceTemplate = ({
  payerName,
  payerAddress,
  payerContact,
  payerEmail,
  note,
  recipient,
}) => {
  return (
    <div className="w-3/4 mx-auto p-8 bg-white">
      {/* Company Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{payerName}</h1>
          <p className="text-gray-600">{payerAddress}</p>
          <p className="text-gray-600">
            {payerEmail} - {payerContact}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">PAYMENT SLIP</h2>
          <p className="text-gray-600">
            Date: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-600">Invoice #: INV-2023-001</p>
        </div>
      </div>

      {/* Reciever Information */}
      <div className="mb-8 border-b pb-4">
        <h3 className="text-gray-700 font-semibold mb-2">
          Payment Reciever Details:
        </h3>
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-gray-600">Name: {recipient.name}</p>
            <p className="text-gray-600 text-left">
              Department/Team: {recipient.teamName}
            </p>
          </div>
          <div className="">
            <p className="text-gray-600 text-right">Email: {recipient.email}</p>
          </div>
        </div>
        <p className="text-gray-600 ">
          Wallet Address: {recipient.walletAddress}
        </p>
      </div>

      <div className="mb-8 border-b pb-4 ">
        <p className="text-gray-600 mb-2">Description: {note}</p>
      </div>

      <div className="mb-8 border-b pb-4 ">
        <p className="text-gray-600 mb-2">Note: {recipient.notes}</p>
      </div>

      <div className="mb-8 border-b pb-4 ">
        <p className="mb-2">Transaction Hash: something something</p>
        <a className=" text-blue-500" href="LINK">
          Request Scan - LINK{" "}
        </a>
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
              <td className="text-right p-2">{recipient.amount} eth</td>
            </tr>
            {recipient.deductions && (
              <tr className="border-b">
                <td className="p-2">Deductions</td>
                <td className="text-right p-2">{recipient.deductions}</td>
              </tr>
            )}
            <tr className="font-bold">
              <td className="p-2">Net Pay</td>
              <td className="text-right p-2">
                {recipient.deductions
                  ? (
                      Number(recipient.amount) - Number(recipient.deductions)
                    ).toFixed(4)
                  : Number(recipient.amount).toFixed(4)}{" "}
                ETH
              </td>
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
};

export default InvoiceTemplate;
