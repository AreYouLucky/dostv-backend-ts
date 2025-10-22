import { Head } from "@inertiajs/react"
import AppLogo from "@/components/app-logo"

export default function GuestLayout({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:pt-7 poppins-regular">
                <div className="w-full max-w-sm rounded-lg bg-gray-900/90 px-10 pt-15 pb-10 border border-gray-700">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="space-y-2 text-center">
                                <div className="">
                                    <AppLogo />
                                </div>
                                <p className="text-center text-sm text-muted-foreground">
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}
