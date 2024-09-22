import { Form } from "@remix-run/react";

export default function AuthForm({ isCreatingAccount, error, toggleAccountCreation }) {
  return (
    <div className="inset-0 fixed flex items-center justify-center min-h-screen bg-black bg-opacity-50">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg mx-auto">
        <h1 className="text-3xl text-black text-center font-bold mb-6">
          {isCreatingAccount ? "Create an Account" : "Login"}
        </h1>
        
        {/* Display error if exists */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-sm">
            {error}
          </div>
        )}

        <Form method="post" className="space-y-6">
          {/* Hidden input for form action */}
          <input type="hidden" name="_action" value={isCreatingAccount ? "createAccount" : "login"} />

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email Address"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-slate-200 text-black focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Your Password"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-slate-200 text-black focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Additional Fields for Account Creation */}
          {isCreatingAccount && (
            <>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Enter Your First Name"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-slate-200 text-black focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Enter Your Last Name"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-slate-200 text-black focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-300"
          >
            {isCreatingAccount ? "Create Account" : "Login"}
          </button>
        </Form>

        {/* Toggle Link between Login and Create Account */}
        <div className="text-center mt-6">
          <button
            type="button"
            className="text-indigo-600 hover:underline font-medium"
            onClick={toggleAccountCreation}
          >
            {isCreatingAccount
              ? "Already have an account? Login"
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
