import type {AxiosError} from 'axios'

export interface StandardizedErrorDetail {
    code: string
    detail: string
    attr: string | null
}

export interface StandardizedErrorResponse {
    type: string
    errors: StandardizedErrorDetail[]
}

export interface ApiErrorResponse {
    message?: string
    detail?: string
    [key: string]: unknown
}

export type ApiError = AxiosError<StandardizedErrorResponse | ApiErrorResponse>
