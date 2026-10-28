const { expireCouponReservations } = require("./couponService");

let timer = null;
let running = false;

const startCouponReservationScheduler = () => {
  if (timer) return timer;
  const run = async () => {
    if (running) return;
    running = true;
    try {
      await expireCouponReservations();
    } catch (error) {
      console.error("Failed to expire coupon reservations:", error.message);
    } finally {
      running = false;
    }
  };
  void run();
  timer = setInterval(run, 60 * 1000);
  timer.unref?.();
  return timer;
};

module.exports = { startCouponReservationScheduler };
