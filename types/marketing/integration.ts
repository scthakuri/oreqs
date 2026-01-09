export type IntegrationType = 'twilio' | 'aakash_sms' | 'sparrow_sms' | 'smtp'

export interface IntegrationField {
  name: string
  label: string
  type: 'input' | 'switch'
  input_type?: 'text' | 'password' | 'email' | 'number'
  placeholder?: string
  required: boolean
  description: string
  default: string | number | boolean
  value?: string | number | boolean
}

export interface IntegrationSchema {
  type: IntegrationType
  title: string
  description: string
  fields: IntegrationField[]
}

export interface Integration {
  id: number
  type: IntegrationType
  title: string
  description: string
  is_active: boolean
  is_verified: boolean
  config: Record<string, string | number | boolean>
  fields: IntegrationField[]
  created_at: string
  updated_at: string
}

export interface IntegrationCreatePayload {
  type: IntegrationType
  config: Record<string, string | number | boolean>
}

export interface IntegrationUpdatePayload {
  config: Record<string, string | number | boolean>
}

export interface IntegrationUpdateStatusPayload {
  is_active: boolean
}

export interface VerifyOtpPayload {
  integration_id: number
  otp: string
}

export interface IntegrationApiResponse {
  message?: string
  integration: Integration
}