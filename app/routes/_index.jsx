import { Form, useLoaderData, redirect } from "@remix-run/react";
import connectDB from "../db/connection";
import FinancialRecord from "../models/FinancialRecord";

export async function action({ request }) {
  await connectDB();

  const formData = await request.formData();

  const income = parseFloat(formData.get("income"));
  const percentage = parseFloat(formData.get("percentage"));
  const name = formData.get("name");

  const financialRecord = new FinancialRecord({ income, percentage, name });

  await financialRecord.save();

  return redirect("/");
}

export async function loader() {
  await connectDB();

  const financialRecords = await FinancialRecord.find().lean();

  const recordsWithTransferAmount = financialRecords.map((record) => {
    const transferAmount = (record.income * record.percentage) / 100;
    return { ...record, transferAmount };
  });

  return recordsWithTransferAmount;
}

export default function Index() {
  // Load the financial records with the calculated transfer amount
  const financialRecords = useLoaderData();

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-slate-800 to-slate-900 min-h-screen">
      <div className="container max-w-lg mx-auto p-8 bg-white rounded-lg shadow-xl mb-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Financial Tracker
        </h1>
        <p className="text-gray-600 mb-6">
          Plan your financial strategy by providing your income, savings
          percentage, and naming your strategy.
        </p>

        <Form method="post" className="space-y-6">
          {/* Income Field */}
          <div>
            <label
              htmlFor="income"
              className="block text-sm font-medium text-gray-700"
            >
              Income
            </label>
            <input
              type="number"
              name="income"
              id="income"
              placeholder="Enter Your Income Amount"
              className="mt-1 bg-slate-200 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Percentage Field */}
          <div>
            <label
              htmlFor="percentage"
              className="block text-sm font-medium text-gray-700"
            >
              Savings Percentage
            </label>
            <input
              type="number"
              step="0.01"
              name="percentage"
              id="percentage"
              placeholder="Enter Percentage (e.g., 0.25 for 25%)"
              className="mt-1 bg-slate-200 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Name of Saving Tactic Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Saving Tactic Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Saving Tactic Name"
              className="mt-1 bg-slate-200 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </Form>
      </div>

      {/* Table to display financial records */}
      <div className="container max-w-xl mx-auto p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Financial Records
        </h2>
        {financialRecords.length > 0 ? (
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 text-black pb-2">Name</th>
                <th className="border-b-2 text-black pb-2">Income</th>
                <th className="border-b-2 text-black pb-2">Percentage</th>
                <th className="border-b-2 text-black pb-2">Transfer Amount</th>
                <th className="border-b-2 text-black pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {financialRecords.map((record) => (
                <tr key={record._id}>
                  <td className="py-2 text-black border-b">{record.name}</td>
                  <td className="py-2 text-black border-b">£{record.income.toFixed(2)}</td>
                  <td className="py-2 text-black border-b">{record.percentage}%</td>
                  <td className="py-2 text-black border-b">£{record.transferAmount.toFixed(2)}</td>
                  <td className="py-2 text-black border-b">{new Date(record.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No financial records found.</p>
        )}
      </div>
    </div>
  );
}
