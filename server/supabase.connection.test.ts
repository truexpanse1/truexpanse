import { describe, it, expect } from "vitest";

describe("Supabase Database Configuration", () => {
  it("should have SUPABASE_DATABASE_URL environment variable set", () => {
    expect(process.env.SUPABASE_DATABASE_URL).toBeDefined();
    expect(process.env.SUPABASE_DATABASE_URL).toContain("postgresql://");
    expect(process.env.SUPABASE_DATABASE_URL).toContain("supabase.co");
  });

  it("should have valid PostgreSQL connection string format", () => {
    const url = process.env.SUPABASE_DATABASE_URL;
    expect(url).toMatch(/^postgresql:\/\//);
    expect(url).toContain("@");
    expect(url).toContain(":");
  });
});
