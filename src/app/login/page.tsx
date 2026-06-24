"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

const T = {
  primary: "#155E63",
  primaryH: "#124A54",
  ink: "#1F2937",
  body: "#6B7280",
  canvas: "#FCFBF8",
  soft: "#F7F5F1",
  border: "#E5DFD3",
  onPrimary: "#FFFFFF",
  success: "#D1FAE5",
  successText: "#065F46",
};

const pageStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .form-container { animation: fadeInUp 0.60s ease-out 0.10s both; }
  .form-input { transition: all 0.2s ease; }
  .form-input:focus { outline: none; box-shadow: inset 0 0 0 2px ${T.primary}; }
  .form-button { transition: all 0.2s ease; }
  .form-button:hover:not(:disabled) { background: ${T.primaryH}; }
  .form-button:active:not(:disabled) { transform: scale(0.98); }
  .social-button { transition: all 0.2s ease; }
  .social-button:hover { background: ${T.border}; }
  .form-link { transition: color 0.2s ease; }
  .form-link:hover { color: ${T.primary}; }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [usePassword, setUsePassword] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Magic link sent to:", email);
      // Handle magic link here
    } catch (err) {
      setError("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Login attempt:", { email, password });
      // Handle actual login here
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider: "google" | "apple") => {
    console.log(`Sign in with ${provider}`);
    // Handle OAuth redirect
  };

  return (
    <>
      <style>{pageStyles}</style>
      <Navigation />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: T.canvas,
          padding: "32px 16px",
          minHeight: "100dvh",
        }}
      >
        <div
          className="form-container"
          style={{
            width: "100%",
            maxWidth: 400,
            background: T.soft,
            borderRadius: 16,
            padding: "32px 24px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: T.ink,
                margin: "0 0 8px 0",
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: T.body, margin: 0, fontFamily: "var(--font-outfit), sans-serif" }}>
              Sign in to your ApartmentMaid account
            </p>
          </div>

          {/* Social Sign-In Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            <button
              onClick={() => handleSocialSignIn("google")}
              className="social-button"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "11px 16px",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                background: T.canvas,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-outfit), sans-serif",
                color: T.ink,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <text x="4" y="18" fontSize="16" fontWeight="bold" fill="#1F2937">
                  G
                </text>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialSignIn("apple")}
              className="social-button"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "11px 16px",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                background: T.canvas,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-outfit), sans-serif",
                color: T.ink,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 13.5c-.91 0-1.82.55-2.25 1.51.93.64 1.55 1.68 1.55 2.84 0 .3-.03.58-.08.86 1.27 0 2.45-.59 3.19-1.52-.78 1.26-2.14 2.12-3.71 2.12-1.58 0-3-.64-4.01-1.67-.99 1.04-2.41 1.67-4.01 1.67-3.13 0-5.67-2.54-5.67-5.67s2.54-5.67 5.67-5.67c1.58 0 3 .64 4.01 1.67.99-1.04 2.41-1.67 4.01-1.67 1.58 0 3 .64 4.01 1.67.99-1.04 2.41-1.67 4.01-1.67 3.13 0 5.67 2.54 5.67 5.67s-2.54 5.67-5.67 5.67z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "24px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 12, color: T.body, fontFamily: "var(--font-outfit), sans-serif" }}>
              or
            </span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          {/* Form */}
          <form
            onSubmit={usePassword ? handlePasswordSubmit : handleMagicLink}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Email Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="email"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: T.ink,
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  fontSize: 16,
                  padding: "12px 14px",
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  background: T.canvas,
                  color: T.ink,
                  fontFamily: "var(--font-outfit), sans-serif",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password Input (Conditional) */}
            {usePassword && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  htmlFor="password"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: T.ink,
                    fontFamily: "var(--font-outfit), sans-serif",
                  }}
                >
                  Password
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Insert password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      fontSize: 16,
                      padding: "12px 14px 12px 14px",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      background: T.canvas,
                      color: T.ink,
                      fontFamily: "var(--font-outfit), sans-serif",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.body,
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = T.primary)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = T.body)
                    }
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: "10px 12px",
                  background: "#FEE2E2",
                  border: `1px solid #FECACA`,
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#991B1B",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="form-button"
              disabled={isLoading || !email || (usePassword && !password)}
              style={{
                background: T.primary,
                color: T.onPrimary,
                fontSize: 15,
                fontWeight: 600,
                padding: "12px 20px",
                borderRadius: 999,
                border: "none",
                cursor:
                  isLoading || !email || (usePassword && !password)
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  isLoading || !email || (usePassword && !password) ? 0.6 : 1,
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {isLoading
                ? usePassword
                  ? "Signing in..."
                  : "Sending magic link..."
                : usePassword
                  ? "Sign in"
                  : "Send magic link"}
            </button>

            {/* Toggle to Password */}
            {!usePassword && (
              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    setUsePassword(true);
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: T.body,
                    fontSize: 13,
                    cursor: "pointer",
                    textDecoration: "none",
                    fontFamily: "var(--font-outfit), sans-serif",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = T.primary)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = T.body)
                  }
                >
                  Or insert password instead
                </button>
              </div>
            )}

            {/* Forgot Password Link (show only in password mode) */}
            {usePassword && (
              <div style={{ textAlign: "center" }}>
                <Link
                  href="/forgot-password"
                  className="form-link"
                  style={{
                    fontSize: 13,
                    color: T.body,
                    textDecoration: "none",
                    fontFamily: "var(--font-outfit), sans-serif",
                  }}
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            {/* Back to Magic Link (show only in password mode) */}
            {usePassword && (
              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    setUsePassword(false);
                    setPassword("");
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: T.body,
                    fontSize: 13,
                    cursor: "pointer",
                    textDecoration: "none",
                    fontFamily: "var(--font-outfit), sans-serif",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = T.primary)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = T.body)
                  }
                >
                  Use magic link instead
                </button>
              </div>
            )}
          </form>

          {/* Sign Up Link */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <span style={{ fontSize: 14, color: T.body, fontFamily: "var(--font-outfit), sans-serif" }}>
              Don't have an account?{" "}
              <Link
                href="/signup"
                style={{
                  color: T.primary,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
