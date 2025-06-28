"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { createNewTransaction, lookupAccountName } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, CheckCircle, AlertTriangle, Copy, User, Building2 } from "lucide-react"

export default function TransferPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [recipientAccount, setRecipientAccount] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientBank, setRecipientBank] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [success, setSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [error, setError] = useState("")
  const [accountLookupError, setAccountLookupError] = useState("")

  useEffect(() => {
    if (!user || user.type !== "user") {
      router.push("/login")
    }
  }, [user, router])

  // Auto-lookup account name when account number is provided
  useEffect(() => {
    if (recipientAccount.length >= 8) {
      handleAccountLookup()
    } else {
      setRecipientName("")
      setRecipientBank("")
      setAccountLookupError("")
    }
  }, [recipientAccount])

  const handleAccountLookup = async () => {
    if (!recipientAccount.trim()) return

    setIsLookingUp(true)
    setAccountLookupError("")

    // Simulate lookup delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const accountInfo = lookupAccountName(recipientAccount)

    if (accountInfo) {
      setRecipientName(accountInfo.name)
      setRecipientBank(accountInfo.bank)
      setAccountLookupError("")
    } else {
      setRecipientName("")
      setRecipientBank("")
      setAccountLookupError("Account not found. Please verify the account number.")
    }

    setIsLookingUp(false)
  }

  if (!user || user.type !== "user") {
    return null
  }

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transactionId)
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const transferAmount = Number.parseFloat(amount)

    if (transferAmount <= 0) {
      setError("Please enter a valid amount")
      setIsLoading(false)
      return
    }

    if (transferAmount > user.balance) {
      setError("Insufficient funds")
      setIsLoading(false)
      return
    }

    if (!recipientAccount.trim()) {
      setError("Please enter a recipient account number")
      setIsLoading(false)
      return
    }

    if (!recipientName.trim()) {
      setError("Account could not be verified. Please check the account number.")
      setIsLoading(false)
      return
    }

    // Simulate transaction creation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Create new transaction with verification stages
      const newTransaction = createNewTransaction(
        user.id,
        "transfer",
        transferAmount,
        description || `Transfer to ${recipientName}`,
        recipientAccount,
        recipientName,
        recipientBank,
        user.accountNumber,
      )

      setTransactionId(newTransaction.id)
      setSuccess(true)
    } catch (error) {
      setError("Failed to create transaction. Please try again.")
    }

    setIsLoading(false)
  }

  // Check if form is ready for submission
  const canSubmit = recipientAccount.trim() && amount.trim() && recipientName && !isLookingUp

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  USBankCorp
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Initiated Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your transfer of ${amount} to {recipientName} has been created and is now pending verification.
              </p>

              {/* Transaction ID Display */}
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Important: Save Your Transaction ID</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-2xl font-mono text-blue-900 bg-white px-4 py-2 rounded border">
                    {transactionId}
                  </span>
                  <Button size="sm" variant="outline" onClick={copyTransactionId} className="bg-transparent">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-blue-700 mb-2">
                  <strong>You will need this 12-digit Transaction ID to complete verification.</strong>
                </p>
                <p className="text-xs text-blue-600">
                  Please save this ID and provide it when contacting the administrator for verification codes.
                </p>
              </div>

              {/* Transfer Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-medium text-gray-800 mb-3">Transfer Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Recipient:</span>
                    <span className="font-medium">{recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account:</span>
                    <span className="font-mono">{recipientAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank:</span>
                    <span>{recipientBank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium text-green-600">${amount}</span>
                  </div>
                  {description && (
                    <div className="flex justify-between">
                      <span>Description:</span>
                      <span>{description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200 text-left">
                <h4 className="font-medium text-orange-800 mb-2">Administrator Contact Information</h4>
                <div className="text-sm text-orange-700 space-y-1">
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-BANK
                  </p>
                  <p>
                    <strong>Email:</strong> admin@usbankcorp.com
                  </p>
                  <p className="text-xs mt-2 text-orange-600">
                    Have your Transaction ID ready when contacting support.
                  </p>
                </div>
              </div>

              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">Go to Dashboard & Start Verification</Button>
                </Link>
                <Button variant="outline" onClick={() => setSuccess(false)}>
                  Make Another Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                USBankCorp
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="mr-2 h-5 w-5" />
              Transfer Money
            </CardTitle>
            <CardDescription>Send money securely to any account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Available Balance:</strong> $
                {user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <form onSubmit={handleTransfer} className="space-y-6">
              {/* Recipient Account Number */}
              <div>
                <Label htmlFor="account">Recipient Account Number *</Label>
                <Input
                  id="account"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  placeholder="Enter account number"
                  required
                  className="mt-1"
                />
              </div>

              {/* Account Details Display */}
              {(recipientName || isLookingUp || accountLookupError) && (
                <div>
                  <Label>Account Details</Label>
                  <div className="mt-1 p-4 border rounded-md bg-gray-50">
                    {isLookingUp ? (
                      <div className="flex items-center text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Verifying account...
                      </div>
                    ) : recipientName ? (
                      <div className="space-y-2">
                        <div className="flex items-center text-green-700">
                          <User className="mr-2 h-4 w-4" />
                          <span className="font-medium">{recipientName}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Building2 className="mr-2 h-4 w-4" />
                          <span className="text-sm">{recipientBank}</span>
                          {recipientBank === "USBankCorp" && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Internal</span>
                          )}
                        </div>
                      </div>
                    ) : accountLookupError ? (
                      <div className="text-red-600 text-sm">
                        <AlertTriangle className="inline mr-1 h-4 w-4" />
                        {accountLookupError}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Amount ($) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={user.balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this transfer for?"
                  className="mt-1"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || !canSubmit}>
                {isLoading ? "Creating Transfer..." : "Initiate Transfer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
