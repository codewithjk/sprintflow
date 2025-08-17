import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppSelector } from "../../../store/hooks";

import { useEffect, useState } from "react";
import {
  format,
  parseISO,
  startOfWeek,
  startOfMonth,
  subDays,
  subMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from "date-fns";

import { useAdmin } from "../useAdmin";
import Header from "../../../components/ui/header";

export const AdminPanel = () => {
  const {
    organizations,
    fetchOrganizations,
    subscriptions,
    fetchSubscriptions,
    charges,
    fetchCharges,
  } = useAdmin(); // fetch from backend
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">(
    "monthly"
  );
  useEffect(() => {
    fetchSubscriptions(10);
    fetchCharges(10);
  }, []);

  useEffect(() => {
    const now = new Date();
    let createdAfter = new Date();

    if (viewMode === "daily") {
      createdAfter = subDays(now, 1);
    } else if (viewMode === "weekly") {
      createdAfter = subDays(now, 7);
    } else if (viewMode === "monthly") {
      createdAfter = subMonths(now, 1);
    }

    fetchOrganizations({
      page: 1,
      limit: 1000,
      createdAt: {
        gte: createdAfter.toISOString(),
      },
    });
  }, [viewMode]);

  const chartData = groupOrganizationsByTime(organizations, viewMode);
  const chartColors = isDarkMode
    ? {
        line: "#82ca9d",
        text: "#ffffff",
        grid: "#444",
      }
    : {
        line: "#8884d8",
        text: "#000000",
        grid: "#ccc",
      };

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Admin Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 ">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <div className=" mb-4 flex items-center justify-between">
            <h3 className="mb-4 text-center pt-5 text-lg font-semibold dark:text-white">{`Organizations Created (${viewMode})`}</h3>

            <div className="inline-flex rounded-md shadow-sm" role="group">
              {["daily", "weekly", "monthly"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as GroupBy)}
                  className={`px-4 py-2 text-sm font-medium border ${
                    viewMode === mode
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-dark-secondary text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {chartData.length === 0 ? (
            <div className="flex h-[70vh] w-full items-center justify-center">
              <p className="select-none text-6xl font-extrabold tracking-wide text-gray-500/50 dark:text-gray-300/30 text-center">
                NO ORGANIZATIONS
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} className="border border-slate-600">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartColors.grid}
                />
                <XAxis
                  dataKey="date"
                  stroke={chartColors.text}
                  tickFormatter={(date) => {
                    if (viewMode === "monthly")
                      return format(new Date(date), "MMM yy");
                    if (viewMode === "weekly")
                      return format(new Date(date), "dd MMM");
                    return format(new Date(date), "dd MMM");
                  }}
                  angle={-20}
                  textAnchor="end"
                />

                <YAxis stroke={chartColors.text} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="natural"
                  dataKey="count"
                  name="Total Organizations "
                  stroke={chartColors.line}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

type GroupBy = "daily" | "weekly" | "monthly";

const generateDateRange = (range: GroupBy) => {
  const now = new Date();
  const start =
    range === "daily"
      ? subDays(now, 1)
      : range === "weekly"
      ? subDays(now, 7)
      : subMonths(now, 1);

  const end = now;

  let intervals: Date[] = [];
  if (range === "daily") {
    intervals = eachDayOfInterval({ start, end });
  } else if (range === "weekly") {
    intervals = eachWeekOfInterval({ start, end });
  } else {
    intervals = eachMonthOfInterval({ start, end });
  }

  return intervals.map((date) => {
    return {
      date:
        range === "monthly"
          ? format(date, "yyyy-MM")
          : format(date, "yyyy-MM-dd"),
      count: 0,
    };
  });
};

export const groupOrganizationsByTime = (
  orgs: { createdAt: string }[],
  range: GroupBy
): { date: string; count: number }[] => {
  const now = new Date();
  let start: Date;

  // Determine start date based on view mode
  if (range === "daily") {
    start = subDays(now, 7); // Last 7 days
  } else if (range === "weekly") {
    start = subMonths(now, 2); // Last 8 weeks
  } else {
    start = subMonths(now, 6); // Last 6 months
  }

  // Generate full list of time intervals
  let intervals: Date[] = [];
  if (range === "daily") {
    intervals = eachDayOfInterval({ start, end: now });
  } else if (range === "weekly") {
    intervals = eachWeekOfInterval({ start, end: now });
  } else {
    intervals = eachMonthOfInterval({ start, end: now });
  }

  // Initialize count map with 0
  const counts: Record<string, number> = {};
  intervals.forEach((date) => {
    const key =
      range === "daily"
        ? format(date, "yyyy-MM-dd")
        : range === "weekly"
        ? format(startOfWeek(date), "yyyy-MM-dd")
        : format(startOfMonth(date), "yyyy-MM");
    counts[key] = 0;
  });

  // Count real organization creation dates
  orgs.forEach((org) => {
    const date = parseISO(org.createdAt);
    let key: string;
    if (range === "daily") {
      key = format(date, "yyyy-MM-dd");
    } else if (range === "weekly") {
      key = format(startOfWeek(date), "yyyy-MM-dd");
    } else {
      key = format(startOfMonth(date), "yyyy-MM");
    }

    if (counts[key] !== undefined) {
      counts[key]++;
    }
  });

  // Convert to sorted array
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
