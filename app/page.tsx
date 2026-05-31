"use client";

import MonthlyChart from "@/components/MonthlyChart";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Transaction = {
  id: number;
  user_id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  transaction_date: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [email, setEmail] = useState("");

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState(
  new Date().toLocaleDateString("sv-SE")
  );

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setEmail(user.email || "");

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setTransactions(data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("กรุณาเข้าสู่ระบบ");
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          type,
          amount: Number(amount),
          category,
          description,
          transaction_date: date,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setAmount("");
    setCategory("");
    setDescription("");

    loadData();
  }

  async function deleteData(id: number) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-8">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              💰 Expense Tracker
            </h1>

            <p className="text-slate-500 mt-2">
              {email}
            </p>
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            ออกจากระบบ
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-3xl shadow-xl p-6 border border-green-100">
            <p className="text-green-600 font-medium">
              💰 รายรับ
            </p>

            <h2 className="text-4xl font-bold text-green-700 mt-3">
              {income.toLocaleString()}
            </h2>

            <p className="text-slate-500 mt-2">
              บาท
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 border border-red-100">
            <p className="text-red-600 font-medium">
              💸 รายจ่าย
            </p>

            <h2 className="text-4xl font-bold text-red-700 mt-3">
              {expense.toLocaleString()}
            </h2>

            <p className="text-slate-500 mt-2">
              บาท
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 border border-blue-100">
            <p className="text-blue-600 font-medium">
              🏦 คงเหลือ
            </p>

            <h2 className="text-4xl font-bold text-blue-700 mt-3">
              {balance.toLocaleString()}
            </h2>

            <p className="text-slate-500 mt-2">
              บาท
            </p>
          </div>

        </div>

        {/* Chart */}
        <MonthlyChart transactions={transactions} />

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-5 text-black">
            ➕ เพิ่มรายการ
          </h2>

          <div className="grid md:grid-cols-5 gap-4">

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-black"
            >
              <option value="income">รายรับ</option>
              <option value="expense">รายจ่าย</option>
            </select>

            <input
              type="number"
              placeholder="จำนวนเงิน"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-black"
            />

            <input
              placeholder="หมวดหมู่"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-black"
            />

            <input
              placeholder="รายละเอียด"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-black"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 text-black"
            />

          </div>

          <button
            onClick={addData}
            className="mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            เพิ่มรายการ
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <table className="w-full">

            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-black">
                <th className="p-4">วันที่</th>
                <th className="p-4">ประเภท</th>
                <th className="p-4">จำนวนเงิน</th>
                <th className="p-4">หมวดหมู่</th>
                <th className="p-4">รายละเอียด</th>
                <th className="p-4">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-slate-50 text-black"
                >
                  <td className="p-4">
                    {item.transaction_date}
                  </td>

                  <td className="p-4">
                    {item.type === "income"
                      ? "💰 รายรับ"
                      : "💸 รายจ่าย"}
                  </td>

                  <td className="p-4 font-semibold">
                    {Number(item.amount).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {item.category}
                  </td>

                  <td className="p-4">
                    {item.description}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        deleteData(item.id)
                      }
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}