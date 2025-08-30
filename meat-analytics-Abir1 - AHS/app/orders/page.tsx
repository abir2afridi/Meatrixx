"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Download, Filter, Package, Truck } from "lucide-react";
import { mockApi } from "@/services/mock-api";
import type { Order } from "@/data/mock-data";
import { useToast } from "@/hooks/use-toast";
import OrderTable from "./order-table";
import OrderForm from "./order-form";
import OrderFilters from "./order-filters";
import { OrderTracking } from "./order-tracking";
import { OrderHistory } from "./order-history";
import { toast } from "sonner";

type OrderWithDetails = Order & { vendorName: string; productName: string };

export default function OrdersContent() {
  const fmt = (d?: string) => {
    if (!d) return "";
    try {
      return new Date(d).toISOString().split("T")[0];
    } catch {
      return d as string;
    }
  };
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
  });
  const { toast: shadcnToast } = useToast();

  useEffect(() => {
    fetchOrders();
    fetchCustomerOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchQuery, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getOrdersWithDetails();
      setOrders(data);
    } catch (error) {
      shadcnToast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = () => {
    const orders = JSON.parse(localStorage.getItem("customer-orders") || "[]");
    setCustomerOrders(orders);
  };

  const handleReorder = (order: any) => {
    toast.success("Items added to cart! You can now modify and checkout.");
  };

  const handleCancelOrder = (orderId: string) => {
    const updatedOrders = customerOrders.map((order) =>
      order.id === orderId ? { ...order, status: "Cancelled" } : order
    );
    localStorage.setItem("customer-orders", JSON.stringify(updatedOrders));
    setCustomerOrders(updatedOrders);
    toast.success("Order cancelled successfully");
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.vendorName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.productName || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((order) => order.orderDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((order) => order.orderDate <= filters.dateTo);
    }

    if (filters.minAmount) {
      filtered = filtered.filter((order) => order.totalAmount >= Number(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter((order) => order.totalAmount <= Number(filters.maxAmount));
    }

    setFilteredOrders(filtered);
  };

  const handleAddOrder = async (orderData: Omit<Order, "id">) => {
    try {
      const newOrder = await mockApi.createOrder(orderData);
      const orderWithDetails = {
        ...newOrder,
        vendorName: "New Vendor",
        productName: "New Product",
      } as OrderWithDetails;
      setOrders((prev) => [...prev, orderWithDetails]);
      setShowAddForm(false);
      shadcnToast({
        title: "Success",
        description: "Order created successfully",
      });
    } catch (error) {
      shadcnToast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      await mockApi.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
      shadcnToast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      shadcnToast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Vendor",
      "Product",
      "Quantity",
      "Unit Price",
      "Total Amount",
      "Status",
      "Order Date",
      "Delivery Date",
    ];

    const csvData = filteredOrders.map((order) => [
      order.id,
      order.vendorName,
      order.productName,
      order.quantity,
      order.unitPrice,
      order.totalAmount,
      order.status,
      order.orderDate,
      order.deliveryDate || "",
    ]);

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    shadcnToast({
      title: "Success",
      description: "Orders exported to CSV",
    });
  };

  const getStatusStats = () => {
    const stats = filteredOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return stats;
  };

  const statusStats = getStatusStats();

  const getCustomerOrderStats = () => {
    return customerOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  };

  const customerStats = getCustomerOrderStats();

  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
            ← Back to Orders
          </Button>
          <h1 className="text-3xl font-bold">Order Tracking</h1>
        </div>
        <OrderTracking order={selectedOrder} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders from suppliers and shop purchases</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Badge variant="secondary">{filteredOrders.length + customerOrders.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length + customerOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {customerOrders.length} shop orders, {orders.length} business orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              {(statusStats.Pending || 0) + (customerStats["Order Placed"] || 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(statusStats.Pending || 0) + (customerStats["Order Placed"] || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {(statusStats.Processing || 0) + (customerStats["Processing"] || 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(statusStats.Processing || 0) + (customerStats["Processing"] || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Being prepared</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Badge variant="outline" className="bg-purple-100 text-purple-800">
              {(statusStats.Shipped || 0) + (customerStats["Shipped"] || 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(statusStats.Shipped || 0) + (customerStats["Shipped"] || 0)}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {(statusStats.Delivered || 0) + (customerStats["Delivered"] || 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(statusStats.Delivered || 0) + (customerStats["Delivered"] || 0)}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customer" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customer">Shop Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
          <TabsTrigger value="business">Business Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Shop Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customerOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No shop orders yet</p>
                  <Button className="mt-4" onClick={() => (window.location.href = "/dashboard/shop")}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Order #{order.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {fmt(order.orderDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2">
                            {order.status}
                          </Badge>
                          <p className="font-semibold">৳{order.total.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{order.items.length} items</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{fmt(order.estimatedDelivery)}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          Track Order
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <OrderHistory orders={customerOrders} onReorder={handleReorder} onCancelOrder={handleCancelOrder} />
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders, vendors, products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <OrderFilters filters={filters} onFiltersChange={setFilters} />
            </CardContent>
          </Card>

          <OrderTable orders={filteredOrders} loading={loading} onUpdateStatus={handleUpdateOrderStatus} />
        </TabsContent>

        <TabsContent value="pending">
          <OrderTable
            orders={filteredOrders.filter((order) => order.status === "Pending")}
            loading={loading}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        </TabsContent>

        <TabsContent value="processing">
          <OrderTable
            orders={filteredOrders.filter((order) => order.status === "Processing")}
            loading={loading}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        </TabsContent>

        <TabsContent value="shipped">
          <OrderTable
            orders={filteredOrders.filter((order) => order.status === "Shipped")}
            loading={loading}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        </TabsContent>
      </Tabs>

      {showAddForm && <OrderForm onSubmit={handleAddOrder} onCancel={() => setShowAddForm(false)} />}
    </div>
  );
}
