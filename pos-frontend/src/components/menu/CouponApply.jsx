import { useState } from "react";
import PropTypes from "prop-types";
import { validateCoupon } from "../../https";

const CouponApply = ({ items, orderType, phone = "", appliedCoupon, onApply, onRemove }) => {
  const [code, setCode] = useState(appliedCoupon?.code || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const apply = async (event) => {
    event.preventDefault();
    if (!code.trim()) {
      setMessage("Enter a coupon code.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await validateCoupon({
        code,
        items,
        orderType,
        phone,
      });
      onApply(response.data.data);
      setCode(response.data.data.code);
      setMessage("Coupon applied successfully.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not apply this coupon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-5 mt-4 rounded-lg border border-[#393939] bg-[#202020] p-3">
      <label className="mb-2 block text-sm font-semibold text-[#f5f5f5]" htmlFor={`coupon-${orderType}`}>
        Coupon code
      </label>
      <form className="flex gap-2" onSubmit={apply}>
        <input
          id={`coupon-${orderType}`}
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          autoComplete="off"
          maxLength={40}
          className="min-w-0 flex-1 rounded-md border border-[#454545] bg-[#171717] px-3 py-2 text-sm text-white"
          placeholder="Enter code"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#f6b100] px-3 py-2 text-sm font-bold text-[#171717] disabled:opacity-60"
        >
          {loading ? "Checking…" : appliedCoupon ? "Replace" : "Apply"}
        </button>
      </form>
      {appliedCoupon && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-sm text-green-400">
            {appliedCoupon.code} applied · −Rs {Number(appliedCoupon.totalDiscount || appliedCoupon.discountAmount || 0).toFixed(2)}
          </p>
          <button
            type="button"
            onClick={() => {
              onRemove();
              setCode("");
              setMessage("");
            }}
            className="text-xs font-semibold text-[#d0d0d0] underline"
          >
            Remove
          </button>
        </div>
      )}
      {message && <p className={`mt-2 text-xs ${appliedCoupon ? "text-green-400" : "text-amber-300"}`} role="status">{message}</p>}
    </div>
  );
};

CouponApply.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  orderType: PropTypes.string.isRequired,
  phone: PropTypes.string,
  appliedCoupon: PropTypes.object,
  onApply: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CouponApply;
