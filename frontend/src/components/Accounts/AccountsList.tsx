"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type Account = {
  accountId: number;
  accountName: string;
};

type AccountListProps = {
  accounts: Account[]; // Correctly type the accounts prop
};

export default function AccountList({ accounts }: AccountListProps) {
  const route = useRouter();

  const handleCardClick = (accountId: number) => {
    route.push(`/dashboard/projects/${accountId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Accounts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {accounts.map((account: Account) => (
          <Card
            key={account.accountId}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleCardClick(account.accountId)}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">
                {account.accountName}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
