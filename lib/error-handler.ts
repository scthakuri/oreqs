import { toast } from 'sonner'
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import type { ApiError, StandardizedErrorResponse, ApiErrorResponse } from '@/types/errors'

function isStandardizedError(data: unknown): data is StandardizedErrorResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'errors' in (data as Record<string, unknown>) &&
        Array.isArray((data as Record<string, unknown>).errors)
    )
}

function hasDetailField(data: unknown): data is ApiErrorResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'detail' in (data as Record<string, unknown>) &&
        typeof (data as Record<string, unknown>).detail === 'string'
    )
}

export function setBackendErrors<T extends FieldValues>(
    error: ApiError,
    setError: UseFormSetError<T>
): void {
    try {
        const errorData = error.response?.data

        if (!errorData || !isStandardizedError(errorData)) {
            const message =
                (errorData && 'message' in (errorData as Record<string, unknown>) && typeof (errorData as Record<string, unknown>).message === 'string')
                    ? (errorData as ApiErrorResponse).message as string
                    : error.message || 'An unexpected error occurred'
            toast.error(message)
            return
        }

        let hasFieldErrors = false

        errorData.errors.forEach((err) => {
            if (err.attr && err.attr !== 'non_field_errors') {
                setError(err.attr as Path<T>, {
                    type: 'server',
                    message: err.detail,
                })
                hasFieldErrors = true
            } else {
                toast.error(err.detail || 'An error occurred')
            }
        })

        if (!hasFieldErrors && errorData.errors.length === 0) {
            toast.error('An unexpected error occurred')
        }
    } catch {
        const fallbackMessage = 'An unexpected error occurred'
        const errorData = error.response?.data
        const message =
            (errorData && 'message' in (errorData as Record<string, unknown>) && typeof (errorData as Record<string, unknown>).message === 'string')
                ? (errorData as ApiErrorResponse).message as string
                : error.message || fallbackMessage
        toast.error(message)
    }
}

export function parseDjangoError(error: ApiError): Record<string, string> {
    const data = error.response?.data
    const formatted: Record<string, string> = {}

    if (!data) return { detail: error.message || 'An unexpected error occurred' }

    if (hasDetailField(data)) {
        formatted.detail = data.detail as string
        return formatted
    }

    if (isStandardizedError(data)) {
        for (const err of data.errors) {
            const key = err.attr || 'detail'
            formatted[key] = err.detail
        }
        return formatted
    }

    if (typeof data === 'object') {
        for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
            if (Array.isArray(value)) {
                formatted[key] = value.join(', ')
            } else if (typeof value === 'string') {
                formatted[key] = value
            } else if (typeof value === 'object' && value !== null) {
                formatted[key] = JSON.stringify(value)
            }
        }
        return formatted
    }

    return { detail: error.message || 'An unexpected error occurred' }
}

export function handleBackendError<T extends FieldValues>(
    error: ApiError,
    setError: UseFormSetError<T>,
    defaultMessage = 'An error occurred'
): void {
    const data = error.response?.data

    if (!data) {
        toast.error(error.message || defaultMessage)
        return
    }

    if (typeof data === 'string') {
        toast.error(data)
        return
    }

    if (hasDetailField(data)) {
        toast.error(data.detail as string)
        return
    }

    if (isStandardizedError(data)) {
        setBackendErrors(error, setError)
        return
    }

    if (typeof data === 'object') {
        let hasFieldErrors = false
        for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
            if (key === 'non_field_errors') {
                const message = Array.isArray(value) ? value.join(', ') : String(value)
                toast.error(message)
            } else {
                const message = Array.isArray(value) ? value[0] : String(value)
                setError(key as Path<T>, {
                    type: 'server',
                    message,
                })
                hasFieldErrors = true
            }
        }
        if (!hasFieldErrors) {
            toast.error(defaultMessage)
        }
        return
    }

    toast.error(defaultMessage)
}
