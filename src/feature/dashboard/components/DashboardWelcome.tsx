import React from "react";

interface DashboardWelcomeProps {
  user: any;
}

export function DashboardWelcome({ user }: DashboardWelcomeProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {user
          ? `Welcome back, ${user.displayName}!`
          : "Welcome to RSS Reader"}
      </h1>
      <p className="text-gray-600">
        {user
          ? "Stay up to date with your favorite feeds"
          : "Discover and follow your favorite content sources"}
      </p>
    </div>
  );
}
