
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
import { format, parseISO, startOfWeek, startOfMonth,subDays, subMonths } from "date-fns";


import { useAdmin } from "../useAdmin";
import Header from "../../../components/ui/header";

export const AdminPanel = () => {
  const { organizations, fetchOrganizations} = useAdmin(); // fetch from backend
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("monthly");

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
                  
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as "daily" | "weekly" | "monthly")}
          className="rounded border p-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} className="border border-slate-600">
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis dataKey="date" stroke={chartColors.text} />
          <YAxis stroke={chartColors.text} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke={chartColors.line}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
          </div>
          
</div>
    </div>
  );
};





type GroupBy = "daily" | "weekly" | "monthly";

export const groupOrganizationsByTime = (
  orgs: { createdAt: string }[],
  range: GroupBy
): { date: string; count: number }[] => {
  const counts: Record<string, number> = {};

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

    counts[key] = (counts[key] || 0) + 1;
  });

  // Convert to array
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
