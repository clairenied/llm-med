import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

// Default mock session for authenticated user
export const mockSession: Session = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    role: "AUTHOR",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Mock admin session
export const mockAdminSession: Session = {
  user: {
    id: "admin-user-id",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Mock grader session
export const mockGraderSession: Session = {
  user: {
    id: "grader-user-id",
    name: "Grader User",
    email: "grader@example.com",
    role: "GRADER",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

interface AllTheProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

const AllTheProviders = ({
  children,
  session = null,
}: AllTheProvidersProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  session?: Session | null;
}

const customRender = (
  ui: ReactElement,
  { session, ...options }: CustomRenderOptions = {}
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders session={session}>{children}</AllTheProviders>
    ),
    ...options,
  });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
