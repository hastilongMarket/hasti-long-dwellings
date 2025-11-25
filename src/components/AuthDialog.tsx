import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button as UiButton } from "@/components/ui/button";
import { Input as UiInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithGoogle } from "@/firebase";
import { toast } from "sonner";

import {
  Smartphone,
  MessageCircle,
  ArrowLeft,
  Loader2,
  Check,
  Chrome
} from "lucide-react";

/* ---------- Minimal CSS (for shiny-border & micro animations used in popup) ---------- */
const customStyles = `
@keyframes sheen {
  0% { transform: translateX(-100%) rotate(10deg); }
  100% { transform: translateX(200%) rotate(10deg); }
}
.shiny-border::after {
  content: "";
  position: absolute;
  inset: -1px;
  background: linear-gradient(
    110deg,
    rgba(255,255,255,0) 20%,
    rgba(255,255,255,0.28) 50%,
    rgba(255,255,255,0) 80%
  );
  z-index: 10;
  pointer-events: none;
  animation: sheen 3.5s infinite;
}
`;

/* ---------- Small Fancy UI pieces (kept local to popup so we don't break global ui) ---------- */
const FancyButton = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "success" | "ghost";
  size?: "default" | "lg";
}) => {
  const sizeClasses = size === "lg" ? "h-12 px-4 text-base" : "h-10 px-3 text-sm";

  const variantClasses =
    variant === "outline"
      ? "bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm"
      : variant === "success"
      ? "bg-gradient-to-br from-green-500 to-green-700 text-white shadow-sm hover:from-green-600 hover:to-green-800"
      : variant === "ghost"
      ? "bg-transparent text-gray-700 hover:bg-gray-100"
      : "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm hover:from-indigo-600 hover:to-indigo-800";

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 relative overflow-hidden ${sizeClasses} ${variantClasses} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

const FancyInput = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="flex flex-col space-y-2 w-full">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      {...props}
      className="h-10 w-full rounded-xl border-2 border-gray-200 px-3 text-sm bg-white shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-400"
    />
  </div>
);

/* ---------- Animations ---------- */
const screenVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/* ---------- AuthDialog (merged) ---------- */

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  // auth mode toggles
  const [isLogin, setIsLogin] = useState(true);

  // internal screen: choice | mobile | otp
  const [screen, setScreen] = useState<"choice" | "mobile" | "otp">("choice");

  // form state
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Google sign-in
  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      const user = await signInWithGoogle();
      toast(`Welcome ${user.displayName}`);
      // persist minimal user info (same as login.tsx)
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photo: user.photoURL,
        })
      );
      onOpenChange(false);
      // optionally navigate if you want — keep minimal here
    } catch (err) {
      console.error("Google login failed:", err);
      toast.error("Google login failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Request OTP (mock)
  const requestOtp = useCallback(async () => {
    // if registering, require name + mobile; if login, mobile required
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!isLogin && !name.trim()) {
      toast.error("Please enter your name to register");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generated);
    setSubmitting(false);
    setScreen("otp");
    console.log(`Mock OTP generated: ${generated}`);
  }, [mobile, name, isLogin]);

  // Resend OTP
  const resendOtp = useCallback(async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generated);
    setSubmitting(false);
    toast("OTP resent");
    console.log(`Mock OTP resent: ${generated}`);
  }, []);

  // Finalize login/register after verification (we keep it simple: store and close)
  const finalizeAuth = (via: "google" | "mobile") => {
    // store name if present, and mobile and mark logged in
    const user = {
      name: name || "User",
      mobile: mobile || null,
    };
    localStorage.setItem("user", JSON.stringify(user));
    toast.success(via === "google" ? "Logged in with Google" : "Logged in successfully");
    onOpenChange(false);
  };

  // Handle back from mobile/otp to choice
  const handleBackToChoice = () => {
    setScreen("choice");
    setOtp(null);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md relative">
        {/* inject local styles */}
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />

        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isLogin ? "Login" : "Register"}</span>
            {/* small toggle link to switch modes */}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                // if switching between login/register, reset to choice screen
                setScreen("choice");
                setOtp(null);
              }}
              className="text-sm text-indigo-600 hover:underline"
              type="button"
            >
              {isLogin ? "Need an account? Register" : "Already have an account? Login"}
            </button>
          </DialogTitle>
          <DialogDescription>
            {screen === "choice" && (isLogin ? "Sign in securely without passwords." : "Create your account")}
            {screen === "mobile" && (isLogin ? "Enter your mobile and get an OTP" : "Create your account and verify via OTP")}
            {screen === "otp" && "Enter or send the OTP via WhatsApp to verify"}
          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-[260px]">
          <AnimatePresence mode="wait">
            {screen === "choice" && (
              <motion.div
                key="choice"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col space-y-4"
              >
                {/* Google */}
                <FancyButton
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogle}
                  disabled={submitting}
                >
                  <Chrome className="h-4 w-4 text-red-500" />
                  Continue with Google
                </FancyButton>

                <div className="flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="mx-3 text-sm text-gray-500">OR</span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>

                <UiButton
                  className="w-full"
                  onClick={() => {
                    setScreen("mobile");
                    // keep isLogin as is
                  }}
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Continue with Mobile
                </UiButton>
              </motion.div>
            )}

            {screen === "mobile" && (
              <motion.form
                key="mobile"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  requestOtp();
                }}
                className="flex flex-col space-y-4"
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setScreen("choice")}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-4 w-4 text-gray-700" />
                  </button>
                  <h3 className="text-lg font-medium ml-3">{isLogin ? "Enter Mobile Number" : "Register - Enter Details"}</h3>
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <UiInput
                      id="name"
                      value={name}
                      onChange={(e) => setName((e.target as HTMLInputElement).value)}
                      placeholder="Your full name"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 flex items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-50 font-semibold text-sm">+91</div>
                    <UiInput
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile((e.target as HTMLInputElement).value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <UiButton type="submit" className="w-full" disabled={mobile.length !== 10 || ( !isLogin && !name.trim()) || submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageCircle className="h-4 w-4 mr-2" />}
                    Get WhatsApp OTP
                  </UiButton>

                  <UiButton
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      // toggle login/register quickly
                      setIsLogin(!isLogin);
                      setScreen("choice");
                    }}
                  >
                    {isLogin ? "Need an account? Register" : "Already have an account? Login"}
                  </UiButton>
                </div>
              </motion.form>
            )}

            {screen === "otp" && (
              <motion.div
                key="otp"
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col space-y-4"
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setScreen("mobile")}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-4 w-4 text-gray-700" />
                  </button>
                  <h3 className="text-lg font-medium ml-3">Verify Mobile</h3>
                </div>

                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                  <div className="text-sm text-indigo-700 font-medium">Your One-Time Code</div>
                  <div className="text-2xl font-extrabold tracking-widest text-indigo-900 mt-2 select-all font-mono">{otp ?? "••••••"}</div>
                </div>

                <div className="flex items-center justify-center bg-yellow-50 text-yellow-800 p-3 rounded-md border border-yellow-200">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <div className="text-sm">Waiting for verification…</div>
                </div>

                <UiButton
                  className="w-full"
                  onClick={() => {
                    // Open whatsapp link prefilled with verification message
                    const link = `https://wa.me/91${mobile}?text=${encodeURIComponent(`VERIFY ${otp ?? "••••••"}`)}`;
                    window.open(link, "_blank");
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Send OTP on WhatsApp
                </UiButton>

                <div className="flex items-center justify-between">
                  <button
                    onClick={resendOtp}
                    disabled={submitting}
                    className="text-sm text-indigo-700 font-medium hover:underline disabled:opacity-60"
                    type="button"
                  >
                    Resend
                  </button>

                  <button
                    onClick={() => {
                      // For this mock: finalize and close
                      finalizeAuth("mobile");
                    }}
                    className="text-sm text-gray-600 hover:underline"
                    type="button"
                  >
                    Done (mock)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
