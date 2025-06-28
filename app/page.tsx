"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Users, CreditCard, BarChart3 } from "lucide-react"

export default function HomePage() {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">USBankCorp</h1>
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

        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {user.type === "admin" ? "Admin Dashboard" : "Banking Dashboard"}
            </h2>
            <p className="text-lg text-gray-600">
              {user.type === "admin"
                ? "Manage users and oversee banking operations"
                : "Manage your accounts and transactions securely"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.type === "admin" ? (
              <>
                <Link href="/admin/users">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        User Management
                      </CardTitle>
                      <CardDescription>View and manage customer accounts</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href="/admin/transactions">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Transaction Monitoring
                      </CardTitle>
                      <CardDescription>Monitor live transactions and processing status</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Account Overview
                      </CardTitle>
                      <CardDescription>View your account balance and recent transactions</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href="/transfer">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Transfer Money
                      </CardTitle>
                      <CardDescription>Send money securely to any bank account worldwide</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">USBankCorp</h1>
            <p className="text-lg text-gray-600 mb-8">Your premier corporate banking partner</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Link href="/login">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Customer Login
                  </CardTitle>
                  <CardDescription>Access your personal banking account</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Demo Credentials:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Customer:</strong> danielhenney707@gmail.com / Coolguy1977$
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
