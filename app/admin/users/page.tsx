"use client"

import { useAuth } from "@/contexts/auth-context"
import { mockUsers, mockTransactions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Users, CreditCard, Activity, ArrowLeft } from "lucide-react"

export default function AdminUsersPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.type !== "admin") {
      router.push("/admin/login")
    }
  }, [user, router])

  if (!user || user.type !== "admin") {
    return null
  }

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
              <Link href="/admin/transactions">
                <Button variant="outline" size="sm">
                  <Activity className="mr-2 h-4 w-4" />
                  Transactions
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage customer accounts and monitor activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockUsers.length}</div>
              <p className="text-gray-600">Active accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                $
                {mockUsers
                  .reduce((sum, user) => sum + user.balance, 0)
                  .toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-gray-600">Across all accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockTransactions.length}</div>
              <p className="text-gray-600">Total transactions</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Accounts</CardTitle>
            <CardDescription>Overview of all customer accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.map((customer) => {
                const customerTransactions = mockTransactions.filter((t) => t.userId === customer.id)
                return (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                        <p className="text-sm text-gray-500">Account: {customer.accountNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ${customer.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-500">{customerTransactions.length} transactions</p>
                      <Badge variant="outline" className="mt-1">
                        Active
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
