'use client'

import {useState, useMemo, useCallback} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Badge} from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {Switch} from '@/components/ui/switch'
import {Globe, Plus, Search, MoreHorizontal, Upload, X, Flag, Loader2, ChevronLeft, ChevronRight} from 'lucide-react'
import {toast} from 'sonner'
import {countriesApi} from '@/lib/api/countries'
import type {Country} from '@/types/api'
import {usePermissions} from '@/hooks/use-permissions'
import {setBackendErrors} from '@/lib/error-handler'
import {countrySchema, type CountryFormData} from '@/lib/validation/country.schema'
import type {ApiError} from '@/types/errors'
import type {CountryCreateData} from '@/types/api'

const Page = () => {
    const {getCRUDPermissions} = usePermissions()
    const permissions = getCRUDPermissions('countries')
    const queryClient = useQueryClient()

    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [editingCountry, setEditingCountry] = useState<Country | null>(null)
    const [deletingCountry, setDeletingCountry] = useState<Country | null>(null)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: {errors: formErrors},
        reset,
        setValue,
        watch,
        setError,
    } = useForm<CountryFormData>({
        resolver: zodResolver(countrySchema),
        defaultValues: {
            name: '',
            code: '',
            dial_code: '',
            currency_code: '',
            currency_symbol: '',
            flag: null,
            domain: null,
            is_active: true,
        },
    })

    const flagValue = watch('flag')

    const {data: countriesData, isLoading, refetch} = useQuery({
        queryKey: ['countries', searchQuery, page],
        queryFn: () => countriesApi.list({
            search: searchQuery || undefined,
            ordering: 'name',
            page: page,
        }),
    })

    const countries = countriesData?.results || []
    const totalCountries = countriesData?.count || 0
    const totalPages = countriesData?.total_pages || 0
    const currentPage = countriesData?.current_page || 1

    const totalStats = useMemo(
        () =>
            countries.reduce(
                (acc, country) => ({
                    dealers: acc.dealers + country.dealers_count,
                    clients: acc.clients + country.clients_count,
                    branches: acc.branches + country.branches_count,
                }),
                {dealers: 0, clients: 0, branches: 0}
            ),
        [countries]
    )

    const handleSearch = useCallback((value: string) => {
        setSearchQuery(value)
        setPage(1)
    }, [])

    const createMutation = useMutation({
        mutationFn: (data: CountryCreateData | FormData) => countriesApi.create(data),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['countries']})
            void refetch()
            toast.success('Country added successfully!', {
                description: `${data.name} has been added to the system.`
            })
            setShowAddDialog(false)
            reset()
            setUploadedFile(null)
        },
        onError: (error: ApiError) => {
            console.error('Failed to create country:', error)
            setBackendErrors(error, setError)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({id, data}: {id: number; data: Partial<CountryCreateData> | FormData}) =>
            countriesApi.update(id, data),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['countries']})
            void refetch()
            toast.success('Country updated successfully!', {
                description: `${data.name} has been updated.`
            })
            setShowAddDialog(false)
            reset()
            setUploadedFile(null)
        },
        onError: (error: ApiError) => {
            console.error('Failed to update country:', error)
            setBackendErrors(error, setError)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => countriesApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['countries']})
            toast.success(`${deletingCountry?.name} has been deleted`)
            void refetch()
            setShowDeleteDialog(false)
            setDeletingCountry(null)
        },
        onError: (error: ApiError) => {
            console.error('Failed to delete country:', error)
            const errorData = error.response?.data
            const message =
                (errorData && 'message' in errorData && typeof errorData.message === 'string')
                    ? errorData.message
                    : 'Failed to delete country'
            toast.error(message)
        }
    })

    const handleFlagUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Flag image size should be less than 1MB')
                return
            }
            setUploadedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setValue('flag', reader.result as string)
            }
            reader.readAsDataURL(file)
            toast.success('Flag uploaded successfully')
        }
    }, [setValue])

    const handleRemoveFlag = useCallback(() => {
        setValue('flag', null)
        setUploadedFile(null)
        toast.success('Flag removed')
    }, [setValue])

    const onSubmit = useCallback((data: CountryFormData) => {
        let submitData: CountryCreateData | Partial<CountryCreateData> | FormData

        if (uploadedFile) {
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('code', data.code)
            formData.append('dial_code', data.dial_code)
            formData.append('is_active', String(data.is_active))

            if (data.currency_code) formData.append('currency_code', data.currency_code)
            if (data.currency_symbol) formData.append('currency_symbol', data.currency_symbol)
            if (data.domain) formData.append('domain', data.domain)

            formData.append('flag', uploadedFile)
            submitData = formData
        } else {
            const {flag, ...restData} = data
            submitData = editingCountry?.flag === flag ? restData : data
        }

        if (editingCountry) {
            updateMutation.mutate({id: editingCountry.id, data: submitData as Partial<CountryCreateData> | FormData})
        } else {
            createMutation.mutate(submitData as CountryCreateData | FormData)
        }
    }, [editingCountry, uploadedFile, updateMutation, createMutation])

    const handleEdit = useCallback((country: Country) => {
        setEditingCountry(country)
        reset({
            name: country.name,
            code: country.code,
            dial_code: country.dial_code,
            currency_code: country.currency_code || '',
            currency_symbol: country.currency_symbol || '',
            flag: country.flag,
            domain: country.domain,
            is_active: country.is_active,
        })
        setShowAddDialog(true)
    }, [reset])

    const handleDeleteClick = useCallback((country: Country) => {
        if (country.clients_count > 0 || country.dealers_count > 0 || country.branches_count > 0) {
            toast.error('Cannot delete country with active records', {
                description: `This country has ${country.clients_count} clients, ${country.dealers_count} dealers, and ${country.branches_count} branches.`
            })
            return
        }
        setDeletingCountry(country)
        setShowDeleteDialog(true)
    }, [])

    const handleDelete = useCallback(() => {
        if (!deletingCountry) return
        deleteMutation.mutate(deletingCountry.id)
    }, [deletingCountry, deleteMutation])

    const handleToggleStatus = useCallback((country: Country) => {
        const newStatus = !country.is_active

        if (!newStatus && (country.clients_count > 0 || country.dealers_count > 0)) {
            toast.error('Cannot deactivate country with active clients or dealers')
            return
        }

        updateMutation.mutate({id: country.id, data: {is_active: newStatus}})
    }, [updateMutation])

    const handleDialogClose = useCallback((open: boolean) => {
        setShowAddDialog(open)
        if (!open) {
            reset()
            setEditingCountry(null)
            setUploadedFile(null)
        }
    }, [reset])

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                    <Globe className='size-5 text-primary'/>
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Countries Management</h1>
                    <p className='text-muted-foreground'>Manage supported countries and regions</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Countries</CardTitle>
                        <Globe className='size-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalCountries}</div>
                        <p className='text-xs text-muted-foreground'>Configured regions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Dealers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStats.dealers}</div>
                        <p className='text-xs text-muted-foreground'>Across all countries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStats.clients}</div>
                        <p className='text-xs text-muted-foreground'>Across all countries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Branches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStats.branches}</div>
                        <p className='text-xs text-muted-foreground'>Across all countries</p>
                    </CardContent>
                </Card>
            </div>

            {/* Countries Table */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>All Countries</CardTitle>
                            <CardDescription>
                                {searchQuery ? `Found ${countries.length} countries` : `Showing ${countries.length} countries`}
                            </CardDescription>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative'>
                                <Search className='absolute left-2 top-2.5 size-4 text-muted-foreground'/>
                                <Input
                                    placeholder='Search countries...'
                                    className='pl-8 w-[250px]'
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            {permissions.canCreate && (
                                <Dialog open={showAddDialog} onOpenChange={handleDialogClose}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className='mr-2 size-4'/>
                                            Add Country
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
                                        <DialogHeader>
                                            <DialogTitle>
                                                {editingCountry ? 'Edit Country' : 'Add New Country'}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {editingCountry
                                                    ? 'Update country information and settings'
                                                    : 'Add a new country to the system'}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className='space-y-4 py-4'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='flag'>Country Flag</Label>
                                                <div className='flex items-center gap-4'>
                                                    {flagValue ? (
                                                        <div className='relative'>
                                                            <img
                                                                src={flagValue}
                                                                alt='Flag'
                                                                className='size-16 object-cover rounded border-2 border-border'
                                                            />
                                                            <Button
                                                                variant='destructive'
                                                                size='icon'
                                                                className='absolute -top-2 -right-2 size-6'
                                                                onClick={handleRemoveFlag}
                                                                type='button'
                                                            >
                                                                <X className='size-3'/>
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className='size-16 rounded border-2 border-dashed border-border flex items-center justify-center bg-muted'>
                                                            <Flag className='size-6 text-muted-foreground'/>
                                                        </div>
                                                    )}
                                                    <div className='flex-1'>
                                                        <div className='relative'>
                                                            <input
                                                                type='file'
                                                                accept='image/*'
                                                                onChange={handleFlagUpload}
                                                                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                                                id='flag'
                                                            />
                                                            <Button variant='outline' size='sm' className='w-full' type='button'>
                                                                <Upload className='mr-2 size-4'/>
                                                                Upload Flag
                                                            </Button>
                                                        </div>
                                                        <p className='text-xs text-muted-foreground mt-1'>
                                                            PNG, JPG up to 1MB
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='grid gap-4 md:grid-cols-2'>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='name'>Country Name *</Label>
                                                    <Input
                                                        id='name'
                                                        placeholder='United States'
                                                        {...register('name')}
                                                    />
                                                    {formErrors.name && (
                                                        <p className='text-sm text-destructive'>{formErrors.name.message}</p>
                                                    )}
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='code'>Country Code *</Label>
                                                    <Input
                                                        id='code'
                                                        placeholder='US'
                                                        {...register('code')}
                                                        onChange={(e) => setValue('code', e.target.value.toUpperCase())}
                                                    />
                                                    {formErrors.code && (
                                                        <p className='text-sm text-destructive'>{formErrors.code.message}</p>
                                                    )}
                                                    {!formErrors.code && (
                                                        <p className='text-xs text-muted-foreground'>e.g., US, UK, IN</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='grid gap-4 md:grid-cols-2'>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='dial_code'>Dial Code *</Label>
                                                    <Input
                                                        id='dial_code'
                                                        placeholder='+1'
                                                        {...register('dial_code')}
                                                    />
                                                    {formErrors.dial_code && (
                                                        <p className='text-sm text-destructive'>{formErrors.dial_code.message}</p>
                                                    )}
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='domain'>Domain</Label>
                                                    <Input
                                                        id='domain'
                                                        placeholder='example.com'
                                                        {...register('domain')}
                                                    />
                                                    {formErrors.domain && (
                                                        <p className='text-sm text-destructive'>{formErrors.domain.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='grid gap-4 md:grid-cols-2'>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='currency_code'>Currency Code</Label>
                                                    <Input
                                                        id='currency_code'
                                                        placeholder='USD'
                                                        maxLength={3}
                                                        {...register('currency_code')}
                                                        onChange={(e) => setValue('currency_code', e.target.value.toUpperCase())}
                                                    />
                                                    {formErrors.currency_code && (
                                                        <p className='text-sm text-destructive'>{formErrors.currency_code.message}</p>
                                                    )}
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='currency_symbol'>Currency Symbol</Label>
                                                    <Input
                                                        id='currency_symbol'
                                                        placeholder='$'
                                                        {...register('currency_symbol')}
                                                    />
                                                    {formErrors.currency_symbol && (
                                                        <p className='text-sm text-destructive'>{formErrors.currency_symbol.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className='flex items-center justify-between'>
                                                <div className='space-y-0.5'>
                                                    <Label>Active Status</Label>
                                                    <p className='text-sm text-muted-foreground'>
                                                        Make this country available
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={watch('is_active')}
                                                    onCheckedChange={(checked) => setValue('is_active', checked)}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex justify-end gap-2'>
                                            <Button variant='outline' onClick={() => handleDialogClose(false)} disabled={createMutation.isPending || updateMutation.isPending}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleFormSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending}>
                                                {(createMutation.isPending || updateMutation.isPending) ? (
                                                    <>
                                                        <Loader2 className='mr-2 size-4 animate-spin'/>
                                                        {editingCountry ? 'Updating...' : 'Adding...'}
                                                    </>
                                                ) : (
                                                    editingCountry ? 'Update Country' : 'Add Country'
                                                )}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Country</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Dial Code</TableHead>
                                <TableHead>Stats (D / C / B)</TableHead>
                                <TableHead className='text-right'>Status</TableHead>
                                {(permissions.canUpdate || permissions.canDelete) && (
                                    <TableHead className='text-right'>Actions</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center py-8'>
                                        <Loader2 className='size-6 animate-spin mx-auto text-muted-foreground'/>
                                    </TableCell>
                                </TableRow>
                            ) : countries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                                        {searchQuery ? 'No countries found matching your search' : 'No countries available'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                countries.map((country) => (
                                    <TableRow key={country.id}>
                                        <TableCell>
                                            <div className='flex items-center gap-2'>
                                                {country.flag ? (
                                                    <img
                                                        src={country.flag}
                                                        alt={country.name}
                                                        className='size-6 object-cover rounded border'
                                                    />
                                                ) : (
                                                    <Flag className='size-6 text-muted-foreground'/>
                                                )}
                                                <span className='font-medium'>{country.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant='outline'>{country.code}</Badge>
                                        </TableCell>
                                        <TableCell className='text-sm text-muted-foreground'>
                                            {country.dial_code}
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                                <span className='font-medium'>{country.dealers_count}</span>
                                                <span>/</span>
                                                <span className='font-medium'>{country.clients_count}</span>
                                                <span>/</span>
                                                <span className='font-medium'>{country.branches_count}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <Badge variant={country.is_active ? 'default' : 'secondary'}>
                                                {country.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        {(permissions.canUpdate || permissions.canDelete) && (
                                            <TableCell className='text-right'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant='ghost' size='icon'>
                                                            <MoreHorizontal className='size-4'/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align='end'>
                                                        {permissions.canUpdate && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleEdit(country)}>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleToggleStatus(country)}
                                                                >
                                                                    {country.is_active ? 'Deactivate' : 'Activate'}
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {permissions.canDelete && (
                                                            <DropdownMenuItem
                                                                className='text-destructive'
                                                                onClick={() => handleDeleteClick(country)}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                {totalPages > 1 && (
                    <div className='flex items-center justify-between px-6 py-4 border-t'>
                        <div className='text-sm text-muted-foreground'>
                            Page {currentPage} of {totalPages} ({totalCountries} total countries)
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || isLoading}
                            >
                                <ChevronLeft className='size-4 mr-1'/>
                                Previous
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || isLoading}
                            >
                                Next
                                <ChevronRight className='size-4 ml-1'/>
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {deletingCountry?.name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingCountry(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Delete Country
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Page
