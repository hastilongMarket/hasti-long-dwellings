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

/* ---------- Custom CSS (Blobs + Rings + Glow) ---------- */
const customStyles = `
@keyframes blob {
  0% { transform: translate(0px,0px) scale(1); }
  33% { transform: translate(30px,-50px) scale(1.12); }
  66% { transform: translate(-20px,20px) scale(0.92); }
  100% { transform: translate(0px,0px) scale(1); }
}
.animate-blob { animation: blob 8s infinite cubic-bezier(0.65,-0.55,0.25,1.5); }

.shadow-3xl { 
  box-shadow: 
    0 30px 60px -15px rgba(0,0,0,0.25),
    0 0 40px -10px rgba(90,80,255,0.18);
}

/* Shiny border animation */
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
    rgba(255,255,255,0.3) 50%,
    rgba(255,255,255,0) 80%
  );
  z-index: 10;
  pointer-events: none;
  animation: sheen 3.5s infinite;
}
`;

/* ---------- UI COMPONENTS (Upgraded) ---------- */

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
      ? "bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm"
      : variant === "success"
      ? "bg-gradient-to-br from-green-500 to-green-700 text-white shadow-md hover:from-green-600 hover:to-green-800"
      : variant === "ghost"
      ? "bg-transparent text-gray-700 hover:bg-gray-100"
      : "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md hover:from-indigo-600 hover:to-indigo-800";

  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 relative overflow-hidden ${sizeClasses} ${variantClasses} ${className}`}
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
  <div className="flex flex-col space-y-2 w-full">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      {...props}
      className="h-12 w-full rounded-xl border-2 border-gray-200 px-4 text-base bg-white shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-400"
    />
  </div>
);

/* ---------- Animations ---------- */
const screenVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

/* ---------- SCREENS (Styled Upgraded Versions) ---------- */

const ChoiceScreen = ({ onChooseGoogle, onChooseMobile, disabled }) => (
  <motion.div
    key="choice"
    variants={screenVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.35 }}
    className="flex flex-col space-y-6 absolute w-full"
  >
    <div className="text-center">
      <h1 className="text-4xl font-extrabold text-gray-900">Welcome</h1>
      <p className="text-gray-500 mt-2 text-base">
        Sign in securely without passwords.
      </p>
    </div>

    <div className="space-y-4 pt-4">
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={onChooseGoogle}
        disabled={disabled}
      >
        <Chrome className="mr-3 h-5 w-5 text-red-500" />
        Continue with Google
      </Button>

      <div className="flex items-center py-2">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onChooseMobile}
        disabled={disabled}
      >
        <Smartphone className="mr-3 h-5 w-5" />
        Continue with Mobile
      </Button>
    </div>
  </motion.div>
);

/* ------------ MOBILE SCREEN (Upgraded) ------------ */

const MobileInputScreen = ({
  mobile,
  setMobile,
  onBack,
  onSubmit,
  submitting
}) => {
  const handle = (e) => {
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
      transition={{ duration: 0.35 }}
      className="flex flex-col space-y-6 absolute w-full"
    >
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-full hover:bg-gray-100" onClick={onBack}>
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-900">Enter Mobile</h2>
      </div>

      <p className="text-gray-500 text-center text-base">
        We will send your WhatsApp verification code.
      </p>

      <form onSubmit={handle} className="space-y-6">
        <div className="flex gap-3">
          <div className="h-12 w-20 flex items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-50 font-semibold text-gray-700 shadow-sm text-lg">
            +91
          </div>

          <Input
            type="tel"
            placeholder="9876543210"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            maxLength={10}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={mobile.length !== 10 || submitting}
        >
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

/* ------------ OTP SCREEN (Upgraded) ------------ */

const OtpScreen = ({
  mobile,
  otp,
  onBack,
  onOpenWhatsapp,
  onResend,
  submitting
}) => {
  const display = otp ?? "••••••";
  const waLink = `https://wa.me/91${mobile}?text=${encodeURIComponent(
    `VERIFY ${display}`
  )}`;

  return (
    <motion.div
      key="otp"
      variants={screenVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35 }}
      className="flex flex-col space-y-6 absolute w-full text-center"
    >
      <div className="flex items-center space-x-3 self-start">
        <button className="p-2 rounded-full hover:bg-gray-100" onClick={onBack}>
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-900">Verify OTP</h2>
      </div>

      <p className="text-gray-600">
        OTP generated for <strong className="text-indigo-600">+91 {mobile}</strong>
      </p>

      <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-inner select-all">
        <div className="text-sm font-medium text-indigo-700 mb-2">
          One-Time Code
        </div>
        <div className="text-5xl font-extrabold tracking-widest text-indigo-900 font-mono">
          {display}
        </div>
      </div>

      <div className="flex items-center justify-center bg-yellow-50 text-yellow-800 p-3 rounded-xl border border-yellow-200">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        <div className="text-sm">Waiting for verification…</div>
      </div>

      <Button
        variant="success"
        size="lg"
        className="w-full"
        onClick={() => window.open(waLink, "_blank")}
      >
        <Check className="mr-3 h-5 w-5" />
        Send OTP on WhatsApp
      </Button>

      <div className="text-sm text-gray-500">
        Didn’t receive it?{" "}
        <button
          onClick={onResend}
          disabled={submitting}
          className="text-indigo-700 font-medium hover:underline"
        >
          Resend
        </button>
      </div>
    </motion.div>
  );
};

/* ---------- MAIN LOGIN ---------- */

export default function Login() {
  const [screen, setScreen] = useState("choice");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
          photo: user.photoURL
        })
      );

      window.location.href = "/";
    } catch (e) {
      toast.error("Google login failed");
    }
  };

  const requestOtp = useCallback(async () => {
    if (mobile.length !== 10) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setOtp(String(Math.floor(100000 + Math.random() * 900000)));
    setSubmitting(false);
    setScreen("otp");
  }, [mobile]);

  const resendOtp = useCallback(async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setOtp(String(Math.floor(100000 + Math.random() * 900000)));
    setSubmitting(false);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-100 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Background blobs */}
      <motion.div className="absolute w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob" style={{ top: "6%", left: "8%" }} />
      <motion.div className="absolute w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob" style={{ bottom: "7%", right: "5%" }} />

      {/* Glow rings */}
      <div className="absolute inset-0">
        <div className="absolute w-52 h-52 rounded-full bg-gradient-to-br from-indigo-300/40 to-purple-300/40 blur-3xl top-10 left-10" />
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-purple-400/40 to-pink-300/40 blur-3xl bottom-10 right-10" />
      </div>

      {/* MAIN CARD */}
      <motion.div
        className="w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-3xl border border-white/40 relative shiny-border"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55 }}
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
                  const link = `https://wa.me/91${mobile}?text=VERIFY ${otp}`;
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
