// lib/prisma.js (if using ESM and "type": "module")
import { PrismaClient } from '../generated/prisma/client.js'  // ✅ include `.js` extension


const prisma = new PrismaClient()

export default prisma
