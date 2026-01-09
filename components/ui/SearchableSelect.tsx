import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Check, ChevronsUpDown, Loader2} from 'lucide-react';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';
import {useQuery} from '@tanstack/react-query';
import {axiosClient} from '@/lib/axios-client';
import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    total_pages: number;
    current_page: number;
    page_size: number;
    results: T[];
}

interface Option {
    value: string | number;
    label: string;
}

type BaseProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    disabled?: boolean;
    className?: string;
    multiple?: boolean;
    debounceMs?: number;
    onValueChange?: (value: string | number | (string | number)[]) => void;
};

type StaticSelectProps<T extends FieldValues> = BaseProps<T> & {
    options: Option[];
    fetchUrl?: never;
    valueKey?: never;
    labelKey?: never;
    queryKey?: never;
    queryParams?: never;
};

type ApiSelectProps<T extends FieldValues> = BaseProps<T> & {
    options?: never;
    fetchUrl: string;
    valueKey?: string;
    labelKey?: string;
    queryKey?: string[];
    queryParams?: Record<string, string | number | boolean>;
};

type SearchableSelectProps<T extends FieldValues> = StaticSelectProps<T> | ApiSelectProps<T>;

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function SearchableSelect<T extends FieldValues>(props: SearchableSelectProps<T>) {
    const {
        name,
        control,
        placeholder = 'Select option...',
        searchPlaceholder = 'Search...',
        emptyText = 'No option found.',
        disabled = false,
        className = '',
        multiple = false,
        debounceMs = 300,
        onValueChange,
    } = props;

    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, debounceMs);

    const isApiSelect = useMemo(() => 'fetchUrl' in props && Boolean(props.fetchUrl), [props]);
    const fetchUrl = useMemo(() => (isApiSelect ? props.fetchUrl : undefined), [isApiSelect, props]);
    const valueKey = useMemo(() => (isApiSelect ? props.valueKey || 'id' : 'id'), [isApiSelect, props]);
    const labelKey = useMemo(() => (isApiSelect ? props.labelKey || 'name' : 'name'), [isApiSelect, props]);
    const queryKey = useMemo(() => (isApiSelect ? props.queryKey || ['select-options'] : ['select-options']), [isApiSelect, props]);
    const queryParams = useMemo(() => (isApiSelect ? props.queryParams || {} : {}), [isApiSelect, props]);
    const staticOptions = useMemo(() => (!isApiSelect ? props.options : []), [isApiSelect, props]);

    const getNestedValue = useCallback((obj: Record<string, unknown>, path: string): string | number => {
        if( path.indexOf('.') === -1 ) {
            return (obj[path] as string | number) || '';
        }

        const keys = path.split('.');
        let value: unknown = obj;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = (value as Record<string, unknown>)[key];
            } else {
                return '';
            }
        }

        return value as string | number;
    }, []);

    const fetchOptions = useCallback(async () => {
        if (!fetchUrl) return [];

        const params: Record<string, string | number | boolean> = {...queryParams};
        if (debouncedSearch) {
            params.search = debouncedSearch;
        }

        const response = await axiosClient.get<PaginatedResponse<Record<string, unknown>>>(fetchUrl, {params});

        return response.data.results.map((item: Record<string, unknown>) => ({
            value: getNestedValue(item, valueKey),
            label: String(getNestedValue(item, labelKey)),
        })) as Option[];
    }, [fetchUrl, debouncedSearch, valueKey, labelKey, queryParams, getNestedValue]);

    const {data, isLoading, error} = useQuery({
        queryKey: [...queryKey, fetchUrl, debouncedSearch],
        queryFn: fetchOptions,
        enabled: Boolean(fetchUrl) && open && !disabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    const allOptions = useMemo(() => {
        if (fetchUrl) {
            return data || [];
        }
        return staticOptions || [];
    }, [fetchUrl, data, staticOptions]);

    const getDisplayValue = useCallback((value: string | number | (string | number)[] | undefined) => {
        if (!value) return placeholder;

        if (multiple && Array.isArray(value)) {
            if (value.length === 0) return placeholder;
            return `${value.length} selected`;
        }

        const selectedOption = allOptions.find((opt) => opt.value === value);
        return selectedOption?.label || placeholder;
    }, [placeholder, multiple, allOptions]);

    const handleSelect = useCallback((fieldValue: string | number | (string | number)[] | undefined, optionValue: string | number) => {
        if (multiple) {
            const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
            const isSelected = currentValues.includes(optionValue);

            return isSelected
                ? currentValues.filter((v) => v !== optionValue)
                : [...currentValues, optionValue];
        }

        return optionValue;
    }, [multiple]);

    const isSelected = useCallback((fieldValue: string | number | (string | number)[] | undefined, optionValue: string | number) => {
        if (multiple && Array.isArray(fieldValue)) {
            return fieldValue.includes(optionValue);
        }
        return fieldValue === optionValue;
    }, [multiple]);

    const handleOpenChange = useCallback((newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setSearchQuery('');
        }
    }, []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const handleOptionSelect = useCallback((fieldValue: string | number | (string | number)[] | undefined, fieldOnChange: (value: string | number | (string | number)[]) => void, optionValue: string | number) => {
        const newValue = handleSelect(fieldValue, optionValue);
        fieldOnChange(newValue);

        if (onValueChange) {
            onValueChange(newValue);
        }

        if (!multiple) {
            setOpen(false);
            setSearchQuery('');
        }
    }, [handleSelect, multiple, onValueChange]);

    return (
        <Controller
            name={name}
            control={control}
            render={({field}) => (
                <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn('w-full justify-between', className)}
                            disabled={disabled || isLoading}
                        >
                            {isLoading && open ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <span className="truncate">{getDisplayValue(field.value)}</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command shouldFilter={false}>
                            <CommandInput
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onValueChange={handleSearchChange}
                            />
                            {error ? (
                                <CommandEmpty>Error loading options</CommandEmpty>
                            ) : isLoading ? (
                                <div className="py-6 text-center text-sm">
                                    <Loader2 className="mx-auto h-4 w-4 animate-spin"/>
                                </div>
                            ) : allOptions.length === 0 ? (
                                <CommandEmpty>{emptyText}</CommandEmpty>
                            ) : (
                                <CommandGroup className="max-h-64 overflow-auto">
                                    {allOptions.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={String(option.value)}
                                            onSelect={() => handleOptionSelect(field.value, field.onChange, option.value)}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    isSelected(field.value, option.value) ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        />
    );
}