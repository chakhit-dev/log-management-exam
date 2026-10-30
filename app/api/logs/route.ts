// app/api/logs/route.ts
import { NextResponse } from 'next/server';

interface bodyLogs {
    tenant_name?: string;
    limit?: number;
}

export async function POST(req: Request) {
    try {

        const body = await req.json();

        const tenant = body.tenant_name || "all";
        const limit = body.limit || 50;

        const clickhouseUrl = process.env.CLICKHOUSE_URL || "http://localhost:8123";
        const user = process.env.CLICKHOUSE_USER || "default";
        const password = process.env.CLICKHOUSE_PASSWORD || "zz112233";

        let query = `SELECT tenant, source, event_type, severity, src_ip, user, status_code, \`@timestamp\`, raw FROM log_manage_db.central_logs`;

        if (tenant && tenant !== "all") {
            query += ` WHERE tenant = '${tenant}'`;
        }

        query += ` ORDER BY \`@timestamp\` DESC LIMIT ${limit} FORMAT JSON`;

        console.log("Executing ClickHouse Query:", query);

        const response = await fetch(clickhouseUrl, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(`${user}:${password}`).toString("base64"),
                "Content-Type": "text/plain",
            },
            body: query,
            cache: "no-store",
        });

        const responseText = await response.text();

        if (!response.ok) {
            console.error("ClickHouse Error Response:", responseText);
            return NextResponse.json({ error: "ClickHouse error", details: responseText }, { status: 500 });
        }

        const data = JSON.parse(responseText);
        return NextResponse.json(data.data || []);

    } catch (error: any) {
        console.error("API 500 Error:", error.message);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}