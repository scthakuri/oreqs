
export interface Group {
    id: number
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at: string
    created_by: number
    created_by_name: string
    members: number[]
    member_count: number
}

export interface GroupCreateData {
    name: string
    description?: string
    members?: number[]
    is_active?: boolean
}

export interface GroupUpdateData extends Partial<GroupCreateData> {}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}
