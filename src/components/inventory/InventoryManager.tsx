import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Sparkles,
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { inventory, adjustInventoryStock } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter((i) => i.quantity <= i.minThreshold);
  const totalValuation = inventory.reduce((s, i) => s + i.quantity * i.costPerUnit, 0);

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tracked SKUs</span>
          <div className="text-2xl font-black text-slate-800 mt-1 flex items-center justify-between">
            <span>{inventory.length}</span>
            <Package className="w-5 h-5 text-sky-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Restoratives, Endo, Surgical, PPE</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-red-500">Low Stock Reorder Alerts</span>
          <div className="text-2xl font-black text-red-600 mt-1 flex items-center justify-between">
            <span>{lowStockItems.length}</span>
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <span className="text-[11px] text-red-600 mt-0.5 block">Items below clinical threshold</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Valuation</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{totalValuation.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Total capitalized supply value</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKU, dental material, or supplier..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700"
            >
              <option value="all">All Categories</option>
              <option value="Restorative">Restorative</option>
              <option value="Endodontics">Endodontics</option>
              <option value="Surgical & Implants">Surgical & Implants</option>
              <option value="PPE & Sterilization">PPE & Sterilization</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Material & SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">In Stock</th>
                <th className="px-6 py-3">Unit Cost</th>
                <th className="px-6 py-3">Supplier & Batch</th>
                <th className="px-6 py-3">Expiry Date</th>
                <th className="px-6 py-3 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isLow = item.quantity <= item.minThreshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <strong className="text-slate-900 font-bold block">{item.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{item.sku} • {item.location}</span>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-black text-sm ${
                            isLow ? 'text-red-600' : 'text-slate-800'
                          }`}
                        >
                          {item.quantity} {item.unit}
                        </span>
                        {isLow && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                            LOW
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">Min: {item.minThreshold}</span>
                    </td>

                    <td className="px-6 py-3.5 font-semibold text-slate-800">
                      ₹{item.costPerUnit.toLocaleString('en-IN')}
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="text-slate-800 font-medium block">{item.supplier}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Batch: {item.batchNumber}</span>
                    </td>

                    <td className="px-6 py-3.5 text-slate-600">
                      {item.expiryDate}
                    </td>

                    <td className="px-6 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => adjustInventoryStock(item.id, -1)}
                        className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Consume 1 unit in operatory"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => adjustInventoryStock(item.id, 1)}
                        className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Add 1 unit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => adjustInventoryStock(item.id, 10)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 ml-1"
                        title="Receive Restock shipment (+10 units)"
                      >
                        +10 Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
