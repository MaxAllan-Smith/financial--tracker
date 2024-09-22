import { Form } from "@remix-run/react";

export default function FinancialRecordForm({
  selectedRecord,
  income,
  setIncome,
  percentage,
  setPercentage,
  name,
  setName,
  handleSubmit
}) {
  return (
    <Form method="post" className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-xl mx-auto" onSubmit={handleSubmit}>
      {/* Hidden field to store record ID */}
      <input type="hidden" name="recordId" value={selectedRecord ? selectedRecord._id : ""} />

      {/* Income Field */}
      <div>
        <label htmlFor="income" className="block text-sm font-medium text-gray-700">
          Income
        </label>
        <input
          type="number"
          name="income"
          id="income"
          placeholder="Enter Your Income Amount"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-slate-200 text-black focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Savings Percentage Field */}
      <div>
        <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">
          Savings Percentage
        </label>
        <input
          type="number"
          name="percentage"
          id="percentage"
          placeholder="Enter Percentage"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-slate-200 text-black focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Saving Tactic Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Saving Tactic Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter Saving Tactic Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-slate-200 text-black focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Submit or Update Button */}
      <button
        type="submit"
        name="_action"
        value={selectedRecord ? "update" : "create"}
        className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-300"
      >
        {selectedRecord ? "Update" : "Submit"}
      </button>
    </Form>
  );
}
