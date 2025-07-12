import {
  BarChartDataPoint,
  ChartDataPoint,
  DashboardStat,
} from "@/types/Admin";

export const dashboardStats: DashboardStat[] = [
  {
    label: "Total User",
    period: "from yesterday",
  },
  {
    label: "Total Like each other",
    period: "from yesterday",
  },
  {
    label: "Total Events",
    period: "from yesterday",
  },
  {
    label: "Pending User",
    period: "from yesterday",
  },
];

export const earningOverviewData: ChartDataPoint[] = [
  { value: 20, label: "5k" },
  { value: 35, label: "10k" },
  { value: 40, label: "15k" },
  { value: 65, label: "20k" },
  { value: 45, label: "25k" },
  { value: 50, label: "30k" },
  { value: 30, label: "35k" },
  { value: 60, label: "40k" },
  { value: 55, label: "45k" },
  { value: 50, label: "50k" },
  { value: 45, label: "55k" },
  { value: 48, label: "60k" },
];

export const monthlyProgressData: BarChartDataPoint[] = [
  { value: 40, label: "Jan" },
  { value: 50, label: "Feb" },
  { value: 60, label: "Mar" },
  { value: 90, label: "Apr" },
  { value: 10, label: "May" },
  { value: 80, label: "Jun", frontColor: "#4EC9B4" },
  { value: 70, label: "Jul" },
  { value: 40, label: "Aug" },
  { value: 60, label: "Sep", frontColor: "#FF5862" },
  { value: 80, label: "Oct" },
  { value: 30, label: "Nov" },
  { value: 20, label: "Dec" },
];
