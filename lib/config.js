import dotenv from 'dotenv' 
dotenv.config();

export const port = process.env.PORT || 3000
export const mongoUrl = process.env.MONGODB_URI || `mongodb://user:password@localhost:5432/database`
export const googleKey = process.env.GOOGLE_KEY
export const supportEmail = process.env.SUPPORT_EMAIL