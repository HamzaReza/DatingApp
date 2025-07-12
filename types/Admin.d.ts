export type DashboardStat = {
  label: string;
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

export type UserStatus = "approved" | "rejected" | "pending";

export type UserAdmin = {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  matchScore: number;
  phone: string;
  email: string;
  avatar: string; // image url or local asset
  bio?: string;
  status: UserStatus;
};

export type AdminEventGenre =
  | "comedy"
  | "music"
  | "theatre"
  | "sports"
  | "other";

export type AdminEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  genre: AdminEventGenre;
  creator: { id: string; label: string; image: string };
  image: string;
  normalTicket: number;
  vipTicket: number;
  price: number;
};

export type AdminPricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g., 'monthly', 'yearly', 'lifetime'
  features: string[];
};
