export const CPU_USAGE_QUERY = `timeseries cpuAvg = avg(host.cpu.usage), by:{dt.entity.host, host.name}
| dedup dt.entity.host
| fieldsRename hostId = dt.entity.host, hostName = host.name
| lookup [
  timeseries {
    idle=avg(host.cpu.idle),
    ioWait=avg(host.cpu.iowait),
    user=avg(host.cpu.user),
    system=avg(host.cpu.system),
    steal=avg(host.cpu.steal)
  },
  by:{dt.entity.host}
  | fieldsAdd idle = arrayAvg(idle), ioWait = arrayAvg(ioWait), user = arrayAvg(user), system = arrayAvg(system), steal = arrayAvg(steal)
  | fieldsAdd other = 100 - idle - ioWait - user - system - steal
], sourceField:hostId, lookupField:dt.entity.host, fields:{idle, ioWait, user, system, steal, other}`;

export const getHostCpuUsageQuery = (hostId: string) => `timeseries {
    idle=avg(host.cpu.idle),
    ioWait=avg(host.cpu.iowait),
    user=avg(host.cpu.user),
    system=avg(host.cpu.system),
    steal=avg(host.cpu.steal)
  },
  filter:{dt.entity.host == "${hostId}"}
  | fieldsAdd other = 100 - idle[] - ioWait[] - user[] - system[] - steal[]`;

export const getHostAvgCpuQuery = (hostId: string) =>
  `timeseries cpuAvg = avg(host.cpu.usage), filter:{dt.entity.host == "${hostId}"}`;
