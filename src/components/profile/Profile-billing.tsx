// pages/export-invoice.js
export default function ExportInvoice() {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-blue-600">PROLO SOLUTION PRIVATE LIMITED</h1>
              <p className="text-sm text-gray-700">PM Kareem Centre, No 15/1031 Wonderla Road,</p>
              <p className="text-sm text-gray-700">Athani Junction, Kakkanad, Ernakulam, PIN 682030, Kerala India</p>
              <p className="text-sm text-gray-700">Phone: +91 9036535940, contact@eximso.com, www.eximso.com</p>
              <p className="text-sm text-gray-700">CIN: U46909KL2023PTC084715</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">EXPORT INVOICE</h2>
            </div>
          </div>
  
          {/* Shipper and Customer */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">SHIPPER</h3>
              <p className="text-sm text-gray-700">PROLO SOLUTION PRIVATE LIMITED</p>
              <p className="text-sm text-gray-700">PM Kareem Centre, No 15/1031 Wonderla Road,</p>
              <p className="text-sm text-gray-700">Athani Junction, Kakkanad, Ernakulam, PIN 682030, Kerala India</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">CUSTOMER</h3>
              <p className="text-sm text-gray-700">[Customer Details]</p>
            </div>
          </div>
  
          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-gray-700"><span className="font-bold">Invoice Number & Date:</span> [Details]</p>
              <p className="text-sm text-gray-700"><span className="font-bold">Buyer&apos;s Order No. & Date:</span> [Details]</p>
              <p className="text-sm text-gray-700"><span className="font-bold">GSTIN:</span> 32AAOPC2609R1ZW</p>
            </div>
            <div>
              <p className="text-sm text-gray-700"><span className="font-bold">IE Code:</span> AAOPC2609R</p>
              <p className="text-sm text-gray-700"><span className="font-bold">Bank AD Code:</span> 63610859701431</p>
            </div>
          </div>
  
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">SL No</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">Description of Goods</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">HSN Code</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">UOM</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">Unit</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">Unit Rate (USD)</th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">Amount (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">1</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">[Details]</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">[HSN]</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">[UOM]</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">[Unit]</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">[Qty]</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">[Rate]</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">[Amount]</td>
                </tr>
                <tr>
                  <td colSpan={7} className="border border-gray-300 px-4 py-2 text-right font-bold text-gray-800">Total Amount</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 font-bold">$0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          {/* Footer */}
          <div className="mt-8 text-sm text-gray-700">
            <p>Amount Inwords: [In Words]</p>
            <p className="text-blue-600 font-medium mt-4">eximso.com - shop global feel local</p>
          </div>
        </div>
      </div>
    );
  }
  