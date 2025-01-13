import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { TitleBar } from "@dynatrace/strato-components-preview/layouts";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import { IntentButton } from "@dynatrace/strato-components/buttons";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import {
  CPU_USAGE_QUERY,
  getHostAvgCpuQuery,
  getHostCpuUsageQuery,
} from "../queries";
import { convertToTimeseries } from "@dynatrace/strato-components-preview/conversion-utilities";
import {
  DataTable,
  TableColumn,
  TableRow,
} from "@dynatrace/strato-components-preview/tables";
import { Colors } from "@dynatrace/strato-design-tokens";

export const HostList = () => {
  const result = useDqlQuery({
    body: {
      query: CPU_USAGE_QUERY,
    },
  });

  const columns: TableColumn[] = [
    {
      header: "Host ID",
      accessor: "hostId",
      autoWidth: true,
    },
    {
      header: "Host name",
      accessor: "hostName",
      autoWidth: true,
    },
    {
      id: "cpuUsage",
      header: "CPU Usage",
      columnType: "meterbar",
      accessor: ({ idle, ioWait, user, system, steal, other }) => [
        { name: "CPU idle", value: idle },
        { name: "I/O wait", value: ioWait },
        { name: "CPU user", value: user },
        { name: "CPU system", value: system },
        { name: "CPU steal", value: steal },
        { name: "CPU other", value: other },
      ],
      config: {
        showTooltip: true,
      },
      ratioWidth: 1,
    },
    {
      id: "cpuAvg",
      header: "Average CPU %",
      columnType: "sparkline",
      accessor: (row) =>
        result.data ? convertToTimeseries([row], result.data.types) : [],
      config: {
        color: Colors.Charts.Rainbow.Magenta.Default,
      },
      ratioWidth: 1,
    },
  ];

  return (
    <Flex width="100%" flexDirection="column" justifyContent="center" gap={16}>
      <TitleBar>
        <TitleBar.Title>Hosts Insights</TitleBar.Title>
      </TitleBar>
      {result.isLoading && <ProgressCircle />}
      {result.data && (
        <DataTable data={result.data.records} columns={columns}>
          <DataTable.UserActions>
            <DataTable.RowActions>
              {(row: TableRow) => (
                <IntentButton
                  payload={{
                    "dt.elements": [
                      {
                        "dt.markdown": `# Host ${row.values.hostName} insights`,
                      },
                      {
                        "dt.query": getHostCpuUsageQuery(row.values.hostId),
                        visualization: "areaChart",
                      },
                      {
                        "dt.query": getHostAvgCpuQuery(row.values.hostId),
                      },
                    ],
                  }}
                />
              )}
            </DataTable.RowActions>
          </DataTable.UserActions>
          <DataTable.Pagination />
        </DataTable>
      )}
    </Flex>
  );
};
