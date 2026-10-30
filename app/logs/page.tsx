"use client"

import DashNav from "@/components/dashnavbar/DashNav";
import { FullLogsTable } from "@/components/tables/FullLogsTable";
import { PanelRightOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserMemberships, TenantMembership } from "../actions/getTenants";

export default function Logs() {
    const { data: session, status } = useSession();
    const [tenantData, setTenantData] = useState<TenantMembership[]>([]);
    const [loading, setLoading] = useState(true);

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
                    
                    <div className="grid grid-cols-3 gap-4 shrink-0">
                        <div className="rounded-lg border bg-white p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                                        Events Per Second
                                    </p>
                                    <div className="mt-1 flex items-baseline gap-1.5">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                                            123
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">/ second</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                                <div>
                                    Peak: <span className="font-medium text-slate-700 dark:text-zinc-300">123/s</span>
                                </div>
                                <div>
                                    Avg: <span className="font-medium text-slate-700 dark:text-zinc-300">123/s</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                                        Error Rate
                                    </p>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                                            123
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-zinc-400">
                                            percents
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                                <span>Past 1 hour • 123 errors</span>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                                        Critical Alerts
                                    </p>
                                    <div className="mt-1 flex items-baseline gap-1.5">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                                            <span className="text-red-600">123</span>
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                                <div>Active threats detected.</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0">
                        <FullLogsTable data={tenantData} />
                    </div>

                </div>
            </main>

        </div>
    )
}