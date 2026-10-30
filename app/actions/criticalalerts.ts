"use server"

import { clickhouse } from "@/lib/clickhouse";

export type CiticalData = {
    critical_count:number;
}

export async function getCriticalAlerts(): Promise<CiticalData>{
    const result = await clickhouse.query({
        query: `
            SELECT 
                count() AS critical_count
            FROM central_logs
            WHERE \`@timestamp\` >= (SELECT max(\`@timestamp\`) FROM central_logs) - INTERVAL 1 HOUR
            AND (severity >= 7 OR event_type LIKE '%malware%' OR event_type LIKE '%deny%');
        `,
        format: "JSONEachRow",
    });

    const rows = await result.json<CiticalData>();

    return rows[0] || { critical_count: 0 };
}