"use client"

import { useState } from "react"
import { Input } from "../components/ui/input"
import { Mail, ArrowLeft, Lock, Shield } from "lucide-react"
import { authAPI } from "../services/api"

export default function ForgotPassword({ onBack }) {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSendCode = async (e) => {
        e.preventDefault()
        console.log('Send code function called with email:', email);
        if (!email) {
            console.log('No email provided, returning');
            return;
        }

        setIsLoading(true)
        setError("")

        try {
            console.log('Calling API with email:', email);
            const response = await authAPI.forgotPassword(email)
            console.log('API response:', response);
            setTimeout(() => {
                setIsLoading(false)
                setSuccess(response.message || `Verification code sent to ${email}`)
                setStep(2)
            }, 2000)
        } catch (error) {
            console.error('Error in handleSendCode:', error);
            setIsLoading(false)
            setError(error.response?.data?.message || "Failed to send verification code")
        }
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault()
        if (!code) return

        setIsLoading(true)
        setError("")

        try {
            const response = await authAPI.verifyResetCode(email, code)

            setIsLoading(false)
            setSuccess(response.message || "Code verified successfully!")
            setStep(3)
        } catch (error) {
            setIsLoading(false)
            setError(error.response?.data?.message || "Invalid verification code")
        }
    }

    const handleResendCode = async () => {
        console.log('Resend code function called!');

        if (isLoading) return;

        setIsLoading(true);
        setError("");
        setCode("");

        try {
            console.log('Resending code to email:', email);
            const response = await authAPI.forgotPassword(email);

            console.log('Resend API response:', response);
            setTimeout(() => {
                setIsLoading(false);
                setSuccess(response.message || `Verification code resent to ${email}`);
            }, 2000);
        } catch (error) {
            console.error('Error in resend code:', error);
            setIsLoading(false);
            setError(error.response?.data?.message || "Failed to resend verification code");
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (!newPassword || !confirmPassword) return

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            const response = await authAPI.resetPassword(email, code, newPassword)

            setIsLoading(false)
            setSuccess(response.message || "Password reset successfully!")
            setTimeout(() => {
                onBack()
            }, 2000)
        } catch (error) {
            setIsLoading(false)
            setError(error.response?.data?.message || "Failed to reset password")
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Stars */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-12 left-8 w-1 h-1 bg-white rounded-full opacity-80"></div>
                    <div className="absolute top-20 left-16 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                    <div className="absolute top-32 right-20 w-1 h-1 bg-white rounded-full opacity-80"></div>
                    <div className="absolute top-40 right-8 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                    <div className="absolute bottom-32 left-12 w-1 h-1 bg-white rounded-full opacity-80"></div>
                    <div className="absolute bottom-20 right-16 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                </div>

                {/* Loading Tree Animation */}
                <div className="text-center text-white">
                    <div className="relative mx-auto mb-8" style={{ width: "200px", height: "250px" }}>
                        {/* Tree Trunk */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-20 bg-amber-800 rounded-b-lg"></div>

                        {/* Tree Crown Base */}
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-emerald-600 rounded-full opacity-90"></div>

                        {/* Animated Leaves */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-3 h-3 bg-emerald-400 rounded-full animate-leaf-cycle"
                                style={{
                                    left: `${45 + Math.cos((i * 30 * Math.PI) / 180) * 35}px`,
                                    top: `${85 + Math.sin((i * 30 * Math.PI) / 180) * 35}px`,
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: "4s",
                                    animationIterationCount: "infinite",
                                }}
                            ></div>
                        ))}

                        {/* Extra scattered leaves for fuller look */}
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={`extra-${i}`}
                                className="absolute w-2 h-2 bg-emerald-300 rounded-full animate-leaf-cycle"
                                style={{
                                    left: `${50 + Math.cos(((i * 45 + 22.5) * Math.PI) / 180) * 25}px`,
                                    top: `${90 + Math.sin(((i * 45 + 22.5) * Math.PI) / 180) * 25}px`,
                                    animationDelay: `${i * 0.15 + 0.5}s`,
                                    animationDuration: "4s",
                                    animationIterationCount: "infinite",
                                }}
                            ></div>
                        ))}
                    </div>

                    <h2 className="text-xl font-light mb-2">Sending verification code...</h2>
                    <p className="text-sm opacity-80">Please wait while we process your request</p>
                </div>

                {/* Custom CSS for leaf animation */}
                <style jsx>{`
          @keyframes leaf-cycle {
            0% {
              opacity: 1;
              transform: translateY(0px) rotate(0deg) scale(1);
            }
            25% {
              opacity: 0.7;
              transform: translateY(10px) rotate(45deg) scale(0.9);
            }
            50% {
              opacity: 0;
              transform: translateY(50px) rotate(180deg) scale(0.3);
            }
            75% {
              opacity: 0.3;
              transform: translateY(20px) rotate(270deg) scale(0.6);
            }
            100% {
              opacity: 1;
              transform: translateY(0px) rotate(360deg) scale(1);
            }
          }
          
          .animate-leaf-cycle {
            animation-name: leaf-cycle;
            animation-timing-function: ease-in-out;
          }
        `}</style>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Stars */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-12 left-8 w-1 h-1 bg-white rounded-full opacity-80"></div>
                <div className="absolute top-20 left-16 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-32 right-20 w-1 h-1 bg-white rounded-full opacity-80"></div>
                <div className="absolute top-40 right-8 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute bottom-32 left-12 w-1 h-1 bg-white rounded-full opacity-80"></div>
                <div className="absolute bottom-20 right-16 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-1/3 right-4 w-1 h-1 bg-white rounded-full opacity-80"></div>
                <div className="absolute bottom-1/3 left-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-1/4 right-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header Section with Landscape */}
                <div className="bg-gradient-to-b from-teal-600 to-teal-700 px-8 py-12 text-center text-white relative overflow-hidden">
                    {/* Stars in header */}
                    <div className="absolute top-4 left-6 w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full opacity-60"></div>
                    <div className="absolute top-16 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>

                    <h1 className="text-2xl font-light mb-3">
                        {step === 1 && "Reset Password"}
                        {step === 2 && "Verify Email"}
                        {step === 3 && "New Password"}
                    </h1>
                    <p className="text-sm opacity-90 mb-8 leading-relaxed">
                        {step === 1 && "Enter your email address and we'll send you a verification code to reset your password"}
                        {step === 2 && "Enter the verification code we sent to your email"}
                        {step === 3 && "Create a new password for your account"}
                    </p>

                    {/* Landscape Illustration */}
                    <div className="relative h-32 -mx-8 -mb-12">
                        {/* Sun/Moon */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-80"></div>

                        {/* Mountain Layers */}
                        <div className="absolute bottom-0 left-0 right-0">
                            {/* Back mountains */}
                            <div className="absolute bottom-0 left-0 right-0 h-16">
                                <div
                                    className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-emerald-400 to-emerald-300 opacity-60"
                                    style={{
                                        clipPath: "polygon(0% 100%, 20% 60%, 40% 80%, 60% 40%, 80% 70%, 100% 50%, 100% 100%)",
                                    }}
                                ></div>
                            </div>

                            {/* Middle mountains */}
                            <div className="absolute bottom-0 left-0 right-0 h-20">
                                <div
                                    className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-emerald-500 to-emerald-400 opacity-80"
                                    style={{
                                        clipPath: "polygon(0% 100%, 15% 70%, 35% 50%, 55% 80%, 75% 45%, 90% 65%, 100% 55%, 100% 100%)",
                                    }}
                                ></div>
                            </div>

                            {/* Front mountains */}
                            <div className="absolute bottom-0 left-0 right-0 h-24">
                                <div
                                    className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-emerald-600 to-emerald-500"
                                    style={{
                                        clipPath: "polygon(0% 100%, 25% 50%, 45% 70%, 65% 30%, 85% 60%, 100% 40%, 100% 100%)",
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Trees */}
                        <div className="absolute bottom-2 left-8">
                            <div className="w-1 h-6 bg-emerald-800 relative">
                                <div
                                    className="absolute -top-4 -left-2 w-5 h-8 bg-emerald-700"
                                    style={{
                                        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="absolute bottom-4 left-16">
                            <div className="w-1 h-4 bg-emerald-800 relative">
                                <div
                                    className="absolute -top-3 -left-1.5 w-4 h-6 bg-emerald-700"
                                    style={{
                                        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="absolute bottom-1 right-12">
                            <div className="w-1 h-8 bg-emerald-800 relative">
                                <div
                                    className="absolute -top-5 -left-2.5 w-6 h-10 bg-emerald-700"
                                    style={{
                                        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-6">
                            <div className="w-1 h-5 bg-emerald-800 relative">
                                <div
                                    className="absolute -top-3 -left-2 w-5 h-7 bg-emerald-700"
                                    style={{
                                        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Forgot Password Form Section */}
                <div className="px-8 py-8">
                    {step === 1 && (
                        <>
                            <h2 className="text-center text-gray-600 text-lg font-medium mb-6">FORGOT PASSWORD</h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSendCode} className="space-y-6">
                                {/* Email Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-12 pr-4 py-3 bg-teal-600 border-0 rounded-full text-white placeholder-teal-200 focus:ring-2 focus:ring-teal-400 focus:bg-teal-500 w-full"
                                    />
                                </div>

                                {/* Send Code Button */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            console.log('Send code button clicked!');
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSendCode(e);
                                        }}
                                        onMouseDown={(e) => {
                                            console.log('Send code mouse down!');
                                        }}
                                        disabled={false}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors cursor-pointer border-2 border-white-500"
                                        style={{
                                            pointerEvents: 'auto',
                                            zIndex: 50,
                                            position: 'relative'
                                        }}
                                    >
                                        {isLoading ? "Sending..." : "Send Code"}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-center text-gray-600 text-lg font-medium mb-4">ENTER VERIFICATION CODE</h2>
                            <p className="text-center text-gray-500 text-sm mb-6">
                                We sent a verification code to {email}
                            </p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleVerifyCode} className="space-y-6">
                                {/* Code Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter verification code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        className="pl-12 pr-4 py-3 bg-teal-600 border-0 rounded-full text-white placeholder-teal-200 focus:ring-2 focus:ring-teal-400 focus:bg-teal-500 w-full"
                                    />
                                </div>

                                {/* Verify Code Button */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            console.log('Verify code button clicked!');
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleVerifyCode(e);
                                        }}
                                        onMouseDown={(e) => {
                                            console.log('Verify code mouse down!');
                                        }}
                                        disabled={isLoading}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer border-2 border-transparent"
                                        style={{
                                            pointerEvents: isLoading ? 'none' : 'auto',
                                            zIndex: 50,
                                            position: 'relative'
                                        }}
                                    >
                                        {isLoading ? "Verifying..." : "Verify Code"}
                                    </button>
                                </div>
                            </form>

                            {/* Resend Code */}
                            <div className="text-center mt-4">
                                <span
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Resend code clicked!');
                                        if (!isLoading) {
                                            handleResendCode();
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Resend code mouse down!');
                                    }}
                                    className={`text-gray-500 hover:text-gray-700 transition-colors cursor-pointer text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{
                                        pointerEvents: 'auto',
                                        zIndex: 30,
                                        position: 'relative',
                                        userSelect: 'none'
                                    }}
                                >
                                    {isLoading ? "Resending..." : "Didn't receive the code? Resend"}
                                </span>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="text-center text-gray-600 text-lg font-medium mb-6">RESET PASSWORD</h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleResetPassword} className="space-y-6">
                                {/* New Password Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="pl-12 pr-4 py-3 bg-teal-600 border-0 rounded-full text-white placeholder-teal-200 focus:ring-2 focus:ring-teal-400 focus:bg-teal-500"
                                    />
                                </div>

                                {/* Confirm Password Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pl-12 pr-4 py-3 bg-teal-600 border-0 rounded-full text-white placeholder-teal-200 focus:ring-2 focus:ring-teal-400 focus:bg-teal-500"
                                    />
                                </div>

                                {/* Reset Password Button */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            console.log('Reset password button clicked!');
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleResetPassword(e);
                                        }}
                                        onMouseDown={(e) => {
                                            console.log('Reset password mouse down!');
                                        }}
                                        disabled={isLoading}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer border-2 border-transparent"
                                        style={{
                                            pointerEvents: isLoading ? 'none' : 'auto',
                                            zIndex: 50,
                                            position: 'relative'
                                        }}
                                    >
                                        {isLoading ? "Resetting..." : "Reset Password"}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* Back to Login */}
                    <div className="text-center mt-6">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Back to login clicked!');
                                if (!isLoading) {
                                    onBack();
                                }
                            }}
                            disabled={isLoading}
                            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 cursor-pointer"
                            style={{
                                pointerEvents: isLoading ? 'none' : 'auto',
                                zIndex: 20,
                                position: 'relative'
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Login</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-80">
                🤍
            </div>
        </div>
    )
}
