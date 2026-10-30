
"use server";

import { clickhouse } from "@/lib/clickhouse";

export type TopIPData = {
  src_ip: string;
  request_count: number;
};

export type TopIPProps = {
  data: TopIPData[] | null;
};

export async function getTopIp(): Promise<TopIPData[]> {
  const result = await clickhouse.query({
    query: `
      SELECT
        src_ip,
        count() AS request_count
      FROM central_logs
      WHERE \`@timestamp\` >= (
        SELECT max(\`@timestamp\`)
        FROM central_logs
      ) - INTERVAL 1 HOUR
        AND src_ip != '0.0.0.0'
      GROUP BY src_ip
      ORDER BY request_count DESC
      LIMIT 5
    `,
    format: "JSONEachRow",
  });

  const rows = await result.json<TopIPData>();

  return rows;
}
