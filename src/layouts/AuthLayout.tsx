import React from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          {children}
        </div>
      </div>
    </main>
  );
};
