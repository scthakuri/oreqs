'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
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
import {Loader2} from 'lucide-react'
import {toast} from 'sonner'
import {integrationsApi} from '@/lib/api/marketing/integration'
import {otpVerifySchema, type OtpVerifyFormData} from '@/lib/validation/marketing/integration'
import type {Integration} from '@/types/marketing/integration'
import {ApiError} from "@/types/errors";
import {parseDjangoError} from "@/lib/error-handler";

interface VerifyOtpDialogProps {
    integration: Integration | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function VerifyOtp({integration, open, onOpenChange, onSuccess}: VerifyOtpDialogProps) {
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<OtpVerifyFormData>({
        resolver: zodResolver(otpVerifySchema),
    })

    const verifyMutation = useMutation({
        mutationFn: async (data: OtpVerifyFormData) => {
            if (!integration) throw new Error('No integration selected')
            return await integrationsApi.verifyOtp({
                integration_id: integration.id,
                otp: data.otp,
            })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['integrations']})
            toast.success('Integration verified successfully!', {
                description: 'You can now use this integration',
            })
            reset()
            onSuccess()
        },
        onError: (error: ApiError) => {
            const errors = parseDjangoError(error)
            toast.error('Verification failed', {
                description: errors[Object.keys(errors)[0]] || 'Failed to verify OTP code',
            })
        },
    })

    const resendMutation = useMutation({
        mutationFn: async () => {
            if (!integration) throw new Error('No integration selected')
            return await integrationsApi.resendOtp(integration.id)
        },
        onSuccess: () => {
            toast.success('OTP sent successfully', {
                description: 'Please check your registered contact',
            })
        },
        onError: (error: ApiError) => {
            console.log("Resend OTP error:", error)
            const errors = parseDjangoError(error)
            console.log("Parsed errors:", errors)
            toast.error('Failed to resend OTP')
        },
    })

    const onSubmit = (data: OtpVerifyFormData) => {
        verifyMutation.mutate(data)
    }

    const handleResendOtp = () => {
        resendMutation.mutate()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Verify OTP</DialogTitle>
                    <DialogDescription>
                        Enter the 6-digit OTP code sent to your registered contact
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp">OTP Code *</Label>
                        <Input
                            id="otp"
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            {...register('otp')}
                            autoComplete="off"
                        />
                        {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto"
                            onClick={handleResendOtp}
                            disabled={resendMutation.isPending}
                        >
                            {resendMutation.isPending ? 'Sending...' : 'Resend OTP'}
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={verifyMutation.isPending}>
                            {verifyMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Verifying...
                                </>
                            ) : (
                                'Verify'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}