"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut, signUp } from "@/lib/auth-client";
import { Mail, Lock, User, Phone, X, Sparkles, LogOut, LayoutDashboard, UserCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AuthNav({ mobile = false }: { mobile?: boolean }) {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleOpen = (formMode: "signin" | "signup") => {
    setMode(formMode);
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setMode("signin");
    setError(null);
  };

  const handleGoogleSignIn = () => {
    setError(null);
    setLoading(true);
    signIn.social({
      provider: "google",
      callbackURL: "/account",
    }).then((res) => {
      if (res && 'error' in res && res.error) {
        setError(res.error.message || "Failed to sign in with Google.");
        setLoading(false);
      }
    }).catch((err: any) => {
      // Ignore AbortError / Fetch aborted from page navigation
      if (err && (err.name === "AbortError" || err.message === "Fetch aborted" || err.code === 20)) {
        return;
      }
      console.error("Google sign in failed:", err);
      setError(err.message || "Failed to sign in with Google.");
      setLoading(false);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error: signInError } = await signIn.email({
          email,
          password,
          callbackURL: "/account",
        });

        if (signInError) {
          setError(signInError.message || "Failed to sign in. Please check your credentials.");
          setLoading(false);
        }
      } else {
        if (!name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }

        const { error: signUpError } = await signUp.email({
          email,
          password,
          name,
          callbackURL: "/account",
        } as any);

        if (signUpError) {
          setError(signUpError.message || "Registration failed. Try again.");
          setLoading(false);
        }
      }
    } catch (err: any) {
      // Ignore AbortError / Fetch aborted from page navigation
      if (err && (err.name === "AbortError" || err.message === "Fetch aborted" || err.code === 20)) {
        return;
      }
      console.error("Auth action failed:", err);
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      });
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback redirect
      window.location.href = "/";
    }
  };

  if (isPending) {
    return (
      <div className={mobile ? "space-y-2 w-full flex justify-center" : ""}>
        <div className="h-9 w-24 animate-pulse rounded-full bg-surface-secondary dark:bg-brand-900" />
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <>
        <div className={`flex items-center gap-3.5 ${mobile ? "flex-col w-full" : ""}`}>
          <button
            onClick={() => handleOpen("signin")}
            className={`text-sm font-semibold text-brand-300 hover:text-white transition-colors duration-300 cursor-pointer ${mobile ? "w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5" : ""}`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleOpen("signup")}
            className={`rounded-full bg-accent px-4 py-2 text-xs font-bold text-black transition-all duration-300 shadow-md shadow-accent/15 hover:shadow-lg hover:shadow-accent/25 hover:bg-accent-light active:scale-[0.97] cursor-pointer ${mobile ? "w-full text-center" : ""}`}
          >
            Sign Up
          </button>
        </div>

        {/* Modal Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-300">
            <div 
              className="relative w-full max-w-md bg-brand-950 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl shadow-accent/5 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-xl p-1.5 text-brand-400 hover:text-white hover:bg-white/5 transition-colors duration-300 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {mode === "signin" ? "Welcome Back" : "Create Account"}
                </h3>
                <p className="text-xs text-brand-400 mt-1">
                  {mode === "signin" 
                    ? "Sign in to access your bookings and camera rental profile" 
                    : "Register to start renting high-end camera gear in Thrissur"
                  }
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
                        <Input
                          type="text"
                          placeholder="Rajesh Kumar"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 border-white/10 bg-white/5 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">Phone Number (Optional)</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
                        <Input
                          type="tel"
                          placeholder="9999999999"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 border-white/10 bg-white/5 text-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-white/10 bg-white/5 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-white/10 bg-white/5 text-white"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-accent text-black hover:bg-accent-light active:scale-[0.99] font-bold text-sm mt-6 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {mode === "signin" ? "Signing In..." : "Creating Account..."}
                    </span>
                  ) : (
                    mode === "signin" ? "Sign In" : "Register Account"
                  )}
                </Button>
              </form>

              {/* Social Login Separator & Buttons */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-brand-950 px-2.5 text-brand-400 font-bold tracking-wider">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-11 border-white/10 hover:border-white/20 bg-white/5 text-white flex items-center justify-center gap-2.5 hover:bg-white/10 font-semibold text-sm cursor-pointer active:scale-[0.99]"
                disabled={loading}
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Google Account
              </Button>

              {/* Mode Switcher */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => handleOpen(mode === "signin" ? "signup" : "signin")}
                  className="text-xs text-brand-400 hover:text-accent transition-colors duration-300 cursor-pointer"
                >
                  {mode === "signin" 
                    ? "New to CamRents? Create an account" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>

              {/* Quick Demo Fill - Developers */}
              <div className="mt-6 border-t border-white/5 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-accent" /> Quick Demo Fill
                  </p>
                  <span className="text-[9px] bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full">
                    Pass: password123
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <button
                    type="button"
                    onClick={() => handleDemoFill("admin@camrents.in", "password123")}
                    className="flex flex-col items-start rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs transition-colors duration-300 hover:bg-white/10 hover:border-white/10 text-white cursor-pointer"
                  >
                    <span className="font-semibold text-accent">Shop Owner</span>
                    <span className="text-[10px] text-brand-400">admin (Admin)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill("rajesh@example.com", "password123")}
                    className="flex flex-col items-start rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs transition-colors duration-300 hover:bg-white/10 hover:border-white/10 text-white cursor-pointer"
                  >
                    <span className="font-semibold">Rajesh Kumar</span>
                    <span className="text-[10px] text-brand-400">customer 1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill("priya@example.com", "password123")}
                    className="flex flex-col items-start rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs transition-colors duration-300 hover:bg-white/10 hover:border-white/10 text-white cursor-pointer"
                  >
                    <span className="font-semibold">Priya Nair</span>
                    <span className="text-[10px] text-brand-400">customer 2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill("arun@example.com", "password123")}
                    className="flex flex-col items-start rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs transition-colors duration-300 hover:bg-white/10 hover:border-white/10 text-white cursor-pointer"
                  >
                    <span className="font-semibold">Arun S</span>
                    <span className="text-[10px] text-brand-400">customer 3</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Logged in
  return (
    <div className={`flex ${mobile ? "flex-col gap-3 w-full" : "items-center gap-4"}`}>
      <Link
        href="/account"
        className={`text-sm font-medium text-brand-300 hover:text-white transition-colors duration-300 flex items-center gap-1.5 ${
          mobile ? "w-full rounded-xl px-4 py-2.5 bg-white/5 hover:bg-white/10" : ""
        }`}
      >
        <UserCircle className="h-4.5 w-4.5 text-accent" />
        <span>My Account</span>
      </Link>
      
      {(session.user as { role?: string | null } & typeof session.user)?.role === "admin" && (
        <Link
          href="/admin"
          className={`text-sm font-medium text-accent hover:text-accent-light transition-colors duration-300 flex items-center gap-1.5 ${
            mobile ? "w-full rounded-xl px-4 py-2.5 bg-accent/5 hover:bg-accent/10" : ""
          }`}
        >
          <LayoutDashboard className="h-4.5 w-4.5" />
          <span>Admin Panel</span>
        </Link>
      )}
      
      <div className={`flex items-center gap-3 ${mobile ? "justify-between w-full border-t border-white/5 pt-3 mt-1 px-2" : ""}`}>
        <div className="flex items-center gap-2.5">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="h-7 w-7 rounded-full ring-2 ring-accent/30"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-[10px] font-bold text-accent">
              {(session.user?.name || "U").substring(0, 1).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-semibold text-white max-w-[120px] truncate">
            {session.user?.name || session.user?.email}
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          className={`flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-red-400 transition-colors duration-300 cursor-pointer ${
            mobile ? "rounded-xl px-3 py-2 bg-red-500/5 hover:bg-red-500/10" : "px-3 py-1.5 hover:bg-red-500/5 rounded-full"
          }`}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
