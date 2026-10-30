"use server";

import { clickhouse } from "@/lib/clickhouse";

export type EpsMetrics = {
  current_eps: number;
  peak_eps: number;
  avg_eps: number;
};

export async function getEpsMetrics(): Promise<EpsMetrics> {
  const result = await clickhouse.query({
    query: `
      SELECT
        (
          SELECT count()
          FROM central_logs
          WHERE toStartOfSecond(\`@timestamp\`) = (
            SELECT max(toStartOfSecond(\`@timestamp\`))
            FROM central_logs
          )
        ) AS current_eps,

        ifNull(max(eps_per_sec), 0) AS peak_eps,

        ifNull(round(avg(eps_per_sec), 2), 0) AS avg_eps

      FROM (
        SELECT
          toStartOfSecond(\`@timestamp\`) AS log_second,
          count() AS eps_per_sec
        FROM central_logs
        WHERE \`@timestamp\` >= (
          SELECT max(\`@timestamp\`)
          FROM central_logs
        ) - INTERVAL 1 HOUR
        GROUP BY log_second
      )
    `,
    format: "JSONEachRow",
  });

  const rows = await result.json<EpsMetrics>();

  return rows[0] ?? {
    current_eps: 0,
    peak_eps: 0,
    avg_eps: 0,
  };
}