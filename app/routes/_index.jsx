// routes/index.jsx
import { useState } from "react";
import { Form, useLoaderData, useActionData, redirect } from "@remix-run/react";
import connectDB from "../db/connection";
import FinancialRecord from "../models/FinancialRecord";
import User from "../models/User";
import { getUserFromSession, getSession, commitSession } from "../utils/sessions";
import AuthForm from "../components/AuthForm";
import FinancialRecordForm from "../components/FinancialRecordForm";
import FinancialRecordsTable from "../components/FinancialRecordsTable";

export const meta = () => {
  return [{
    title: "Financial Tracker",
    description: "A tool to help you manage and track your finances effectively.",
    keywords: "finance, tracker, savings, income, expenses",
    "og:title": "Financial Tracker",
    "og:description": "Manage and track your finances with ease using the Financial Tracker app.",
  }];
};

// Loader function to check session and fetch financial records
export async function loader({ request }) {
  await connectDB();
  
  // Fetch user from session
  const userId = await getUserFromSession(request);

  if (!userId) {
    return { loggedIn: false, financialRecords: [] };
  }

  // Fetch financial records for the logged-in user
  const financialRecords = await FinancialRecord.find({ user: userId }).lean();
  const recordsWithTransferAmount = financialRecords.map((record) => ({
    ...record,
    transferAmount: (record.income * record.percentage) / 100,
  }));

  return { loggedIn: true, financialRecords: recordsWithTransferAmount };
}

// Action function for handling form submissions
export async function action({ request }) {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  await connectDB();

  const userId = await getUserFromSession(request);
  
  if (actionType === "login" || actionType === "createAccount") {
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    let user;

    if (actionType === "login") {
      user = await User.findOne({ email, password });
      if (!user) return { error: "Invalid credentials" };
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) return { error: "Email already in use" };

      user = new User({ email, password, firstName, lastName });
      await user.save();
    }

    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user._id);
    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  if (!userId) return { error: "You must be logged in to perform this action" };

  if (actionType === "create" || actionType === "update") {
    const recordId = formData.get("recordId");
    const income = parseFloat(formData.get("income"));
    const percentage = parseFloat(formData.get("percentage"));
    const name = formData.get("name");

    if (actionType === "update") {
      await FinancialRecord.findByIdAndUpdate(recordId, { income, percentage, name });
    } else {
      const financialRecord = new FinancialRecord({
        income,
        percentage,
        name,
        user: userId,
      });
      await financialRecord.save();
    }
  } else if (actionType === "delete") {
    const recordId = formData.get("recordId");
    await FinancialRecord.findByIdAndDelete(recordId);
  } else if (actionType === "logout") {
    const session = await getSession(request.headers.get("Cookie"));
    session.unset("userId");
    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  return redirect("/");
}

export default function Index() {
  const { loggedIn, financialRecords } = useLoaderData();
  const actionData = useActionData();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [income, setIncome] = useState("");
  const [percentage, setPercentage] = useState("");
  const [name, setName] = useState("");

  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    setIncome(record.income);
    setPercentage(record.percentage);
    setName(record.name);
  };

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
        <AuthForm
          isCreatingAccount={isCreatingAccount}
          error={actionData?.error}
          toggleAccountCreation={() => setIsCreatingAccount(!isCreatingAccount)}
        />
      )}

      {/* Financial Tracker Form */}
      {loggedIn && (
        <>
          <div className="container max-w-lg mx-auto p-8 bg-white rounded-lg shadow-xl mb-8">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Financial Tracker</h1>
            <p className="text-gray-600 mb-6">
              Plan your financial strategy by providing your income, savings percentage, and naming your strategy.
            </p>

            <FinancialRecordForm
              selectedRecord={selectedRecord}
              income={income}
              setIncome={setIncome}
              percentage={percentage}
              setPercentage={setPercentage}
              name={name}
              setName={setName}
              handleSubmit={handleSubmit}
            />
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

          {/* Financial Records Table */}
          <div className="container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Financial Records</h2>
            {financialRecords.length > 0 ? (
              <FinancialRecordsTable records={financialRecords} onEdit={handleSelectRecord} />
            ) : (
              <p className="text-gray-600">No financial records found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
