import { useState } from "react";
import { Form, useLoaderData, useActionData, redirect } from "@remix-run/react";
import connectDB from "../db/connection";
import FinancialRecord from "../models/FinancialRecord";
import { getSession, commitSession } from "../sessions"; // Handling sessions
import User from "../models/User"; // Assuming you have a User model

// Loader function to check session and fetch financial records
export async function loader({ request }) {
  await connectDB();

  // Get the current session
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  // If there's no logged-in user, return empty records and show login modal
  if (!userId) {
    return { loggedIn: false, financialRecords: [] };
  }

  // Fetch financial records for the logged-in user
  const financialRecords = await FinancialRecord.find({ user: userId }).lean();
  const recordsWithTransferAmount = financialRecords.map((record) => {
    const transferAmount = (record.income * record.percentage) / 100;
    return { ...record, transferAmount };
  });

  return { loggedIn: true, financialRecords: recordsWithTransferAmount };
}

// Action function for handling form submissions, updates, deletions, and login
export async function action({ request }) {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  await connectDB();

  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (actionType === "login") {
    // Login logic
    const email = formData.get("email");
    const password = formData.get("password");
    const user = await User.findOne({ email, password });

    if (user) {
      session.set("userId", user._id);
      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } else {
      // Return error message for invalid login
      return { error: "Invalid credentials" };
    }
  } else if (actionType === "createAccount") {
    // Account creation logic
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email already in use" };
    }

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
    });
    await newUser.save();

    session.set("userId", newUser._id);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else if (actionType === "delete") {
    const recordId = formData.get("recordId");
    await FinancialRecord.findByIdAndDelete(recordId);
  } else if (actionType === "update") {
    const recordId = formData.get("recordId");
    const income = parseFloat(formData.get("income"));
    const percentage = parseFloat(formData.get("percentage"));
    const name = formData.get("name");

    await FinancialRecord.findByIdAndUpdate(recordId, {
      income,
      percentage,
      name,
    });
  } else if (actionType === "create") {
    const income = parseFloat(formData.get("income"));
    const percentage = parseFloat(formData.get("percentage"));
    const name = formData.get("name");

    if (!userId) {
      return { error: "You must be logged in to create a financial record" };
    }

    const financialRecord = new FinancialRecord({
      income,
      percentage,
      name,
      user: userId,
    });
    await financialRecord.save();
  } else if (actionType === "logout") {
    // Handle logout: destroy session
    session.unset("userId");
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return redirect("/");
}

export default function Index() {
  const { loggedIn, financialRecords } = useLoaderData();
  const actionData = useActionData(); // Capture error messages from action

  // State to toggle between login and create account
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // State to control form inputs and the selected record
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [income, setIncome] = useState("");
  const [percentage, setPercentage] = useState("");
  const [name, setName] = useState("");

  // Handle selecting a record from the table
  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    setIncome(record.income);
    setPercentage(record.percentage);
    setName(record.name);
  };

  // Handle form reset after submission
  const handleSubmit = () => {
    setSelectedRecord(null);
    setIncome("");
    setPercentage("");
    setName("");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-slate-800 to-slate-900 min-h-screen">
      {/* Login/Create Account Modal */}
      {!loggedIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            {/* Toggle between Login and Create Account */}
            <h1 className="text-2xl text-black text-center font-extrabold mb-4">
              {isCreatingAccount ? "Create an Account" : "Login"}
            </h1>

            {/* Display error message if login or account creation fails */}
            {actionData?.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {actionData.error}
              </div>
            )}

            {/* Form for Login or Account Creation */}
            <Form method="post" className="space-y-4">
              <input
                type="hidden"
                name="_action"
                value={isCreatingAccount ? "createAccount" : "login"}
              />

              {/* Common Fields: Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Your Email Address"
                  className="mt-1 bg-slate-200 text-black block w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Common Fields: Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Your Password"
                  className="mt-1 bg-slate-200 text-black block w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Additional Fields for Account Creation */}
              {isCreatingAccount && (
                <>
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="Enter Your First Name"
                      className="mt-1 bg-slate-200 text-black block w-full px-4 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Enter Your Last Name"
                      className="mt-1 bg-slate-200 text-black block w-full px-4 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500"
              >
                {isCreatingAccount ? "Create Account" : "Login"}
              </button>
            </Form>

            {/* Toggle Link */}
            <div className="text-center mt-4">
              <button
                type="button"
                className="text-indigo-600 hover:underline"
                onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              >
                {isCreatingAccount
                  ? "Already have an account? Login"
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Financial Records and Form */}
      {loggedIn && (
        <div className="container max-w-lg mx-auto p-8 bg-white rounded-lg shadow-xl mb-8">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">
            Financial Tracker
          </h1>
          <p className="text-gray-600 mb-6">
            Plan your financial strategy by providing your income, savings
            percentage, and naming your strategy.
          </p>

          <Form method="post" className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="recordId"
              value={selectedRecord ? selectedRecord._id : ""}
            />
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
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="mt-1 bg-slate-200 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
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
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="mt-1 bg-slate-200 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>

            {/* Name Field */}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-slate-200 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>

            {/* Submit or Update Button */}
            <div>
              <button
                type="submit"
                name="_action"
                value={selectedRecord ? "update" : "create"}
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500"
              >
                {selectedRecord ? "Update" : "Submit"}
              </button>
            </div>
          </Form>

          {/* Logout Button */}
          <Form method="post">
            <button
              type="submit"
              name="_action"
              value="logout"
              className="w-full mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-500"
            >
              Logout
            </button>
          </Form>
        </div>
      )}

      {/* Table to display financial records */}
      {loggedIn && (
        <div className="container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl">
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
                  <th className="border-b-2 text-black pb-2">
                    Transfer Amount
                  </th>
                  <th className="border-b-2 text-black pb-2">Date</th>
                  <th className="border-b-2 text-black pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {financialRecords.map((record) => (
                  <tr key={record._id}>
                    <td className="py-2 text-black border-b">{record.name}</td>
                    <td className="py-2 text-black border-b">
                      £{record.income.toFixed(2)}
                    </td>
                    <td className="py-2 text-black border-b">
                      {record.percentage}%
                    </td>
                    <td className="py-2 text-black border-b">
                      £{record.transferAmount.toFixed(2)}
                    </td>
                    <td className="py-2 text-black border-b">
                      {new Date(record.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2 text-black border-b">
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                        onClick={() => handleSelectRecord(record)}
                      >
                        Edit
                      </button>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="recordId"
                          value={record._id}
                        />
                        <button
                          type="submit"
                          name="_action"
                          value="delete"
                          className="bg-red-500 text-white px-2 py-1 mt-2 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </Form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No financial records found.</p>
          )}
        </div>
      )}
    </div>
  );
}
