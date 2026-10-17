import React from "react";
import {
  FcShop,
  FcConferenceCall,
  FcBullish,
  FcPackage,
  FcServices,
  FcDepartment,
  FcApproval,
  FcLock,
  FcCheckmark,
} from "react-icons/fc";
import { PERMISSION_DEFINITIONS, ROLE_DEFAULT_PERMISSIONS } from "../../utils/orderPermissions";
import { useUITheme } from "../../context/UIThemeContext";

const CATEGORY_ICONS = {
  "System Navigation": <FcShop size={18} />,
  "POS Operations": <FcApproval size={18} />,
  Catalog: <FcServices size={18} />,
  Inventory: <FcPackage size={18} />,
  "Human Resources": <FcConferenceCall size={18} />,
  Finance: <FcBullish size={18} />,
  Assets: <FcDepartment size={18} />,
  Configuration: <FcServices size={18} />,
  Security: <FcLock size={18} />,
};

const PermissionMatrix = ({ permissions = {}, onChange, disabled = false }) => {
  const { isClean } = useUITheme();

  const handleToggle = (key) => {
    if (disabled) return;
    onChange({
      ...permissions,
      [key]: !permissions[key],
    });
  };

  const applyPreset = (presetName) => {
    if (disabled) return;
    const preset = ROLE_DEFAULT_PERMISSIONS[presetName];
    if (preset) {
      onChange({
        ...permissions,
        ...preset,
      });
    }
  };

  const selectAll = () => {
    if (disabled) return;
    const all = {};
    PERMISSION_DEFINITIONS.forEach((p) => {
      all[p.key] = true;
    });
    onChange(all);
  };

  const clearAll = () => {
    if (disabled) return;
    const none = {};
    PERMISSION_DEFINITIONS.forEach((p) => {
      none[p.key] = false;
    });
    onChange(none);
  };

  // Group by category
  const categories = Array.from(new Set(PERMISSION_DEFINITIONS.map((p) => p.category)));

  const enabledCount = PERMISSION_DEFINITIONS.filter((p) => Boolean(permissions[p.key])).length;

  return (
    <div className="space-y-3">
      {/* Header and Quick Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <FcCheckmark size={14} /> Permission Matrix ({enabledCount}/{PERMISSION_DEFINITIONS.length} active)
          </span>
          <p className="text-[10px] text-slate-400">
            Select standard presets or toggle granular permissions below
          </p>
        </div>

        {!disabled && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset("Admin")}
              className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => applyPreset("Manager")}
              className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30 transition"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => applyPreset("Cashier")}
              className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition"
            >
              Cashier
            </button>
            <button
              type="button"
              onClick={() => applyPreset("Kitchen")}
              className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30 transition"
            >
              Kitchen
            </button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              onClick={selectAll}
              className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-500 transition"
            >
              All
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-500 transition"
            >
              None
            </button>
          </div>
        )}
      </div>

      {/* Permissions List Grouped by Category */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {categories.map((category) => {
          const items = PERMISSION_DEFINITIONS.filter((p) => p.category === category);
          return (
            <div key={category} className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {CATEGORY_ICONS[category]}
                <span>{category}</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {items.map((item) => {
                  const isActive = Boolean(permissions[item.key]);
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggle(item.key)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer select-none ${
                        isActive
                          ? isClean
                            ? "bg-amber-50/70 border-amber-300/80 text-amber-950 shadow-2xs"
                            : "bg-amber-500/10 border-amber-500/40 text-white shadow-2xs"
                          : isClean
                          ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                          : "bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-300"
                      } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
                    >
                      <div className="pr-3">
                        <p className="text-xs font-bold leading-tight">{item.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      {/* Custom Toggle Switch */}
                      <div
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 shrink-0 transition-colors ${
                          isActive ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionMatrix;
