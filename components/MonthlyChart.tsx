"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Transaction = {
  amount: number;
  type: string;
  transaction_date: string;
};

export default function MonthlyChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const monthlyData = transactions.reduce((acc: any[], item) => {
    const month = new Date(
      item.transaction_date
    ).toLocaleDateString("th-TH", {
      month: "short",
    });

    let existing = acc.find(
      (m) => m.month === month
    );

    if (!existing) {
      existing = {
        month,
        income: 0,
        expense: 0,
      };

      acc.push(existing);
    }

    if (item.type === "income") {
      existing.income += Number(item.amount);
    } else {
      existing.expense += Number(item.amount);
    }

    return acc;
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 p-8 mb-8">

      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-100 blur-3xl opacity-50"></div>

      <div className="relative z-10">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              📊 Financial Overview
            </h2>

            <p className="text-slate-500 mt-1">
              รายรับและรายจ่ายรายเดือน
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
            Monthly Report
          </div>

        </div>

        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <BarChart
            data={monthlyData}
            barGap={10}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.15}
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "#f8fafc",
              }}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.12)",
                padding: "12px",
              }}
            />

            <Legend />

            <Bar
              dataKey="income"
              name="💰 รายรับ"
              fill="#10b981"
              radius={[10, 10, 0, 0]}
            />

            <Bar
              dataKey="expense"
              name="💸 รายจ่าย"
              fill="#ef4444"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}