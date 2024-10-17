/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/redux/slices/authSlice";

// Define a higher-order component (HOC) for authentication
const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.user !== null); // Check if user is authenticated
    const dispatch = useDispatch(); // Initialize Redux dispatch function
    const router = useRouter(); // Get the Next.js router instance

    // Function to handle logout
    const handleLogout = () => {
      // Dispatch the logout action
      dispatch(logout());
      // Redirect to the login page
      router.push("/");
    };

    // Redirect to the login page if not authenticated
    useEffect(() => {
      // Redirect to the login page if not authenticated
      if (!isAuthenticated) {
        router.push("/");
      }
    }, [isAuthenticated]);

    // Render the WrappedComponent with additional props if authenticated, otherwise return null
    if (isAuthenticated) {
      return <WrappedComponent {...props} handleLogout={handleLogout} />;
    } else {
      // You can render a loading spinner or a message here
      return null;
    }
  };

  return Wrapper;
};

export default withAuth; // Export the withAuth higher-order component
