/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import SidebarLayout from "@/app/sidebar-layout";
import AccountList from "@/components/Accounts/AccountsList";
import Layout from "@/components/Layout/Layout";
import Skeleton from "@/components/LoadingSkeleton/Skeleton";
import { getAccounts } from "@/services/accountsService";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Account = {
  accountId: number;
  accountName: string;
};

const Accounts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const response = await getAccounts();

      // Assuming the response returns an array of accounts
      if (Array.isArray(response)) {
        setAccounts(response); // Fix here to update with actual response data
        setIsLoading(false);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      toast.error("Error fetching accounts.");
      // console.log("Error fetching accounts:", error);
    }
  }

  return (
    <div>
      <Layout>
        <SidebarLayout>
          {isLoading ? <Skeleton /> : <AccountList accounts={accounts} />}
        </SidebarLayout>
      </Layout>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Accounts), {
  ssr: false,
});
