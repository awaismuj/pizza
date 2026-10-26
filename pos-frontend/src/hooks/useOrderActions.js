import { useCallback, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { deleteOrder as deleteOrderApi, updateOrderStatus } from "../https";
import { STAGE_LABELS } from "../utils/orderStages";

// One place for the buttons on an order card (move to next stage, cancel,
// delete) so Online Orders, the Orders board and the new-order popup all
// behave the same way:
//
//  * The screen changes the instant a button is pressed. The request runs in
//    the background; if the server refuses (for example not enough stock to
//    accept) the card goes back to how it was and the reason is shown.
//  * Only the card that was pressed is locked, not every card on the page.
//  * Only the data a change can affect is refreshed - never "everything".

const ORDERS_KEY = ["orders"];

// The "orders" query holds the raw axios response: { data: { data: Order[] } }.
const mapOrders = (cached, transform) => {
  const list = cached?.data?.data;
  if (!Array.isArray(list)) return cached;
  return { ...cached, data: { ...cached.data, data: transform(list) } };
};

const sameId = (a, b) => String(a) === String(b);

// Changes one order inside the cached list. `patch` is an object to merge
// or a function that receives the current order and returns the new one.
export const patchCachedOrder = (queryClient, orderId, patch) => {
  queryClient.setQueryData(ORDERS_KEY, (cached) =>
    mapOrders(cached, (list) =>
      list.map((order) => {
        if (!sameId(order._id, orderId)) return order;
        return typeof patch === "function" ? patch(order) : { ...order, ...patch };
      })
    )
  );
};

const findCachedOrder = (queryClient, orderId) =>
  queryClient.getQueryData(ORDERS_KEY)?.data?.data?.find((order) => sameId(order._id, orderId)) || null;

// The server returns the order without its table filled in; keep the table
// details the list already has so a card does not lose its table number.
const mergeServerOrder = (existing, server) => {
  if (!server || typeof server !== "object") return existing;
  const keepTable = existing?.table && typeof existing.table === "object" && !(server.table && typeof server.table === "object");
  return { ...existing, ...server, ...(keepTable ? { table: existing.table } : {}) };
};

// Stock only moves when an order is accepted or cancelled, and revenue only
// when it finishes or is cancelled, so refresh those screens only then.
const STOCK_STATUSES = ["Accepted", "Cancelled"];
const REVENUE_STATUSES = ["Completed", "Closed", "Cancelled"];

const invalidate = (queryClient, ...keys) => {
  keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
};

export const refreshAfterOrderChange = (queryClient, orderStatus) => {
  invalidate(queryClient, "orders", "tables");
  if (STOCK_STATUSES.includes(orderStatus)) invalidate(queryClient, "inventory", "low-stock");
  if (REVENUE_STATUSES.includes(orderStatus)) invalidate(queryClient, "dailyProfit", "monthlyProfit");
};

// Tracks which orders have a request in flight. A ref answers "is this one
// busy right now?" immediately (so a fast double click is ignored), and state
// makes the buttons re-render as disabled.
const usePendingIds = () => {
  const inFlight = useRef(new Set());
  const [pendingIds, setPendingIds] = useState([]);
  const mark = useCallback((orderId, busy) => {
    const id = String(orderId);
    if (busy) inFlight.current.add(id);
    else inFlight.current.delete(id);
    setPendingIds([...inFlight.current]);
  }, []);
  const isBusy = useCallback((orderId) => inFlight.current.has(String(orderId)), []);
  return { pendingIds, mark, isBusy };
};

export const useOrderStatusChange = () => {
  const queryClient = useQueryClient();
  const { pendingIds, mark, isBusy } = usePendingIds();

  const { mutate } = useMutation({
    mutationFn: updateOrderStatus,
    onMutate: async ({ orderId, orderStatus }) => {
      // Stop a poll that is already running from overwriting the change below.
      await queryClient.cancelQueries({ queryKey: ORDERS_KEY });
      const previous = findCachedOrder(queryClient, orderId);
      patchCachedOrder(queryClient, orderId, (order) => ({
        ...order,
        orderStatus,
        statusHistory: [...(order.statusHistory || []), { status: orderStatus, at: new Date().toISOString() }],
      }));
      return { previous };
    },
    onError: (error, { orderId }, context) => {
      if (context?.previous) patchCachedOrder(queryClient, orderId, () => context.previous);
      enqueueSnackbar(error?.response?.data?.message || "Failed to update order.", { variant: "error" });
    },
    onSuccess: (response, { orderId, orderStatus }) => {
      const serverOrder = response?.data?.data;
      if (serverOrder) patchCachedOrder(queryClient, orderId, (order) => mergeServerOrder(order, serverOrder));
      enqueueSnackbar(`Order is now ${STAGE_LABELS[orderStatus] || orderStatus}`, { variant: "success" });
    },
    onSettled: (_data, _error, { orderId, orderStatus }) => {
      mark(orderId, false);
      refreshAfterOrderChange(queryClient, orderStatus);
    },
  });

  // Returns false when this order is already waiting on the server.
  const changeStatus = useCallback(
    (order, orderStatus) => {
      if (!order?._id || isBusy(order._id)) return false;
      mark(order._id, true);
      mutate({ orderId: order._id, orderStatus });
      return true;
    },
    [isBusy, mark, mutate]
  );

  const isPending = useCallback((orderId) => pendingIds.includes(String(orderId)), [pendingIds]);

  return { changeStatus, isPending, anyPending: pendingIds.length > 0 };
};

export const useOrderDelete = () => {
  const queryClient = useQueryClient();
  const { pendingIds, mark, isBusy } = usePendingIds();

  const { mutate } = useMutation({
    mutationFn: deleteOrderApi,
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ORDERS_KEY });
      const list = queryClient.getQueryData(ORDERS_KEY)?.data?.data || [];
      const index = list.findIndex((order) => sameId(order._id, orderId));
      const removed = index >= 0 ? list[index] : null;
      queryClient.setQueryData(ORDERS_KEY, (cached) =>
        mapOrders(cached, (orders) => orders.filter((order) => !sameId(order._id, orderId)))
      );
      return { removed, index };
    },
    onError: (error, orderId, context) => {
      // Put the order back where it was.
      if (context?.removed) {
        queryClient.setQueryData(ORDERS_KEY, (cached) =>
          mapOrders(cached, (orders) => {
            if (orders.some((order) => sameId(order._id, orderId))) return orders;
            const next = [...orders];
            next.splice(Math.min(context.index, next.length), 0, context.removed);
            return next;
          })
        );
      }
      enqueueSnackbar(error?.response?.data?.message || "Failed to delete order.", { variant: "error" });
    },
    onSuccess: () => {
      enqueueSnackbar("Order deleted.", { variant: "success" });
    },
    onSettled: (_data, _error, orderId) => {
      mark(orderId, false);
      invalidate(queryClient, "orders", "tables", "inventory", "low-stock", "dailyProfit", "monthlyProfit", "deletedOrders");
    },
  });

  const removeOrder = useCallback(
    (order) => {
      if (!order?._id || isBusy(order._id)) return false;
      mark(order._id, true);
      mutate(order._id);
      return true;
    },
    [isBusy, mark, mutate]
  );

  const isRemoving = useCallback((orderId) => pendingIds.includes(String(orderId)), [pendingIds]);

  return { removeOrder, isRemoving };
};
