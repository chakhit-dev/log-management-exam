
"use client"

import { EventTimeLine } from "@/components/charts/eventTimeLine"
import { TopUser } from "@/components/charts/TopUser"
import { ChartRadialStacked } from "@/components/charts/RadisCharts"
import DashNav from "@/components/dashnavbar/DashNav"
import { RecentLogsTable } from "@/components/tables/RecentLogsTable"
import { AlertCircle, ArrowDownRight, ArrowUpRight, PanelRightOpen, ShieldAlert } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { EpsMetrics, getEpsMetrics } from "../actions/eps"
import { ErrorRateData, getErrorRate } from "../actions/errorrate"
import { CiticalData, getCriticalAlerts } from "../actions/criticalalerts"
import { BlockedData, getBlockedRequest } from "../actions/blockedrequests"
import { TopIPCharts } from "@/components/charts/TopIPCharts"
import { EventTypePieChart } from "@/components/charts/TopEventType"
import { getTopIp, TopIPData } from "../actions/topip"
import { getTopUser, TopUserData } from "../actions/topuser"
import { getTopEventType, TopEventTypeData } from "../actions/eventtype"
import { getTimeLine } from "../actions/tiimeline"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const alertCount = 2;

    const [metrics, setMetrics] = useState<EpsMetrics | null>(null);
    const [errorRates, setErrorRates] = useState<ErrorRateData | null>(null);
    const [criticalAlert, setCriticalAlert] = useState<CiticalData | null>(null);
    const [blockRequest, setBlockRequest] = useState<BlockedData | null>(null);

    const [topIP, setTopIP] = useState<TopIPData[] | null>(null);
    const [topUser, setTopUser] = useState<TopUserData[] | null>(null);
    const [topEventType, setTopEventType] = useState<TopEventTypeData[] | null>(null);

    useEffect(() => {
        getEpsMetrics()
            .then(setMetrics)
            .catch(console.error);

        getErrorRate()
            .then(setErrorRates)
            .catch(console.error);

        getCriticalAlerts()
            .then(setCriticalAlert)
            .catch(console.error)

        getBlockedRequest()
            .then(setBlockRequest)
            .catch(console.error)


        getTopIp()
            .then(setTopIP)
            .catch(console.error)
        getTopUser()
            .then(setTopUser)
            .catch(console.error)
        getTopEventType()
            .then(setTopEventType)
            .catch(console.error)
        getTimeLine(7)
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (!session) {
        return <p>You are not authorized to view this page!</p>
    }

    return (
        <div className="flex h-screen w-full overflow-hidden">

            <aside className="shrink-0">
                <DashNav />
            </aside>

            <main className="flex min-w-0 flex-1 flex-col">
                <header className="flex flex-row gap-2 h-12 w-full shrink-0 items-center border-b px-4 bg-white text-sm ">
                    <PanelRightOpen size={16} />
                    <div className="mt-0.5">Dashboard</div>
                </header>

                <section className="flex-1 overflow-auto p-4 flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-4">

                        <div className="rounded-lg border bg-white p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                                        Events Per Second
                                    </p>
                                    <div className="mt-1 flex items-baseline gap-1.5">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                                            {metrics?.current_eps}
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">/ second</span>
                                    </div>
                                </div>

                                {/* <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span>+12.0%</span>
                                </div> */}
                            </div>

                            <div className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                                <div>
                                    Peak: <span className="font-medium text-slate-700 dark:text-zinc-300">{metrics?.peak_eps}/s</span>
                                </div>
                                <div>
                                    Avg: <span className="font-medium text-slate-700 dark:text-zinc-300">{metrics?.avg_eps}/s</span>
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
                                            {errorRates?.error_rate ?? "--"}
                                        </span>

                                        <span className="text-xs text-slate-500 dark:text-zinc-400">
                                            percents
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                                <span>Past 1 hour • {errorRates?.total_errors ?? 0} errors</span>
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
                                            <span className="text-red-600">{criticalAlert?.critical_count}</span>
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">active</span>
                                    </div>
                                </div>


                                {/* <div className={`flex items-center gap-1 text-xs font-medium ${alertCount > 0
                                    ? "text-rose-600 dark:text-rose-400"
                                    : "text-emerald-600 dark:text-emerald-400"
                                    }`}>
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{alertCount > 0 ? "Requires action" : "All clear"}</span>
                                </div> */}
                            </div>

                            <div className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                                {/* <div>
                                    Unresolved: <span className="font-medium text-rose-600 dark:text-rose-400">2</span>
                                </div>
                                <div>
                                    Resolved (24h): <span className="font-medium text-slate-700 dark:text-zinc-300">5</span>
                                </div> */}
                                <div>Active threats detected.</div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                                        Blocked Requests
                                    </p>
                                    <div className="mt-1 flex items-baseline gap-1.5">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                                            {blockRequest?.total_blocked}
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">total</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>Mitigated</span>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                                <div>
                                    WAF: <span className="font-medium text-slate-700 dark:text-zinc-300">{blockRequest?.waf_count}</span>
                                </div>
                                <div>
                                    Rate Limit: <span className="font-medium text-slate-700 dark:text-zinc-300">{blockRequest?.rate_limit_count}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-3 min-h-0 grid grid-cols-1 gap-4">
                        <div className="col-span-1 h-full">
                            <EventTimeLine />
                        </div>
                    </div>

                    <div>
                        <div className="h-104 shrink-0 grid grid-cols-3 gap-4">
                            <TopIPCharts data={topIP} />
                            <TopUser data={topUser} />
                            <EventTypePieChart data={topEventType} />
                        </div>
                    </div>
                </section>



            </main>
        </div>
    )
}
