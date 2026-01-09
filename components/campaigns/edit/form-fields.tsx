'use client'

import {useState} from 'react'
import {useMutation, useQueryClient, UseQueryResult} from '@tanstack/react-query'
import {Card, CardContent} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Badge} from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {Plus, Trash2, Settings2} from 'lucide-react'
import {toast} from 'sonner'
import {formFieldsApi, FormField, FormFieldCreateData, FieldType} from '@/lib/api/marketing/form-fields'
import {Switch} from "@/components/ui/switch";
import TagInput from "@/components/ui/tag-input";

interface CampaignFormFieldsEditProps {
    campaignId: number
    formFieldsQuery: UseQueryResult<FormField[], Error>
    refreshFormFields: () => void
}

const CampaignFormFieldsEdit = ({
    campaignId,
    formFieldsQuery,
    refreshFormFields,
}: CampaignFormFieldsEditProps) => {
    const queryClient = useQueryClient()
    const [showFieldDialog, setShowFieldDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [editingField, setEditingField] = useState<FormField | null>(null)
    const [fieldToDelete, setFieldToDelete] = useState<FormField | null>(null)

    const [newField, setNewField] = useState<FormFieldCreateData>({
        label: '',
        field_type: 'text',
        is_required: false,
        options: [],
        is_primary: false
    })

    const createMutation = useMutation({
        mutationFn: (data: FormFieldCreateData) => formFieldsApi.create(campaignId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['campaign-form-fields', campaignId]})
            toast.success('Form field created successfully!')
            setShowFieldDialog(false)
            resetForm()
            refreshFormFields()
        },
        onError: () => {
            toast.error('Failed to create form field')
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({id, data}: { id: number; data: Partial<FormFieldCreateData> }) =>
            formFieldsApi.update(campaignId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['campaign-form-fields', campaignId]})
            toast.success('Form field updated successfully!')
            setShowFieldDialog(false)
            resetForm()
            refreshFormFields()
        },
        onError: () => {
            toast.error('Failed to update form field')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => formFieldsApi.delete(campaignId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['campaign-form-fields', campaignId]})
            toast.success('Form field deleted successfully!')
            setShowDeleteDialog(false)
            setFieldToDelete(null)
            refreshFormFields()
        },
        onError: () => {
            toast.error('Failed to delete form field')
        },
    })

    const resetForm = () => {
        setNewField({
            label: '',
            field_type: 'text',
            is_required: false,
            options: [],
            is_primary: false
        })
        setEditingField(null)
    }

    const handleOpenDialog = (field?: FormField) => {
        if (field) {
            setEditingField(field)
            setNewField({
                label: field.label,
                field_type: field.field_type,
                is_required: field.is_required,
                options: field.options || [],
                is_primary: field.is_primary
            })
        } else {
            resetForm()
        }
        setShowFieldDialog(true)
    }

    const handleSaveField = () => {
        if (!newField.label.trim()) {
            toast.error('Please enter a field label')
            return
        }

        if (newField.field_type === 'select' && (!newField.options || newField.options.length === 0)) {
            toast.error('Please provide options for the select field')
            return
        }

        if (editingField) {
            updateMutation.mutate({
                id: editingField.id,
                data: newField,
            })
        } else {
            createMutation.mutate(newField)
        }
    }

    const handleDeleteClick = (field: FormField) => {
        setFieldToDelete(field)
        setShowDeleteDialog(true)
    }

    const handleConfirmDelete = () => {
        if (fieldToDelete) {
            deleteMutation.mutate(fieldToDelete.id)
        }
    }

    const fieldTypeLabels: Record<FieldType, string> = {
        text: 'Text Input',
        email: 'Email',
        phone: 'Phone Number',
        select: 'Dropdown Select',
        checkbox: 'Checkbox',
    }

    return (
        <div className='space-y-6 animate-in fade-in-50 duration-300'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>Registration Form</h1>
                    <p className='text-muted-foreground'>Customize user registration fields</p>
                </div>
                <Button onClick={() => handleOpenDialog()} size='lg'>
                    <Plus className='mr-2 size-4'/>
                    Add Field
                </Button>
            </div>

            {formFieldsQuery.isLoading ? (
                <Card>
                    <CardContent className='py-12 text-center'>
                        <p className='text-muted-foreground'>Loading form fields...</p>
                    </CardContent>
                </Card>
            ) : formFieldsQuery.error ? (
                <Card>
                    <CardContent className='py-12 text-center'>
                        <p className='text-destructive'>Failed to load form fields</p>
                    </CardContent>
                </Card>
            ) : (formFieldsQuery.data?.length || 0) === 0 ? (
                <Card>
                    <CardContent className='py-12 text-center'>
                        <p className='text-muted-foreground mb-4'>No form fields yet</p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className='mr-2 size-4'/>
                            Add Your First Field
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className='grid gap-4'>
                    {formFieldsQuery.data?.map((field, index) => (
                        <Card key={field.id} className='border-2 hover:shadow-md transition-all group'>
                            <CardContent className='flex items-center gap-4 px-4 py-0'>
                                <div
                                    className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold'>
                                    {index + 1}
                                </div>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-semibold'>{field.label}</span>
                                        {field.is_required && (
                                            <Badge variant='destructive' className='text-xs'>
                                                Required
                                            </Badge>
                                        )}
                                    </div>
                                    <p className='text-sm text-muted-foreground'>
                                        Type: {fieldTypeLabels[field.field_type]}
                                    </p>
                                </div>
                                <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() => handleOpenDialog(field)}
                                    >
                                        <Settings2 className='size-4'/>
                                    </Button>
                                    {
                                        !field.is_primary && <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => handleDeleteClick(field)}
                                        >
                                            <Trash2 className='size-4 text-destructive'/>
                                        </Button>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog
                open={showFieldDialog}
                onOpenChange={(open) => {
                    setShowFieldDialog(open)
                    if (!open) resetForm()
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingField ? 'Edit Field' : 'Add Form Field'}</DialogTitle>
                        <DialogDescription>Configure registration form field</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='fieldLabel'>Field Label *</Label>
                            <Input
                                id='fieldLabel'
                                value={newField.label}
                                onChange={(e) => setNewField({...newField, label: e.target.value})}
                                placeholder='e.g., Full Name, Phone Number'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='fieldType'>Field Type *</Label>
                            <Select
                                value={newField.field_type}
                                onValueChange={(value: FieldType) =>
                                    setNewField({...newField, field_type: value})
                                }
                                disabled={newField.is_primary}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='text'>Text Input</SelectItem>
                                    <SelectItem value='email'>Email</SelectItem>
                                    <SelectItem value='phone'>Phone Number</SelectItem>
                                    <SelectItem value='select'>Dropdown Select</SelectItem>
                                    <SelectItem value='checkbox'>Checkbox</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {newField.field_type === 'select' && (
                            <div className='space-y-2'>
                                <Label htmlFor='fieldOptions'>Options (comma-separated)</Label>
                                <TagInput
                                    value={newField.options || []}
                                    onChange={(options) => setNewField({...newField, options})}
                                    placeholder='Add option and press Enter'
                                />
                            </div>
                        )}
                        <div className='flex items-center justify-between p-4 border rounded-lg'>
                            <div>
                                <p className='font-medium'>Required Field</p>
                                <p className='text-sm text-muted-foreground'>User must fill this field</p>
                            </div>

                            <Switch
                                checked={newField.is_required}
                                disabled={newField.is_primary}
                                onCheckedChange={(v) =>
                                    setNewField({...newField, is_required: v})
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => setShowFieldDialog(false)}
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveField}
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {createMutation.isPending || updateMutation.isPending
                                ? 'Saving...'
                                : editingField
                                    ? 'Update Field'
                                    : 'Add Field'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the form field &#34;{fieldToDelete?.label}&#34;. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete Field'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default CampaignFormFieldsEdit