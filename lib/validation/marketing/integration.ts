import { z } from 'zod'

export const twilioSchema = z.object({
  account_sid: z.string().min(1, 'Account SID is required'),
  auth_token: z.string().min(1, 'Auth Token is required'),
  phone_number: z.string().min(1, 'Phone Number is required'),
})

export const aakashSmsSchema = z.object({
  api_key: z.string().min(1, 'API Key is required'),
})

export const sparrowSmsSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  from: z.string().min(1, 'Sender ID is required'),
})

export const smtpSchema = z.object({
  host: z.string().min(1, 'SMTP Host is required'),
  port: z.number().min(1, 'SMTP Port is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  from_email: z.email('Invalid email address'),
  from_name: z.string().min(1, 'From Name is required'),
  use_tls: z.boolean().default(true),
})

export const otpVerifySchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export type TwilioFormData = z.infer<typeof twilioSchema>
export type AakashSmsFormData = z.infer<typeof aakashSmsSchema>
export type SparrowSmsFormData = z.infer<typeof sparrowSmsSchema>
export type SmtpFormData = z.infer<typeof smtpSchema>
export type OtpVerifyFormData = z.infer<typeof otpVerifySchema>