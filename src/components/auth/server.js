import jsonServer from "json-server"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const server = jsonServer.create()
const router = jsonServer.router(join(__dirname, "db.json"))
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Enable CORS for Vite.js app running on port 5173
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Methods", "*")
  next()
})

// Parse POST request body as JSON
server.use(jsonServer.bodyParser)

// Helper function to read and write to db.json
const getDbData = () => {
  const dbPath = join(__dirname, "db.json")
  const data = fs.readFileSync(dbPath, "utf8")
  return JSON.parse(data)
}

const saveDbData = (data) => {
  const dbPath = join(__dirname, "db.json")
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8")
}

// Mock authentication endpoints
server.post("/api/login", (req, res) => {
  const { email, password } = req.body

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  // Check if user exists in db.json
  const dbData = getDbData()
  const user = dbData.users.find((u) => u.email === email)

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  // In a real app, you would check the password hash
  // For this demo, we'll just check if the passwords match
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  console.log(`User logged in: ${email}`)

  // Return a mock token and user data (excluding password)
  const { password: _, ...userWithoutPassword } = user
  return res.status(200).json({
    token: "mock-jwt-token-" + Date.now(),
    user: userWithoutPassword,
  })
})

server.post("/api/signup", (req, res) => {
  const { email, password, fullName } = req.body

  // Simple validation
  if (!email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" })
  }

  // Check if user already exists
  const dbData = getDbData()
  const existingUser = dbData.users.find((u) => u.email === email)

  if (existingUser) {
    return res.status(409).json({ message: "User with this email already exists" })
  }

  // Create new user
  const newUser = {
    id: dbData.users.length > 0 ? Math.max(...dbData.users.map((u) => u.id)) + 1 : 1,
    email,
    password, // In a real app, you would hash the password
    name: fullName,
    createdAt: new Date().toISOString(),
  }

  // Add user to db.json
  dbData.users.push(newUser)
  saveDbData(dbData)

  console.log(`New user created: ${email}, name: ${fullName}`)

  // Return a mock token and user data (excluding password)
  const { password: _, ...userWithoutPassword } = newUser
  return res.status(201).json({
    token: "mock-jwt-token-" + Date.now(),
    user: userWithoutPassword,
  })
})

// Use default router
server.use(router)

// Start server
const PORT = 3001
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
  console.log(`Test the login at: http://localhost:${PORT}/api/login`)
  console.log(`Test the signup at: http://localhost:${PORT}/api/signup`)
})

