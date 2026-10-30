import { clickhouse } from "@/lib/clickhouse"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
    try {
        const { tenant } = await params

        const result = await clickhouse.query({
            query: `
                SELECT 
                    \`@timestamp\`,
                    coalesce(nullIf(tenant, ''), extract(raw, 'tenant=([a-zA-Z0-9]+)')) AS tenant_name,
                    source,
                    vendor,
                    event_type,
                    severity,
                    src_ip,
                    user,
                    host,
                    status_code,
                    raw
                FROM central_logs
                WHERE tenant = {tenant: String} 
                OR raw LIKE concat('%tenant=', {tenant: String}, '%')
                ORDER BY \`@timestamp\` DESC
                LIMIT 1000 OFFSET 0;
            `,
            query_params: {
                tenant: tenant,
            },
            format: 'JSONEachRow',
        })

        // แปลงผลลัพธ์เป็น JSON ก่อนตอบกลับ
        const data = await result.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error("ClickHouse Query Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        )
    }
}