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
