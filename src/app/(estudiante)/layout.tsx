import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function EstudianteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
