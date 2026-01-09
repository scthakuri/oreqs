'use client';

import { useAuth } from '@/context/auth-provider';
import { ConfirmDialog } from '@/components/confirm-dialog';

interface SignOutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
    const { logout } = useAuth();

    const handleSignOut = async () => {
        await logout();
        onOpenChange(false);
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title='Sign out'
            desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
            confirmText='Sign out'
            destructive
            handleConfirm={handleSignOut}
            className='sm:max-w-sm'
        />
    );
}