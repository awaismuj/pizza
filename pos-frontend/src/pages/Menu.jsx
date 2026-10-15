import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";

const Menu = () => {

    useEffect(() => {
      document.title = "POS | Menu"
    }, [])

  const customerData = useSelector((state) => state.customer);

  return (
    // `lg:overflow-hidden` here means neither side panel gets a free ride on
    // page scroll at desktop widths - each one below is responsible for its
    // own internal scrolling. Both used to skip that (no overflow-y-auto,
    // no bottom clearance for the always-on fixed BottomNav), so on shorter
    // 13-14" laptop screens the last row of dishes/table cards was simply
    // clipped and unreachable - there was nothing to scroll.
    // WhatsApp's floating button sits above the fixed BottomNav (not just
    // on this page - it's global, in App.jsx), so bottom clearance has to
    // cover both, not the nav bar alone. pb-24 was only clearing the nav.
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-3 pb-40 lg:pb-0">
      {/* Left Div - scrolls its own content on desktop; pb-28 clears the
          fixed BottomNav so the last row of dishes is actually reachable. */}
      <div className="w-full lg:flex-[3] lg:h-full lg:overflow-y-auto lg:pb-28">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
              Menu
            </h1>
          </div>
          <div className="flex items-center justify-around gap-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />
              <div className="flex flex-col items-start">
                <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
                  {customerData.customerName || "Customer Name"}
                </h1>
                <p className="text-xs text-[#ababab] font-medium">
                  Table : {customerData.table?.tableNo || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <MenuContainer />
      </div>
      {/* Right Div - CustomerInfo and Bill (`shrink-0`) keep their natural
          size, CartInfo is the only piece that grows/shrinks (`flex-1
          min-h-0` inside it) to fill whatever's left - so it adapts to any
          screen height with no magic number to re-tune. No explicit
          lg:h-full (h-auto instead): the flex row's default
          align-items:stretch auto-computes the right height so lg:mb-36
          below is honored - an explicit height:100% would override stretch
          and push the margin past the container's bottom instead of
          reserving real space above it. lg:mb-36 is that reserved space:
          room for the fixed BottomNav *and* the WhatsApp button that floats
          above it (both are global, rendered on every page), so Bill's
          buttons never end up under either one. lg:overflow-hidden keeps
          this panel's own scroll (inside CartInfo) from doubling up with
          the page's; on mobile this whole panel just flows with the page
          as normal, and pb-40 on the outer section (below) does the same
          BottomNav+WhatsApp clearance job there instead. */}
      <div className="w-full lg:flex-[1] bg-[#1a1a1a] mx-3 mb-4 lg:mx-0 lg:mt-4 lg:mr-3 lg:mb-36 lg:h-auto flex flex-col lg:overflow-hidden rounded-lg pt-2">
        <div className="shrink-0">
          {/* Customer Info */}
          <CustomerInfo />
          <hr className="border-[#2a2a2a] border-t-2" />
        </div>
        {/* Cart Items */}
        <CartInfo />
        <div className="shrink-0">
          <hr className="border-[#2a2a2a] border-t-2" />
          {/* Bills */}
          <Bill />
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
