import { Form } from "@remix-run/react";

export default function FinancialRecordsTable({ records, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-center table-auto border-collapse bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border-b-2 border-gray-300 text-sm font-semibold text-gray-700 py-4 px-2">
              Name
            </th>
            <th className="border-b-2 border-gray-300 text-sm font-semibold text-gray-700 py-4 px-2">
              Income
            </th>
            <th className="border-b-2 border-gray-300 text-sm font-semibold text-gray-700 py-4 px-2">
              Percentage
            </th>
            <th className="border-b-2 border-gray-300 text-sm font-semibold text-gray-700 py-4 px-2">
              Transfer Amount
            </th>
            <th className="border-b-2 border-gray-300 text-sm font-semibold text-gray-700 py-4 px-2">
              Date
            </th>
            <th className="border-b-2 border-gray-300 text-sm font-semibold text-gray-700 py-4 px-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id} className="hover:bg-gray-50">
              <td className="py-4 px-2 border-b border-gray-200 text-gray-900">{record.name}</td>
              <td className="py-4 px-2 border-b border-gray-200 text-gray-900">£{record.income.toFixed(2)}</td>
              <td className="py-4 px-2 border-b border-gray-200 text-gray-900">{record.percentage}%</td>
              <td className="py-4 px-2 border-b border-gray-200 text-gray-900">
                £{record.transferAmount.toFixed(2)}
              </td>
              <td className="py-4 px-2 border-b border-gray-200 text-gray-900">
                {new Date(record.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="py-4 px-2 border-b border-gray-200 flex justify-center space-x-2">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => onEdit(record)}
                >
                  Edit
                </button>
                <Form method="post">
                  <input type="hidden" name="recordId" value={record._id} />
                  <button
                    type="submit"
                    name="_action"
                    value="delete"
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
