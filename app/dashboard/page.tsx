"use client"

import { useAuth } from "@/contexts/auth-context"
import { mockTransactions, getUserTransactionsRequiringVerification } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TransactionVerification } from "@/components/transaction-verification"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownLeft, CreditCard, Send, Eye, AlertTriangle, RefreshCw, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!user || user.type !== "user") {
      router.push("/login")
    } else {
      setPendingVerifications(getUserTransactionsRequiringVerification(user.id))
    }
  }, [user, router, refreshKey])

  const handleVerificationComplete = () => {
    // Refresh the verification list
    setRefreshKey((prev) => prev + 1)
  }

  if (!user || user.type !== "user") {
    return null
  }

  const userTransactions = mockTransactions.filter((t) => t.userId === user.id)

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

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Dashboard</h1>
          <p className="text-gray-600">Manage your banking activities</p>
        </div>

        {/* Pending Verifications Alert */}
        {pendingVerifications.length > 0 ? (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Action Required: Transaction Verification
              </CardTitle>
              <CardDescription className="text-red-700">
                You have {pendingVerifications.length} transaction{pendingVerifications.length > 1 ? "s" : ""} requiring
                verification to proceed.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <CheckCircle className="mr-2 h-5 w-5" />
                No Pending Verifications
              </CardTitle>
              <CardDescription className="text-green-700">
                All your transactions are up to date. You can initiate a new transfer if needed.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Verification Section */}
        {pendingVerifications.length > 0 && (
          <div className="mb-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Pending Verifications</h2>
            {pendingVerifications.map((transaction) => (
              <TransactionVerification
                key={transaction.id}
                transaction={transaction}
                onVerificationComplete={handleVerificationComplete}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Account Overview
              </CardTitle>
              <CardDescription>Account #{user.accountNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-gray-600">Available Balance</p>
              <div className="mt-4 flex space-x-2">
                <Link href="/transfer">
                  <Button className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Transfer Money
                  </Button>
                </Link>
                <Button variant="outline" className="flex items-center bg-transparent">
                  <Eye className="mr-2 h-4 w-4" />
                  View Statements
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Pay Bills
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Mobile Deposit
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Transactions</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefreshKey((prev) => prev + 1)}
                className="bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{transaction.description}</p>
                        {transaction.status === "pending" && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Pending Verification
                          </Badge>
                        )}
                        {transaction.status === "processing" && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Processing
                          </Badge>
                        )}
                        {transaction.status === "processed" && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            Processed
                          </Badge>
                        )}
                        {transaction.status === "waiting_admin_approval" && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            Admin Review
                          </Badge>
                        )}
                        {transaction.status === "completed" && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                        {transaction.status === "failed" && <Badge variant="destructive">Failed</Badge>}
                      </div>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                      {transaction.currentVerificationStage && transaction.currentVerificationStage !== "completed" && (
                        <p className="text-xs text-blue-600">
                          Next:{" "}
                          {transaction.currentVerificationStage === "otp"
                            ? "OTP Verification"
                            : transaction.currentVerificationStage === "cot"
                              ? "COT Verification"
                              : transaction.currentVerificationStage === "token"
                                ? "Token Key Verification"
                                : transaction.currentVerificationStage === "2fa"
                                  ? "2FA Verification"
                                  : "Admin Approval"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">ID: {transaction.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
