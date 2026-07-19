import React, { useState, useEffect } from "react";
import Sidebar from "./Dashboard/Sidebar";
import { FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const parseAmount = (val) => {
  if (!val) return 0;
  if (typeof val === "object" && val.$numberDecimal)
    return parseFloat(val.$numberDecimal);
  return Number(val);
};

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    source: "",
    date: "",
    paymentMode: "UPI",
    details: "",
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    amount: "",
    source: "",
    date: "",
    paymentMode: "UPI",
    details: "",
  });

  const fetchIncomes = async () => {
    try {
      const res = await axiosInstance.get("/income/get");
      setIncomes(res.data.incomes);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      toast.error("Failed to load incomes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axiosInstance.post("/income/add", {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success("Income added successfully! 💵");
      setFormData({
        title: "",
        amount: "",
        source: "",
        date: "",
        paymentMode: "UPI",
        details: "",
      });
      setShowForm(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Failed to add income");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/income/delete/${id}`);
      toast.success("Income deleted! 🗑️");
      fetchIncomes();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income");
    }
  };

  // Start editing
  const startEdit = (income) => {
    setEditingId(income._id);
    setEditFormData({
      title: income.title,
      amount: income.amount.toString(),
      source: income.source || "",
      date: income.date
        ? new Date(income.date).toISOString().split("T")[0]
        : "",
      paymentMode: income.paymentMode || "UPI",
      details: income.details || "",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      title: "",
      amount: "",
      source: "",
      date: "",
      paymentMode: "UPI",
      details: "",
    });
  };

  // Update income
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editFormData.title || !editFormData.amount || !editFormData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axiosInstance.put(`/income/update/${editingId}`, {
        ...editFormData,
        amount: parseFloat(editFormData.amount),
      });
      toast.success("Income updated! ✅");
      setEditingId(null);
      fetchIncomes();
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("Failed to update income");
    }
  };

  const totalIncome = incomes.reduce(
    (sum, i) => sum + parseAmount(i.amount),
    0,
  );

  return (
    <div className="flex bg-[#FFF5F7] min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto semi-transparent rounded-2xl ml-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#ff008c]">Income</h1>
            <p className="text-[#A68BA0] text-sm">
              Track all your income sources
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 transition"
          >
            <FaPlus /> Add Income
          </button>
        </div>

        <div className="bg-[#FFC1CC] rounded-2xl p-5 mb-6 shadow-md">
          <p className="text-[#6B305D] font-semibold text-lg">Total Income</p>
          <p className="text-4xl font-bold text-[#6B305D]">
            ₹{totalIncome.toLocaleString()}
          </p>
        </div>

        {/* Add Income Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-pink-200 mb-6">
            <h2 className="text-xl font-bold text-pink-600 mb-4">
              Add New Income
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Salary"
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Amount (₹)
                </label>
                <input
                  name="amount"
                  type="number"
                  max="999999999999"
                  min="1"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Source
                </label>
                <input
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="e.g. Company Name"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Date
                </label>
                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Payment Mode
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-gray-50"
                >
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Wallet</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Details (optional)
                </label>
                <input
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Any notes..."
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-gray-50"
                />
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 font-semibold"
                >
                  Save Income
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Income List */}
        {loading ? (
          <div className="text-center text-[#A68BA0] mt-16">
            <p>Loading...</p>
          </div>
        ) : incomes.length === 0 ? (
          <div className="text-center text-[#A68BA0] mt-16">
            <p className="text-5xl mb-4">💰</p>
            <p className="text-lg font-semibold">No income added yet</p>
            <p className="text-sm">Click "Add Income" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incomes.map((income) => (
              <div
                key={income._id}
                className="bg-white rounded-xl px-5 py-4 shadow-sm border border-pink-100"
              >
                {editingId === income._id ? (
                  // EDIT MODE
                  <form
                    onSubmit={handleUpdate}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <input
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditChange}
                      placeholder="Title"
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                      required
                    />
                    <input
                      name="amount"
                      type="number"
                      value={editFormData.amount}
                      onChange={handleEditChange}
                      placeholder="Amount"
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                      required
                    />
                    <input
                      name="source"
                      value={editFormData.source}
                      onChange={handleEditChange}
                      placeholder="Source"
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                    />
                    <input
                      name="date"
                      type="date"
                      value={editFormData.date}
                      onChange={handleEditChange}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                      required
                    />
                    <select
                      name="paymentMode"
                      value={editFormData.paymentMode}
                      onChange={handleEditChange}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                    >
                      <option>UPI</option>
                      <option>Cash</option>
                      <option>Wallet</option>
                      <option>Other</option>
                    </select>
                    <input
                      name="details"
                      value={editFormData.details}
                      onChange={handleEditChange}
                      placeholder="Details (optional)"
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                    />
                    <div className="sm:col-span-2 flex gap-2 justify-end mt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  // DISPLAY MODE
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-700">
                        {income.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {income.source} •{" "}
                        {new Date(income.date).toLocaleDateString()} •{" "}
                        {income.paymentMode}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-green-500 font-bold text-lg">
                        +₹{parseAmount(income.amount).toLocaleString()}
                      </p>
                      <button
                        onClick={() => startEdit(income)}
                        className="text-blue-400 hover:text-blue-600 text-lg"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(income._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Income;
