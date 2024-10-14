"use client";
import React from "react";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ChartPie,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

interface User {
  name: string;
  email: string;
  roleName: string;
  roleId: number;
}

interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarCollapsed,
  toggleSidebar,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated
  const user = useAppSelector((state: { auth: AuthState }) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRedirectReports = () => {
    router.push("/reports");
  };

  const handleRedirect = () => {
    if (user?.roleName === "DM") {
      router.push("/dashboard/projects");
    } else {
      router.push("/dashboard/accounts");
    }
  };

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? "w-16" : "w-64"} `}>
      <div className="flex flex-col h-full ">
        {/* Logo and Company Name */}
        <div className="flex items-center p-4 justify-center ">
          {!isSidebarCollapsed && (
            <span className="ml-2 font-semibold">Quality Nexus</span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-3">
          <ul className="space-y-6 ">
            <li
              className={` ${
                pathname === "/reports"
                  ? ""
                  : "border-l-4 border-l-blue-700 rounded-sm"
              }`}
            >
              <Button
                variant="ghost"
                className={`w-full justify-start  gap-2 ${
                  isSidebarCollapsed ? "px-2" : "px-4"
                }`}
                onClick={handleRedirect}
              >
                <LayoutDashboard />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </Button>
            </li>
            <li
              className={` ${
                pathname === "/reports"
                  ? "border-l-4 border-l-blue-700 rounded-sm"
                  : ""
              }`}
            >
              <Button
                variant="ghost"
                className={`w-full justify-start  gap-2 ${
                  isSidebarCollapsed ? "px-2" : "px-4"
                }`}
                onClick={handleRedirectReports}
              >
                <ChartPie />
                {!isSidebarCollapsed && <span>Reports</span>}
              </Button>
            </li>
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t ">
          <div className="flex items-center mb-2">
            {/* <Avatar className="h-8 w-8">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User Avatar"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar> */}
            {!isSidebarCollapsed && (
              <div className="ml-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-blue-300">{user?.roleName}</p>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <Button
              variant="outline"
              className="w-full justify-start "
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className="p-2 w-full flex justify-center"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
