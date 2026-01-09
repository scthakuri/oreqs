'use client'

import {useForm, Controller} from 'react-hook-form'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Switch} from '@/components/ui/switch'
import {Loader2} from 'lucide-react'
import {toast} from 'sonner'
import {integrationsApi} from '@/lib/api/marketing/integration'
import {handleBackendError} from '@/lib/error-handler'
import type {Integration, IntegrationType, IntegrationField} from '@/types/marketing/integration'
import type {ApiError} from '@/types/errors'

interface IntegrationFormDialogProps {
    type: IntegrationType | null
    integration: Integration | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (integration: Integration) => void
}

export function IntegrationFormDialog({
    type,
    integration,
    open,
    onOpenChange,
    onSuccess,
}: IntegrationFormDialogProps) {
    const queryClient = useQueryClient()
    const isEdit = integration?.id !== null;
    const currentType = type || integration?.type
    const fields = integration?.fields || []

    const getDefaultValues = () => {
        const defaults: Record<string, string | number | boolean> = {}

        if (integration?.config) {
            return integration.config
        }

        fields.forEach((field) => {
            if (field.default !== undefined) {
                defaults[field.name] = field.default
            } else {
                defaults[field.name] = field.type === 'switch' ? false : ''
            }
        })

        return defaults
    }

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset,
        setError,
    } = useForm({
        defaultValues: getDefaultValues(),
    })

    const mutation = useMutation({
        mutationFn: async (data: Record<string, string | number | boolean>) => {
            if (isEdit && integration) {
                return await integrationsApi.update(integration.id, {config: data})
            } else if (currentType) {
                return await integrationsApi.create({type: currentType, config: data})
            }
            throw new Error('Invalid configuration')
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['integrations']})
            toast.success(
                isEdit ? 'Integration updated successfully' : 'Integration created successfully',
                {description: 'Please verify OTP to activate'}
            )
            reset()
            if (data) {
                onSuccess(data)
            }
        },
        onError: (error: ApiError) => {
            handleBackendError(error, setError, 'Failed to save integration')
        },
    })

    const validateField = (field: IntegrationField, value: string | number | boolean) => {
        if (field.required && !value && value !== 0 && value !== false) {
            return `${field.label} is required`
        }

        if (field.input_type === 'email' && value && typeof value === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
                return `${field.label} must be a valid email`
            }
        }

        if (field.input_type === 'number' && value) {
            if (isNaN(Number(value))) {
                return `${field.label} must be a number`
            }
        }

        return true
    }

    const renderField = (field: IntegrationField) => {
        const fieldId = `field-${field.name}`

        if (field.type === 'switch') {
            return (
                <div key={field.name} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                        <Label htmlFor={fieldId}>
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {field.description && (
                            <p className="text-sm text-muted-foreground">{field.description}</p>
                        )}
                    </div>
                    <Controller
                        name={field.name}
                        control={control}
                        rules={{validate: (value) => validateField(field, value)}}
                        render={({field: {value, onChange}}) => (
                            <Switch
                                id={fieldId}
                                checked={Boolean(value)}
                                onCheckedChange={onChange}
                            />
                        )}
                    />
                </div>
            )
        }

        return (
            <div key={field.name} className="space-y-2">
                <Label htmlFor={fieldId}>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                    id={fieldId}
                    type={field.input_type || 'text'}
                    placeholder={field.placeholder}
                    {...register(field.name, {
                        validate: (value) => validateField(field, value),
                        valueAsNumber: field.input_type === 'number',
                    })}
                />
                {field.description && !errors[field.name] && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
                {errors[field.name] && (
                    <p className="text-sm text-destructive">
                        {errors[field.name]?.message as string}
                    </p>
                )}
            </div>
        )
    }

    const onSubmit = (data: Record<string, string | number | boolean>) => {
        mutation.mutate(data)
    }

    const getTitle = () => {
        const name = integration?.title || (currentType ? currentType.replace('_', ' ').toUpperCase() : '')
        return isEdit ? `Configure ${name}` : `Setup ${name}`
    }

    const shouldBeFullWidth = (field: IntegrationField) => {
        return field.type === 'switch' ||
            field.input_type === 'password' ||
            field.input_type === 'email'
    }

    const organizeFields = () => {
        const rows: IntegrationField[][] = []
        let currentRow: IntegrationField[] = []

        fields.forEach((field) => {
            if (shouldBeFullWidth(field)) {
                if (currentRow.length > 0) {
                    rows.push(currentRow)
                    currentRow = []
                }
                rows.push([field])
            } else {
                currentRow.push(field)
                if (currentRow.length === 2) {
                    rows.push(currentRow)
                    currentRow = []
                }
            }
        })

        if (currentRow.length > 0) {
            rows.push(currentRow)
        }

        return rows
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{getTitle()}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update your integration configuration. You will receive an OTP if configuration changes.'
                            : 'Configure your integration settings. You will receive an OTP for verification.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {organizeFields().map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={row.length === 1 ? 'w-full' : 'grid gap-4 md:grid-cols-2'}
                        >
                            {row.map((field) => renderField(field))}
                        </div>
                    ))}

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                            disabled={mutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Saving...
                                </>
                            ) : isEdit ? (
                                'Update'
                            ) : (
                                'Setup & Send OTP'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}