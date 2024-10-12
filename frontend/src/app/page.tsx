/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { error, loading } = useAppSelector((state) => state.auth);

  // Check if user is authenticated
  const isAuthenticated = useAppSelector(
    (state: any) => state.auth.user !== null
  );

  const user = useAppSelector((state: any) => state.auth.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      if (result?.payload?.roleName === "DM") {
        router.replace(`/dashboard/projects`);
      } else {
        router.replace("/dashboard/accounts");
      }

      toast.success("Login successful");
    } else {
      toast.error("Please Enter a valid Email ID and password.");
    }
  };

  // Helper function to safely convert error to string
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  // Effect to redirect to translation list page if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.roleName === "DM") {
        router.replace(`/dashboard/projects`);
      } else {
        router.replace("/dashboard/accounts");
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <Input
                type="email"
                placeholder="Airspace@info.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="on"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <Checkbox id="remember-me" />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{getErrorMessage(error)}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-md py-2"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign in with Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-md py-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              <span>Sign in with Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-md py-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              <span>Sign in with Apple</span>
            </Button>
          </div>

          <div className="text-sm text-center">
            <span className="text-gray-500">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Right Section - Heading and Logo */}
      <div className="w-1/2  flex flex-col items-center justify-center">
        <div className="text-center">
          {/* <Image
            src="/placeholder.svg?height=100&width=100"
            alt="Airspace Logo"
            width={100}
            height={100}
            className="mx-auto mb-4"
          /> */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 pr-5">
            Automated Goal Tracking and Management System
            <br />
            for Efficient Project Oversight with
            <br /> <span className="text-blue-600">Quality Nexus</span>!
          </h1>
          {/* <Image
            src="/placeholder.svg?height=200&width=200"
            alt="Cloud Illustration"
            width={200}
            height={200}
            className="mx-auto" */}
        </div>
      </div>
    </div>
  );
}
