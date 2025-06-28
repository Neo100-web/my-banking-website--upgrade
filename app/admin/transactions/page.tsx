"use client"

import type React from "react"

import { Alert } from "@/components/ui/alert"

import { useAuth } from "@/contexts/auth-context"
import {
  getAllTransactions,
  getTransactionsByStatus,
  mockUsers,
  approveTransaction,
  rejectTransaction,
  bulkApproveTransactions,
  type Transaction,
} from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Users,
  AlertTriangle,
  Check,
  X,
  FileText,
  Shield,
  Copy,
  Eye,
  Phone,
  Key,
} from "lucide-react"

const CustomAlertTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-medium text-lg text-red-800">{children}</h2>
)

export default function AdminTransactionsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [showBulkApprovalDialog, setShowBulkApprovalDialog] = useState(false)
  const [showCodeDialog, setShowCodeDialog] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null)
  const [approvalNotes, setApprovalNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!user || user.type !== "admin") {
      router.push("/admin/login")
    } else {
      setTransactions(getAllTransactions())
    }
  }, [user, router])

  const refreshTransactions = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setTransactions(getAllTransactions())
    setIsRefreshing(false)
  }

  const handleViewCodes = (transaction: Transaction) => {
    setCurrentTransaction(transaction)
    setShowCodeDialog(true)
  }

  const handleApproveTransaction = async (transaction: Transaction) => {
    setCurrentTransaction(transaction)
    setShowApprovalDialog(true)
  }

  const handleRejectTransaction = async (transaction: Transaction) => {
    setCurrentTransaction(transaction)
    setShowRejectionDialog(true)
  }

  const confirmApproval = async () => {
    if (!currentTransaction || !user) return

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = approveTransaction(currentTransaction.id, user.id, approvalNotes)
    if (success) {
      setTransactions(getAllTransactions())
      setSelectedTransactions((prev) => prev.filter((id) => id !== currentTransaction.id))
    }

    setShowApprovalDialog(false)
    setCurrentTransaction(null)
    setApprovalNotes("")
    setIsProcessing(false)
  }

  const confirmRejection = async () => {
    if (!currentTransaction || !user) return

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = rejectTransaction(currentTransaction.id, user.id, approvalNotes)
    if (success) {
      setTransactions(getAllTransactions())
      setSelectedTransactions((prev) => prev.filter((id) => id !== currentTransaction.id))
    }

    setShowRejectionDialog(false)
    setCurrentTransaction(null)
    setApprovalNotes("")
    setIsProcessing(false)
  }

  const handleBulkApproval = async () => {
    if (!user || selectedTransactions.length === 0) return

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const approvedCount = bulkApproveTransactions(selectedTransactions, user.id, approvalNotes)
    if (approvedCount > 0) {
      setTransactions(getAllTransactions())
      setSelectedTransactions([])
    }

    setShowBulkApprovalDialog(false)
    setApprovalNotes("")
    setIsProcessing(false)
  }

  const toggleTransactionSelection = (transactionId: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(transactionId) ? prev.filter((id) => id !== transactionId) : [...prev, transactionId],
    )
  }

  const selectAllPendingProcessing = () => {
    const pendingProcessingIds = transactions
      .filter((t) => (t.status === "pending" || t.status === "processing") && t.requiresApproval)
      .map((t) => t.id)
    setSelectedTransactions(pendingProcessingIds)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!user || user.type !== "admin") {
    return null
  }

  const pendingTransactions = getTransactionsByStatus("pending")
  const processingTransactions = getTransactionsByStatus("processing")
  const processedTransactions = getTransactionsByStatus("processed")
  const waitingAdminApproval = getTransactionsByStatus("waiting_admin_approval")
  const completedTransactions = getTransactionsByStatus("completed")
  const failedTransactions = getTransactionsByStatus("failed")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending OTP
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Processing COT
          </Badge>
        )
      case "processed":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Processed Token
          </Badge>
        )
      case "waiting_admin_approval":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Awaiting 2FA
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed/Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find((u) => u.id === userId)
    return foundUser ? foundUser.name : "Unknown User"
  }

  const TransactionList = ({
    transactions: txList,
    showApprovalActions = false,
    showSelection = false,
    showCodes = false,
  }: {
    transactions: Transaction[]
    showApprovalActions?: boolean
    showSelection?: boolean
    showCodes?: boolean
  }) => (
    <div className="space-y-3">
      {txList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No transactions found</div>
      ) : (
        txList.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {showSelection && transaction.requiresApproval && (
                <Checkbox
                  checked={selectedTransactions.includes(transaction.id)}
                  onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                />
              )}
              <div className="flex items-center space-x-2">
                {getStatusIcon(transaction.status)}
                {transaction.requiresApproval &&
                  (transaction.status === "processing" || transaction.status === "pending") && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
              </div>
              <div
                className={`p-2 rounded-full ${
                  transaction.type === "credit"
                    ? "bg-green-100"
                    : transaction.type === "debit"
                      ? "bg-red-100"
                      : "bg-blue-100"
                }`}
              >
                {transaction.type === "credit" ? (
                  <ArrowDownLeft className="h-4 w-4 text-green-600" />
                ) : transaction.type === "debit" ? (
                  <ArrowUpRight className="h-4 w-4 text-red-600" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{transaction.description}</p>
                  {getStatusBadge(transaction.status)}
                  {transaction.requiresApproval && (
                    <Badge variant="outline" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Requires Approval
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {getUserName(transaction.userId)} • {new Date(transaction.createdAt).toLocaleString()}
                </p>
                {transaction.recipientAccount && (
                  <p className="text-xs text-gray-400">
                    {transaction.senderAccount} → {transaction.recipientAccount}
                  </p>
                )}
                {transaction.approvalNotes && (
                  <p className="text-xs text-gray-600 mt-1">
                    <FileText className="w-3 h-3 inline mr-1" />
                    {transaction.approvalNotes}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    transaction.type === "credit"
                      ? "text-green-600"
                      : transaction.type === "debit"
                        ? "text-red-600"
                        : "text-blue-600"
                  }`}
                >
                  {transaction.type === "credit" ? "+" : transaction.type === "debit" ? "-" : ""}$
                  {transaction.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">ID: {transaction.id}</p>
              </div>
              <div className="flex flex-col space-y-2">
                {showCodes && transaction.verificationCodes && (
                  <Button size="sm" variant="outline" onClick={() => handleViewCodes(transaction)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Codes
                  </Button>
                )}
                {showApprovalActions && transaction.status === "waiting_admin_approval" && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveTransaction(transaction)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRejectTransaction(transaction)}>
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const awaitingApprovalCount = pendingTransactions.length + processingTransactions.length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-red-600">
                USBankCorp Admin
              </Link>
              <Badge variant="destructive">Admin Panel</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <span className="text-sm text-gray-700">Admin: {user.name}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Approval Center</h1>
            <p className="text-gray-600">Review transactions and provide verification codes to customers</p>
          </div>
          <div className="flex space-x-3">
            {selectedTransactions.length > 0 && (
              <Button onClick={() => setShowBulkApprovalDialog(true)} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Bulk Approve ({selectedTransactions.length})
              </Button>
            )}
            <Button onClick={refreshTransactions} disabled={isRefreshing} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Alert for pending approvals */}
        {awaitingApprovalCount > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <CustomAlertTitle>
                    {awaitingApprovalCount} transactions awaiting customer verification
                  </CustomAlertTitle>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-2"></div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-red-700">
                  <Phone className="h-4 w-4" />
                  <span>Customers may call for verification codes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending OTP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingTransactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Processing COT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{processingTransactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Processed Token</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{processedTransactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Awaiting 2FA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{waitingAdminApproval.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTransactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{failedTransactions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Transaction Management & Code Distribution
            </CardTitle>
            <CardDescription>
              Monitor transactions and provide verification codes to customers upon request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="codes" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="codes">Code Distribution</TabsTrigger>
                <TabsTrigger value="pending">Pending OTP</TabsTrigger>
                <TabsTrigger value="processing">Processing COT</TabsTrigger>
                <TabsTrigger value="processed">Processed Token</TabsTrigger>
                <TabsTrigger value="waiting">Awaiting 2FA</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>

              <TabsContent value="codes" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Active Transactions Requiring Codes</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Key className="h-4 w-4" />
                      <span>Click "View Codes" to see verification codes</span>
                    </div>
                  </div>
                  <TransactionList
                    transactions={[
                      ...pendingTransactions,
                      ...processingTransactions,
                      ...processedTransactions,
                      ...waitingAdminApproval,
                    ]}
                    showCodes={true}
                  />
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <TransactionList transactions={pendingTransactions} showCodes={true} />
              </TabsContent>

              <TabsContent value="processing" className="mt-6">
                <TransactionList transactions={processingTransactions} showCodes={true} />
              </TabsContent>

              <TabsContent value="processed" className="mt-6">
                <TransactionList transactions={processedTransactions} showCodes={true} />
              </TabsContent>

              <TabsContent value="waiting" className="mt-6">
                <TransactionList transactions={waitingAdminApproval} showApprovalActions={true} showCodes={true} />
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <TransactionList transactions={completedTransactions} />
              </TabsContent>

              <TabsContent value="failed" className="mt-6">
                <TransactionList transactions={failedTransactions} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Verification Codes Dialog */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600">
              <Key className="mr-2 h-5 w-5" />
              Verification Codes - Transaction #{currentTransaction?.id}
            </DialogTitle>
            <DialogDescription>
              Provide these codes to the customer when they contact you for verification
            </DialogDescription>
          </DialogHeader>
          {currentTransaction && (
            <div className="space-y-6">
              {/* Transaction Details */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Transaction Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Customer:</strong> {getUserName(currentTransaction.userId)}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${currentTransaction.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Description:</strong> {currentTransaction.description}
                    </p>
                    <p>
                      <strong>Status:</strong> {currentTransaction.status.replace("_", " ").toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Codes */}
              <div className="space-y-4">
                <h4 className="font-medium">Available Verification Codes</h4>

                {currentTransaction.verificationCodes?.otp && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-800">OTP (One-Time Password)</p>
                        <p className="text-2xl font-mono text-blue-900">{currentTransaction.verificationCodes.otp}</p>
                        <p className="text-sm text-blue-600">Step 1: Initial verification</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(currentTransaction.verificationCodes!.otp!)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentTransaction.verificationCodes?.cot && (
                  <div className="p-4 border rounded-lg bg-orange-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-800">COT (Certificate of Transfer)</p>
                        <p className="text-2xl font-mono text-orange-900">{currentTransaction.verificationCodes.cot}</p>
                        <p className="text-sm text-orange-600">Step 2: Transfer authorization</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(currentTransaction.verificationCodes!.cot!)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentTransaction.verificationCodes?.tokenKey && (
                  <div className="p-4 border rounded-lg bg-purple-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-purple-800">Token Key</p>
                        <p className="text-2xl font-mono text-purple-900">
                          {currentTransaction.verificationCodes.tokenKey}
                        </p>
                        <p className="text-sm text-purple-600">Step 3: Final verification token</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(currentTransaction.verificationCodes!.tokenKey!)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentTransaction.verificationCodes?.twoFA && (
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">2FA (Two-Factor Authentication)</p>
                        <p className="text-2xl font-mono text-green-900">
                          {currentTransaction.verificationCodes.twoFA}
                        </p>
                        <p className="text-sm text-green-600">Step 4: Pre-admin approval verification</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(currentTransaction.verificationCodes!.twoFA!)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <p className="text-blue-800">
                  <strong>Instructions:</strong> Only provide the code for the current verification stage. Customer must
                  complete stages in order: OTP → COT → Token Key → 2FA → Admin Approval.
                </p>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowCodeDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <Check className="mr-2 h-5 w-5" />
              Approve Transaction
            </DialogTitle>
            <DialogDescription>
              You are about to approve this transaction. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentTransaction && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>
                  <strong>Transaction:</strong> {currentTransaction.description}
                </p>
                <p>
                  <strong>Amount:</strong> ${currentTransaction.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Customer:</strong> {getUserName(currentTransaction.userId)}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(currentTransaction.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <Label htmlFor="approval-notes">Approval Notes (Optional)</Label>
                <Textarea
                  id="approval-notes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={confirmApproval} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
              {isProcessing ? "Approving..." : "Approve Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <X className="mr-2 h-5 w-5" />
              Reject Transaction
            </DialogTitle>
            <DialogDescription>You are about to reject this transaction. Please provide a reason.</DialogDescription>
          </DialogHeader>
          {currentTransaction && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>
                  <strong>Transaction:</strong> {currentTransaction.description}
                </p>
                <p>
                  <strong>Amount:</strong> ${currentTransaction.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Customer:</strong> {getUserName(currentTransaction.userId)}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(currentTransaction.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <Label htmlFor="rejection-notes">Rejection Reason *</Label>
                <Textarea
                  id="rejection-notes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Please provide a reason for rejecting this transaction..."
                  className="mt-1"
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={confirmRejection} disabled={isProcessing || !approvalNotes.trim()} variant="destructive">
              {isProcessing ? "Rejecting..." : "Reject Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Approval Dialog */}
      <AlertDialog open={showBulkApprovalDialog} onOpenChange={setShowBulkApprovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-600">
              <Check className="mr-2 h-5 w-5" />
              Bulk Approve Transactions
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to approve {selectedTransactions.length} transactions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Label htmlFor="bulk-notes">Bulk Approval Notes (Optional)</Label>
            <Textarea
              id="bulk-notes"
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Add notes for all selected transactions..."
              className="mt-1"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkApproval}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Approving..." : `Approve ${selectedTransactions.length} Transactions`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
