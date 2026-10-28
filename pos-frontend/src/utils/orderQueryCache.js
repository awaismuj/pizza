export const replaceCachedOrder = (queryClient, updatedOrder) => {
  if (!updatedOrder?._id) return;

  queryClient.setQueryData(["orders"], (current) => {
    const currentOrders = current?.data?.data;
    if (!Array.isArray(currentOrders)) return current;
    return {
      ...current,
      data: {
        ...current.data,
        data: currentOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)),
      },
    };
  });
};

export const updateCachedOrderStatus = (queryClient, orderId, orderStatus) => {
  let previousOrder;
  const updatedAt = new Date().toISOString();
  queryClient.setQueryData(["orders"], (current) => {
    const currentOrders = current?.data?.data;
    if (!Array.isArray(currentOrders)) return current;
    return {
      ...current,
      data: {
        ...current.data,
        data: currentOrders.map((order) => {
          if (order._id !== orderId) return order;
          previousOrder = order;
          return {
            ...order,
            orderStatus,
            statusHistory: [...(order.statusHistory || []), { status: orderStatus, at: updatedAt }],
          };
        }),
      },
    };
  });
  return previousOrder;
};
