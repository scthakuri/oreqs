'use client'

import {useState, useRef} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Upload, Download, Loader2, CheckCircle, XCircle, AlertCircle} from 'lucide-react'
import {toast} from 'sonner'
import {marketingUsersApi, ImportResult} from '@/lib/api/marketing/users'
import type {ApiError} from '@/types/errors'
import {ScrollArea} from '@/components/ui/scroll-area'

interface ImportUsersDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    groupId?: number
}

export function ImportUsersDialog({open, onOpenChange, groupId}: ImportUsersDialogProps) {
    const [file, setFile] = useState<File | null>(null)
    const [result, setResult] = useState<ImportResult | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()

    const importMutation = useMutation({
        mutationFn: (file: File) => marketingUsersApi.importUsers(file, groupId),
        onSuccess: async (data) => {
            setResult(data)
            toast.success(data.message)
            await queryClient.invalidateQueries({queryKey: ['marketing-users']})
            if (groupId) {
                await queryClient.invalidateQueries({queryKey: ['group-members', groupId]})
            }
        },
        onError: (error: ApiError) => {
            const message = error.response?.data?.file?.[0] || error.response?.data?.file || error.message || 'Failed to import users'
            toast.error(message)
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const handleImport = () => {
        if (file) {
            importMutation.mutate(file)
        }
    }

    const handleClose = () => {
        setFile(null)
        setResult(null)
        onOpenChange(false)
    }

    const downloadTemplate = () => {
        const templateData = [
            ['First Name', 'Last Name', 'Email', 'Phone'],
            ['John', 'Doe', 'john.doe@example.com', '+1234567890'],
            ['Jane', 'Smith', 'jane.smith@example.com', '+0987654321'],
        ]

        const csvContent = templateData.map(row => row.join(',')).join('\n')
        const blob = new Blob([csvContent], {type: 'text/csv'})
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'marketing_users_template.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='max-w-3xl max-h-[90vh] overflow-hidden flex flex-col'>
                <DialogHeader>
                    <DialogTitle>Import Users from Excel</DialogTitle>
                    <DialogDescription>
                        Upload an Excel file to import multiple users at once. {groupId && 'Users will be added to the selected group.'}
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4 flex-1 overflow-hidden flex flex-col'>
                    <div className='flex items-center gap-2'>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={downloadTemplate}
                        >
                            <Download className='size-4 mr-2'/>
                            Download Template
                        </Button>
                    </div>

                    <div className='border-2 border-dashed rounded-lg p-6 text-center'>
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='.xlsx,.xls'
                            onChange={handleFileChange}
                            className='hidden'
                        />
                        {file ? (
                            <div className='space-y-2'>
                                <p className='text-sm font-medium'>{file.name}</p>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Change File
                                </Button>
                            </div>
                        ) : (
                            <div className='space-y-2'>
                                <Upload className='size-8 mx-auto text-muted-foreground'/>
                                <div>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Select Excel File
                                    </Button>
                                </div>
                                <p className='text-xs text-muted-foreground'>
                                    Supported formats: .xlsx, .xls
                                </p>
                            </div>
                        )}
                    </div>

                    {result && (
                        <div className='flex-1 overflow-hidden flex flex-col'>
                            <h3 className='font-semibold mb-2'>Import Results</h3>
                            <div className='grid grid-cols-3 gap-2 mb-4'>
                                <div className='bg-green-50 p-3 rounded-lg border border-green-200'>
                                    <div className='flex items-center gap-2'>
                                        <CheckCircle className='size-4 text-green-600'/>
                                        <span className='text-sm font-medium'>Added</span>
                                    </div>
                                    <p className='text-2xl font-bold text-green-600'>{result.summary.added}</p>
                                </div>
                                <div className='bg-yellow-50 p-3 rounded-lg border border-yellow-200'>
                                    <div className='flex items-center gap-2'>
                                        <AlertCircle className='size-4 text-yellow-600'/>
                                        <span className='text-sm font-medium'>Skipped</span>
                                    </div>
                                    <p className='text-2xl font-bold text-yellow-600'>{result.summary.skipped}</p>
                                </div>
                                <div className='bg-red-50 p-3 rounded-lg border border-red-200'>
                                    <div className='flex items-center gap-2'>
                                        <XCircle className='size-4 text-red-600'/>
                                        <span className='text-sm font-medium'>Failed</span>
                                    </div>
                                    <p className='text-2xl font-bold text-red-600'>{result.summary.failed}</p>
                                </div>
                            </div>

                            <ScrollArea className='flex-1'>
                                <div className='space-y-3'>
                                    {result.added.length > 0 && (
                                        <div>
                                            <h4 className='text-sm font-semibold text-green-600 mb-2'>Successfully Added</h4>
                                            {result.added.map((item) => (
                                                <div key={item.row} className='text-xs p-2 bg-green-50 rounded border border-green-200 mb-1'>
                                                    <span className='font-mono'>Row {item.row}:</span> {item.data.first_name} {item.data.last_name} - {item.data.email || item.data.phone}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {result.skipped.length > 0 && (
                                        <div>
                                            <h4 className='text-sm font-semibold text-yellow-600 mb-2'>Skipped</h4>
                                            {result.skipped.map((item) => (
                                                <div key={item.row} className='text-xs p-2 bg-yellow-50 rounded border border-yellow-200 mb-1'>
                                                    <div><span className='font-mono'>Row {item.row}:</span> {item.data.first_name} {item.data.last_name}</div>
                                                    <div className='text-yellow-700 mt-1'>Reason: {item.reason}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {result.failed.length > 0 && (
                                        <div>
                                            <h4 className='text-sm font-semibold text-red-600 mb-2'>Failed</h4>
                                            {result.failed.map((item) => (
                                                <div key={item.row} className='text-xs p-2 bg-red-50 rounded border border-red-200 mb-1'>
                                                    <div><span className='font-mono'>Row {item.row}:</span> {item.data.first_name} {item.data.last_name}</div>
                                                    <div className='text-red-700 mt-1'>Reason: {item.reason}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={handleClose}>
                        {result ? 'Close' : 'Cancel'}
                    </Button>
                    {!result && (
                        <Button
                            onClick={handleImport}
                            disabled={!file || importMutation.isPending}
                        >
                            {importMutation.isPending && <Loader2 className='size-4 mr-2 animate-spin'/>}
                            Import Users
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
