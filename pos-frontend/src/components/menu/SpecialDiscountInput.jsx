import PropTypes from "prop-types";

const SpecialDiscountInput = ({ id, subtotal, value, onChange }) => {
  const amount = value.trim() === "" ? 0 : Number(value);
  const valid = Number.isInteger(amount) && amount >= 0 && amount <= subtotal;

  return (
    <div className="mx-5 mt-3 rounded-lg border border-[#393939] bg-[#202020] p-3">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#f5f5f5]">
        Special discount (Rs)
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          min="0"
          max={Math.floor(subtotal)}
          step="1"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-[#454545] bg-[#171717] px-3 py-2 text-sm text-white"
          placeholder="Enter amount, e.g. 100"
        />
        {[100, 200].map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={preset > subtotal}
            onClick={() => onChange(String(preset))}
            className="rounded-md bg-[#333] px-3 py-2 text-sm font-semibold text-[#f5f5f5] hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {preset}
          </button>
        ))}
      </div>
      {!valid && (
        <p className="mt-2 text-xs text-red-300" role="alert">
          Enter a whole rupee amount no greater than the remaining order subtotal.
        </p>
      )}
    </div>
  );
};

SpecialDiscountInput.propTypes = {
  id: PropTypes.string.isRequired,
  subtotal: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SpecialDiscountInput;
