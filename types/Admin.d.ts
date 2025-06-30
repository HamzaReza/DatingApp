export type DashboardStat = {
  label: string;
  value: string;
  change: number;
  period: string;
};

export type ChartDataPoint = {
  value: number;
  label: string;
};

export type BarChartDataPoint = {
  value: number;
  label: string;
  frontColor?: string;
};
