interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
}