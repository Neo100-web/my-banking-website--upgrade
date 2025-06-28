export interface User {
  id: string
  email: string
  name: string
  accountNumber: string
  balance: number
  type: "user"
}

export interface Admin {
  id: string
  email: string
  name: string
  type: "admin"
}

export type AuthUser = User | Admin

// Mock user data
export const mockUsers: User[] = [
  {
    id: "1",
    email: "danielhenney707@gmail.com",
    name: "DANIEL HENNEY",
    accountNumber: "1234567890",
    balance: 7016672892.02,
    type: "user",
  },
  {
    id: "2",
    email: "jane@bank.com",
    name: "Jane Smith",
    accountNumber: "0987654321",
    balance: 12750.25,
    type: "user",
  },
]

// Mock external bank accounts for demonstration - Updated with real American and European banks
export const mockExternalAccounts = [
  // American Banks
  {
    accountNumber: "1111222233",
    accountName: "Michael Johnson",
    bankName: "JPMorgan Chase Bank",
  },
  {
    accountNumber: "4444555566",
    accountName: "Sarah Williams",
    bankName: "Bank of America",
  },
  {
    accountNumber: "7777888899",
    accountName: "David Brown",
    bankName: "Wells Fargo Bank",
  },
  {
    accountNumber: "2222333344",
    accountName: "Emily Davis",
    bankName: "Citibank",
  },
  {
    accountNumber: "5555666677",
    accountName: "Robert Wilson",
    bankName: "Goldman Sachs Bank",
  },
  {
    accountNumber: "8888999900",
    accountName: "Jennifer Martinez",
    bankName: "Morgan Stanley Bank",
  },
  {
    accountNumber: "3333444455",
    accountName: "Christopher Lee",
    bankName: "U.S. Bank",
  },
  {
    accountNumber: "6666777788",
    accountName: "Amanda Taylor",
    bankName: "PNC Bank",
  },
  {
    accountNumber: "9999000011",
    accountName: "James Anderson",
    bankName: "Capital One Bank",
  },
  {
    accountNumber: "1122334455",
    accountName: "Lisa Thompson",
    bankName: "TD Bank",
  },
  // European Banks
  {
    accountNumber: "2233445566",
    accountName: "Pierre Dubois",
    bankName: "BNP Paribas",
  },
  {
    accountNumber: "3344556677",
    accountName: "Hans Mueller",
    bankName: "Deutsche Bank",
  },
  {
    accountNumber: "4455667788",
    accountName: "Giovanni Rossi",
    bankName: "UniCredit Bank",
  },
  {
    accountNumber: "5566778899",
    accountName: "Carlos Rodriguez",
    bankName: "Banco Santander",
  },
  {
    accountNumber: "6677889900",
    accountName: "Emma Thompson",
    bankName: "Barclays Bank",
  },
  {
    accountNumber: "7788990011",
    accountName: "Lars Andersson",
    bankName: "Nordea Bank",
  },
  {
    accountNumber: "8899001122",
    accountName: "Marie Leclerc",
    bankName: "Crédit Agricole",
  },
  {
    accountNumber: "9900112233",
    accountName: "Klaus Weber",
    bankName: "Commerzbank",
  },
  {
    accountNumber: "0011223344",
    accountName: "Sofia Petrov",
    bankName: "ING Bank",
  },
  {
    accountNumber: "1234567891",
    accountName: "Antonio Silva",
    bankName: "Banco do Brasil",
  },
  {
    accountNumber: "2345678912",
    accountName: "Francesca Bianchi",
    bankName: "Intesa Sanpaolo",
  },
  {
    accountNumber: "3456789123",
    accountName: "Oliver Smith",
    bankName: "HSBC Bank",
  },
  {
    accountNumber: "4567891234",
    accountName: "Anna Kowalski",
    bankName: "PKO Bank Polski",
  },
  {
    accountNumber: "5678912345",
    accountName: "Jean Martin",
    bankName: "Société Générale",
  },
  {
    accountNumber: "6789123456",
    accountName: "Erik Nielsen",
    bankName: "Danske Bank",
  },
]

// Mock admin data
export const mockAdmins: Admin[] = [
  {
    id: "admin1",
    email: "admin@usbankcorp.com",
    name: "Bank Administrator",
    type: "admin",
  },
]

// Updated transaction status types to include new stages
export type TransactionStatus =
  | "pending"
  | "processing"
  | "processed"
  | "waiting_admin_approval"
  | "completed"
  | "failed"

// Add verification types and codes
export interface VerificationCodes {
  otp?: string
  cot?: string
  tokenKey?: string
  twoFA?: string
}

export interface Transaction {
  id: string
  userId: string
  type: "credit" | "debit" | "transfer"
  amount: number
  description: string
  date: string
  balance: number
  status: TransactionStatus
  createdAt: string
  updatedAt: string
  recipientAccount?: string
  recipientName?: string
  recipientBank?: string
  senderAccount?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  approvalNotes?: string
  requiresApproval?: boolean
  verificationCodes?: VerificationCodes
  currentVerificationStage?: "otp" | "cot" | "token" | "2fa" | "admin" | "completed"
  verificationAttempts?: number
  maxVerificationAttempts?: number
}

// Generate 12-digit transaction ID
export function generateTransactionId(): string {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString()
}

// Update the lookupAccountName function to accept any bank and account combination
export function lookupAccountName(accountNumber: string): { name: string; bank: string } | null {
  // First check internal accounts (same bank)
  const internalUser = mockUsers.find((user) => user.accountNumber === accountNumber)
  if (internalUser) {
    return { name: internalUser.name, bank: "USBankCorp" }
  }

  // Then check external accounts
  const externalAccount = mockExternalAccounts.find((account) => account.accountNumber === accountNumber)
  if (externalAccount) {
    return { name: externalAccount.accountName, bank: externalAccount.bankName }
  }

  // For any other account number, generate a realistic account holder name
  // This simulates a real banking system that can transfer to any valid account
  if (accountNumber.length >= 8) {
    const names = [
      "Alex Johnson",
      "Maria Garcia",
      "David Chen",
      "Sarah Williams",
      "Michael Brown",
      "Emma Davis",
      "James Wilson",
      "Lisa Anderson",
      "Robert Taylor",
      "Jennifer Martinez",
      "Christopher Lee",
      "Amanda Thompson",
      "Daniel Rodriguez",
      "Jessica White",
      "Matthew Harris",
      "Ashley Clark",
      "Joshua Lewis",
      "Stephanie Walker",
      "Andrew Hall",
      "Melissa Young",
      "Kevin Allen",
      "Nicole King",
      "Brian Wright",
      "Rachel Green",
      "Justin Scott",
      "Heather Adams",
      "Ryan Baker",
      "Kimberly Nelson",
      "Brandon Carter",
      "Amy Mitchell",
      "Tyler Perez",
      "Samantha Roberts",
      "Jason Turner",
      "Elizabeth Phillips",
      "Aaron Campbell",
      "Michelle Parker",
      "Jacob Evans",
      "Laura Edwards",
      "Nicholas Collins",
      "Rebecca Stewart",
      "Jonathan Morris",
      "Deborah Rogers",
      "Anthony Reed",
      "Sharon Cook",
      "Mark Bailey",
      "Cynthia Cooper",
      "Steven Richardson",
      "Kathleen Cox",
      "Paul Ward",
      "Helen Torres",
      "Pierre Dubois",
      "Hans Mueller",
      "Giovanni Rossi",
      "Carlos Rodriguez",
      "Emma Thompson",
      "Lars Andersson",
      "Marie Leclerc",
      "Klaus Weber",
      "Sofia Petrov",
      "Antonio Silva",
      "Francesca Bianchi",
      "Oliver Smith",
      "Anna Kowalski",
      "Jean Martin",
      "Erik Nielsen",
    ]

    const banks = [
      // Major US Banks
      "JPMorgan Chase Bank",
      "Bank of America",
      "Wells Fargo Bank",
      "Citibank",
      "U.S. Bank",
      "PNC Bank",
      "Goldman Sachs Bank",
      "Morgan Stanley Bank",
      "Capital One Bank",
      "TD Bank",
      "Truist Bank",
      "Charles Schwab Bank",
      "American Express Bank",
      "Discover Bank",
      "Ally Bank",

      // Major European Banks
      "BNP Paribas",
      "Deutsche Bank",
      "UniCredit Bank",
      "Banco Santander",
      "Barclays Bank",
      "HSBC Bank",
      "ING Bank",
      "Nordea Bank",
      "Danske Bank",
      "Crédit Agricole",
      "Société Générale",
      "Commerzbank",
      "Intesa Sanpaolo",
      "ABN AMRO Bank",
      "Rabobank",

      // International Banks
      "Standard Chartered Bank",
      "Credit Suisse",
      "UBS",
      "Lloyds Banking Group",
      "Royal Bank of Scotland",
      "Banco Bilbao Vizcaya Argentaria",
      "CaixaBank",
      "PKO Bank Polski",
      "Erste Group Bank",
      "KBC Bank",
      "Swedbank",
      "Handelsbanken",
      "DNB Bank",
      "Alpha Bank",
      "National Bank of Greece",

      // Asian Banks
      "Bank of China",
      "Industrial and Commercial Bank of China",
      "Mitsubishi UFJ Financial Group",
      "Sumitomo Mitsui Banking Corporation",
      "Mizuho Financial Group",
      "DBS Bank",
      "OCBC Bank",
      "United Overseas Bank",
      "CIMB Bank",
      "Maybank",
      "Bangkok Bank",
      "Kasikornbank",

      // Other Regional Banks
      "Commonwealth Bank of Australia",
      "Westpac Banking Corporation",
      "Australia and New Zealand Banking Group",
      "National Australia Bank",
      "Royal Bank of Canada",
      "Toronto-Dominion Bank",
      "Bank of Nova Scotia",
      "Bank of Montreal",
      "Canadian Imperial Bank of Commerce",
      "Banco do Brasil",
      "Itaú Unibanco",
      "Banco Bradesco",
      "Banco Santander Brasil",
      "Standard Bank",
      "FirstRand Bank",
      "Nedbank",
      "ABSA Bank",
      "Sberbank",
      "VTB Bank",
      "Gazprombank",
      "Alfa-Bank",
    ]

    // Use account number to deterministically select name and bank
    const nameIndex = Number.parseInt(accountNumber.slice(-2)) % names.length
    const bankIndex = Number.parseInt(accountNumber.slice(-3, -1)) % banks.length

    return {
      name: names[nameIndex],
      bank: banks[bankIndex],
    }
  }

  return null
}

// Updated mock transactions - only completed historical transactions
export const mockTransactions: Transaction[] = [
  {
    id: "123456789012",
    userId: "1",
    type: "credit",
    amount: 2500.0,
    description: "Salary Deposit",
    date: "2024-01-15",
    balance: 7016672892.02,
    status: "completed",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:30Z",
    requiresApproval: false,
    currentVerificationStage: "completed",
  },
  {
    id: "234567890123",
    userId: "1",
    type: "debit",
    amount: 150.0,
    description: "Grocery Store",
    date: "2024-01-14",
    balance: 7016670392.02,
    status: "completed",
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:15Z",
    requiresApproval: false,
    currentVerificationStage: "completed",
  },
  {
    id: "345678901234",
    userId: "2",
    type: "credit",
    amount: 1500.0,
    description: "Freelance Payment",
    date: "2024-01-13",
    balance: 12750.25,
    status: "completed",
    createdAt: "2024-01-13T16:20:00Z",
    updatedAt: "2024-01-13T16:20:15Z",
    requiresApproval: false,
    currentVerificationStage: "completed",
  },
  {
    id: "456789012345",
    userId: "2",
    type: "debit",
    amount: 200.0,
    description: "Online Shopping",
    date: "2024-01-12",
    balance: 11250.25,
    status: "completed",
    createdAt: "2024-01-12T11:45:00Z",
    updatedAt: "2024-01-12T11:45:20Z",
    requiresApproval: false,
    currentVerificationStage: "completed",
  },
]

// Verification code generators
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateCOT(): string {
  return "COT" + Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateTokenKey(): string {
  return "TK" + Math.floor(100000 + Math.random() * 900000).toString()
}

export function generate2FA(): string {
  return "2FA" + Math.floor(100000 + Math.random() * 900000).toString()
}

// Create new transaction with verification stages - updated parameters
export function createNewTransaction(
  userId: string,
  type: "transfer",
  amount: number,
  description: string,
  recipientAccount: string,
  recipientName: string,
  recipientBank: string,
  senderAccount: string,
): Transaction {
  const transactionId = generateTransactionId()

  const newTransaction: Transaction = {
    id: transactionId,
    userId,
    type,
    amount,
    description,
    date: new Date().toISOString().split("T")[0],
    balance: 0, // Will be calculated based on user's current balance
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    recipientAccount,
    recipientName,
    recipientBank,
    senderAccount,
    requiresApproval: true,
    currentVerificationStage: "otp",
    verificationAttempts: 0,
    maxVerificationAttempts: 3,
    verificationCodes: {
      otp: generateOTP(),
    },
  }

  // Add to mock transactions array
  mockTransactions.push(newTransaction)
  return newTransaction
}

// Verification functions
export function verifyOTP(transactionId: string, enteredOTP: string): boolean {
  const transaction = mockTransactions.find((t) => t.id === transactionId)
  if (!transaction || !transaction.verificationCodes?.otp) return false

  if (transaction.verificationCodes.otp === enteredOTP) {
    // Move to next stage
    const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
    mockTransactions[transactionIndex] = {
      ...transaction,
      status: "processing",
      currentVerificationStage: "cot",
      updatedAt: new Date().toISOString(),
      verificationCodes: {
        ...transaction.verificationCodes,
        cot: generateCOT(),
      },
    }
    return true
  }

  // Increment verification attempts
  const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
  mockTransactions[transactionIndex] = {
    ...transaction,
    verificationAttempts: (transaction.verificationAttempts || 0) + 1,
    updatedAt: new Date().toISOString(),
  }

  return false
}

export function verifyCOT(transactionId: string, enteredCOT: string): boolean {
  const transaction = mockTransactions.find((t) => t.id === transactionId)
  if (!transaction || !transaction.verificationCodes?.cot) return false

  if (transaction.verificationCodes.cot === enteredCOT) {
    // Move to next stage
    const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
    mockTransactions[transactionIndex] = {
      ...transaction,
      status: "processed",
      currentVerificationStage: "token",
      updatedAt: new Date().toISOString(),
      verificationCodes: {
        ...transaction.verificationCodes,
        tokenKey: generateTokenKey(),
      },
    }
    return true
  }

  // Increment verification attempts
  const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
  mockTransactions[transactionIndex] = {
    ...transaction,
    verificationAttempts: (transaction.verificationAttempts || 0) + 1,
    updatedAt: new Date().toISOString(),
  }

  return false
}

export function verifyTokenKey(transactionId: string, enteredToken: string): boolean {
  const transaction = mockTransactions.find((t) => t.id === transactionId)
  if (!transaction || !transaction.verificationCodes?.tokenKey) return false

  if (transaction.verificationCodes.tokenKey === enteredToken) {
    // Move to next stage
    const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
    mockTransactions[transactionIndex] = {
      ...transaction,
      status: "waiting_admin_approval",
      currentVerificationStage: "2fa",
      updatedAt: new Date().toISOString(),
      verificationCodes: {
        ...transaction.verificationCodes,
        twoFA: generate2FA(),
      },
    }
    return true
  }

  // Increment verification attempts
  const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
  mockTransactions[transactionIndex] = {
    ...transaction,
    verificationAttempts: (transaction.verificationAttempts || 0) + 1,
    updatedAt: new Date().toISOString(),
  }

  return false
}

export function verify2FA(transactionId: string, entered2FA: string): boolean {
  const transaction = mockTransactions.find((t) => t.id === transactionId)
  if (!transaction || !transaction.verificationCodes?.twoFA) return false

  if (transaction.verificationCodes.twoFA === entered2FA) {
    // Move to admin approval stage
    const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
    mockTransactions[transactionIndex] = {
      ...transaction,
      currentVerificationStage: "admin",
      updatedAt: new Date().toISOString(),
    }
    return true
  }

  // Increment verification attempts
  const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
  mockTransactions[transactionIndex] = {
    ...transaction,
    verificationAttempts: (transaction.verificationAttempts || 0) + 1,
    updatedAt: new Date().toISOString(),
  }

  return false
}

// Enhanced approval functions
export function approveTransaction(transactionId: string, adminId: string, notes?: string): boolean {
  const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
  if (transactionIndex === -1) return false

  const transaction = mockTransactions[transactionIndex]
  if (transaction.status !== "waiting_admin_approval") return false

  mockTransactions[transactionIndex] = {
    ...transaction,
    status: "completed",
    approvedBy: adminId,
    approvedAt: new Date().toISOString(),
    approvalNotes: notes,
    updatedAt: new Date().toISOString(),
    currentVerificationStage: "completed",
  }

  return true
}

export function rejectTransaction(transactionId: string, adminId: string, notes?: string): boolean {
  const transactionIndex = mockTransactions.findIndex((t) => t.id === transactionId)
  if (transactionIndex === -1) return false

  const transaction = mockTransactions[transactionIndex]
  if (transaction.status !== "waiting_admin_approval") return false

  mockTransactions[transactionIndex] = {
    ...transaction,
    status: "failed",
    rejectedBy: adminId,
    rejectedAt: new Date().toISOString(),
    approvalNotes: notes,
    updatedAt: new Date().toISOString(),
  }

  return true
}

export function bulkApproveTransactions(transactionIds: string[], adminId: string, notes?: string): number {
  let approvedCount = 0
  transactionIds.forEach((id) => {
    if (approveTransaction(id, adminId, notes)) {
      approvedCount++
    }
  })
  return approvedCount
}

// Get transactions by status
export function getTransactionsByStatus(status: TransactionStatus): Transaction[] {
  return mockTransactions.filter((t) => t.status === status)
}

// Get all transactions for admin
export function getAllTransactions(): Transaction[] {
  return mockTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get user transactions requiring verification
export function getUserTransactionsRequiringVerification(userId: string): Transaction[] {
  return mockTransactions.filter(
    (t) =>
      t.userId === userId &&
      t.currentVerificationStage &&
      t.currentVerificationStage !== "completed" &&
      t.currentVerificationStage !== "admin",
  )
}

export function authenticateUser(email: string, password: string): User | null {
  if (email === "danielhenney707@gmail.com" && password === "Coolguy1977$") {
    return mockUsers[0]
  }
  if (email === "jane@bank.com" && password === "jane123") {
    return mockUsers[1]
  }
  return null
}

export function authenticateAdmin(email: string, password: string): Admin | null {
  if (email === "admin@usbankcorp.com" && password === "Neo4Cent47$") {
    return mockAdmins[0]
  }
  return null
}
