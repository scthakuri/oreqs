import {LoginForm} from "@/components/auth/login-form"
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <Image
                        src="/branding/logo.svg"
                        alt="Logo"
                        width={400}
                        height={100}
                        className="w-52 h-auto dark:invert dark:brightness-0"
                    />
                </Link>
                <LoginForm/>
            </div>
        </div>
    )
}
