"use client"

import DashNav from "@/components/dashnavbar/DashNav";
import { FullLogsTable } from "@/components/tables/FullLogsTable";
import { PanelRightOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserMemberships, TenantMembership } from "../actions/getTenants";
import { useRouter } from "next/navigation";

export default function Logs() {
    const { data: session, status } = useSession();
    const [tenantData, setTenantData] = useState<TenantMembership[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (status !== "authenticated" || !session?.user?.id) {
            setLoading(false);
            return;
        }

        async function loadTenants() {
            try {
                const result = await getUserMemberships(Number(session?.user.id));

                if (result.success) {
                    setTenantData(result.data);
                }
            } catch (error) {
                console.error("Failed to load memberships:", error);
            } finally {
                setLoading(false);
            }
        }

        loadTenants();
    }, [session?.user?.id, status]);

    // useEffect(() => {
    //     console.log(tenantData)
    // }, [tenantData])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (status === "loading" || loading) {
        return <p>Loading...</p>;
    }

    if (status === "unauthenticated" || !session) {
        return <p>You are not authorized to view this page!</p>;
    }


    return (
        <div className="flex h-screen w-full overflow-hidden">

            <aside className="shrink-0">
                <DashNav />
            </aside>

            <main className="w-full h-full flex flex-col overflow-hidden">

                <header className="flex flex-row gap-2 h-12 w-full shrink-0 items-center border-b px-4 bg-white text-sm">
                    <PanelRightOpen size={16} />
                    <div className="mt-0.5">Log</div>
                </header>
                
                <div className="p-4 w-full flex-1 min-h-0 flex flex-col gap-4">

                    <div className="flex-1 min-h-0">
                        <FullLogsTable data={tenantData} />
                    </div>

                </div>
            </main>

        </div>
    )
}