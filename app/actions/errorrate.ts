"use server";

import { clickhouse } from "@/lib/clickhouse";

export type ErrorRateData = {
    error_rate: number;
    total_errors: number;
};

export async function getErrorRate(): Promise<ErrorRateData> {
    const result = await clickhouse.query({
        query: `
            SELECT 
                round(
                    sum(if(status_code >= 400 OR event_type LIKE '%fail%' OR event_type LIKE '%deny%' OR event_type LIKE '%malware%', 1, 0)) * 100.0 / nullIf(count(), 0), 
                    2
                ) AS error_rate,
                sum(if(status_code >= 400 OR event_type LIKE '%fail%' OR event_type LIKE '%deny%' OR event_type LIKE '%malware%', 1, 0)) AS total_errors
            FROM central_logs
            WHERE \`@timestamp\` >= (SELECT max(\`@timestamp\`) FROM central_logs) - INTERVAL 1 HOUR;
        `,
        format: "JSONEachRow",
    });

    const rows = await result.json<ErrorRateData>();

    return rows[0] || { error_rate: 0, total_errors: 0 };
}