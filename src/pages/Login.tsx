import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithGoogle } from "@/firebase";
import { Button as UIButton } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Mail,
  Smartphone,
  MessageCircle,
  ArrowLeft,
  Loader2,
  Check,
  Chrome
} from "lucide-react";

/* ---------- Custom CSS ---------- */
const customStyles = `
@keyframes blob {
  0% { transform: translate(0px,0px) scale(1); }
  33% { transform: translate(30px,-50px) scale(1.1); }
  66% { transform: translate(-20px,20px) scale(0.9); }
  100% { transform: translate(0px,0px) scale(1); }
}
.animate-blob { animation: blob 7s infinite cubic-bezier(0.68,-0.55,0.27,1.55); }
.shadow-3xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15), 0 0 30px -5px rgba(0,0,0,0.08); }
`;

/* ---------- Reusable Components ---------- */

const Button = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "success" | "ghost";
  size?: "default" | "lg";
}) => {
  const sizeClasses = size === "lg" ? "h-14 px-7 text-lg" : "h-11 px-5 text-base";
  const variantClasses =
    variant === "outline"
      ? "bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50"
      : variant === "success"
      ? "bg-gradient-to-br from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800"
      : variant === "ghost"
      ? "bg-transparent text-gray-700 hover:bg-gray-100"
      : "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white hover:from-indigo-600 hover:to-indigo-800";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

const Input = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="flex flex-col space-y-2">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      {...props}
      className="h-12 w-full rounded-xl border-2 border-gray-200 px-4 text-base bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-shadow shadow-sm"
    />
  </div>
);

/* ---------- Animations ---------- */
const screenVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

/* ---------- Screens ---------- */

const ChoiceScreen = ({
  onChooseGoogle,
  onChooseMobile,
  disabled,
}: {
  onChooseGoogle: () => void;
  onChooseMobile: () => void;
  disabled: boolean;
}) => (
  <motion.div
    key="choice"
    variants={screenVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.38 }}
    className="flex flex-col space-y-6 absolute w-full"
  >
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 text-center">Join HastiLong</h1>
      <p className="text-gray-500 text-center mt-2">Choose a secure, passwordless way to sign in.</p>
    </div>

    <div className="space-y-4 pt-4">
      {/* Fixed: Google Sign-in Working Here */}
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={onChooseGoogle}
        disabled={disabled}
        aria-label="Continue with Google"
      >
        <Chrome className="mr-3 h-5 w-5 text-red-500" />
        Continue with Google
      </Button>

      <div className="flex items-center py-2">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      <Button variant="primary" size="lg" className="w-full" onClick={onChooseMobile} disabled={disabled}>
        <Smartphone className="mr-3 h-5 w-5" />
        Continue with Mobile
      </Button>
    </div>
  </motion.div>
);

/* ------------ Mobile Input Screen ------------ */

const MobileInputScreen = ({
  mobile,
  setMobile,
  onBack,
  onSubmit,
  submitting,
}: {
  mobile: string;
  setMobile: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) => {
  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) onSubmit();
  };

  return (
    <motion.div
      key="mobile"
      variants={screenVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.38 }}
      className="flex flex-col space-y-6 absolute w-full"
    >
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-semibold">Enter Mobile Number</h2>
      </div>

      <p className="text-gray-500 text-center">We'll send a one-time code to your WhatsApp.</p>

      <form onSubmit={handle} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-20 flex items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-50 font-semibold">+91</div>
          <Input
            aria-label="Mobile number"
            type="tel"
            placeholder="9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            maxLength={10}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={mobile.length !== 10 || submitting}>
          {submitting ? (
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
          ) : (
            <MessageCircle className="mr-3 h-5 w-5" />
          )}
          Get WhatsApp OTP
        </Button>
      </form>
    </motion.div>
  );
};

/* ------------ OTP Screen ------------ */

const OtpScreen = ({
  mobile,
  otp,
  onBack,
  onOpenWhatsapp,
  onResend,
  submitting,
}: {
  mobile: string;
  otp: string | null;
  onBack: () => void;
  onOpenWhatsapp: () => void;
  onResend: () => void;
  submitting: boolean;
}) => {
  const display = otp ?? "••••••";
  const waLink = `https://wa.me/91${mobile}?text=${encodeURIComponent(`VERIFY ${display}`)}`;

  return (
    <motion.div
      key="otp"
      variants={screenVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.38 }}
      className="flex flex-col space-y-6 absolute w-full text-center"
    >
      <div className="flex items-center space-x-3 self-start">
        <button onClick={onBack} className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-semibold">Verify Mobile</h2>
      </div>

      <p className="text-gray-500">An OTP has been generated for <strong className="text-indigo-600">+91 {mobile}</strong></p>

      <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-200 shadow-inner select-all">
        <div className="text-sm font-medium text-indigo-700 mb-2">Your One-Time Code</div>
        <div className="text-5xl font-extrabold tracking-widest text-indigo-800 font-mono">{display}</div>
      </div>

      <div className="flex items-center justify-center bg-yellow-50 text-yellow-800 p-3 rounded-xl border border-yellow-200">
        <Loader2 className="mr-3 h-5 w-5 animate-spin text-yellow-700" />
        <div className="text-sm">Waiting for verification…</div>
      </div>

      <Button variant="success" size="lg" className="w-full" onClick={() => window.open(waLink, "_blank")} disabled={submitting}>
        <Check className="mr-3 h-5 w-5" />
        Send OTP on WhatsApp
      </Button>

      <div className="text-sm text-gray-500">
        Didn’t receive it?{" "}
        <button onClick={onResend} disabled={submitting} className="text-indigo-700 font-medium hover:underline">
          Resend
        </button>
      </div>
    </motion.div>
  );
};

/* ---------- Main Login Component ---------- */

export default function Login() {
  const [screen, setScreen] = useState<"choice" | "mobile" | "otp">("choice");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* --- Google Login Actual Function --- */
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();

      toast(`Welcome ${user.displayName}`);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photo: user.photoURL,
        })
      );

      window.location.href = "/";
    } catch (e) {
      toast.error("Google login failed");
    }
  };

  /* Placeholder: simulate server OTP generation */
  const requestOtp = useCallback(async () => {
    if (mobile.length !== 10) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generated);
    setSubmitting(false);
    setScreen("otp");
  }, [mobile]);

  const resendOtp = useCallback(async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generated);
    setSubmitting(false);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-100 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* background blobs */}
      <motion.div className="absolute w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ top: "8%", left: "6%" }} />
      <motion.div className="absolute w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ bottom: "8%", right: "6%" }} />

      <motion.div
        className="w-full max-w-md p-8 sm:p-10 bg-white rounded-3xl shadow-3xl border border-gray-100 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative min-h-[360px]">
          <AnimatePresence mode="wait">
            {screen === "choice" && (
              <ChoiceScreen
                onChooseGoogle={handleGoogleLogin}
                onChooseMobile={() => setScreen("mobile")}
                disabled={submitting}
              />
            )}

            {screen === "mobile" && (
              <MobileInputScreen
                mobile={mobile}
                setMobile={setMobile}
                onBack={() => setScreen("choice")}
                onSubmit={requestOtp}
                submitting={submitting}
              />
            )}

            {screen === "otp" && (
              <OtpScreen
                mobile={mobile}
                otp={otp}
                onBack={() => setScreen("mobile")}
                onOpenWhatsapp={() => {
                  const link = `https://wa.me/91${mobile}?text=${encodeURIComponent(`VERIFY ${otp}`)}`;
                  window.open(link, "_blank");
                }}
                onResend={resendOtp}
                submitting={submitting}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
