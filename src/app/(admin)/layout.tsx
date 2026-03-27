export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar Desktop — se implementa en Fase 03 */}
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            {/* BottomNav Mobile — se implementa en Fase 03 */}
        </div>
    );
}
