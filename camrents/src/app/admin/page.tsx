import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminGetDashboard, adminGetTodaySchedule } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await adminGetDashboard();
  const schedule = await adminGetTodaySchedule();

  const kpis = [
    { label: "Active Rentals", value: stats.activeRentals },
    { label: "Overdue", value: stats.overdueItems },
    { label: "Today's Pickups", value: stats.todayPickups },
    { label: "Today's Returns", value: stats.todayReturns },
  ];

  return (
    <div className="p-4 lg:pl-52">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-brand-500">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-brand-950">Today&apos;s Schedule</h2>
          <Link href="/admin/bookings" className="text-sm text-accent hover:underline">View All →</Link>
        </div>
        
        {schedule.length > 0 ? (
          <div className="space-y-2">
            {schedule.map((item) => (
              <Link key={`${item.id}-${item.type}`} href={`/admin/bookings/${item.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between p-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-brand-950">{item.bookingNumber}</span>
                        <Badge className={item.type === "pickup" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                          {item.type === "pickup" ? "Pickup" : "Return"}
                        </Badge>
                      </div>
                      <p className="text-xs text-brand-500 mt-1">{item.brand} {item.model} · {item.customerName}</p>
                    </div>
                    <span className="text-xs font-medium text-brand-400">{item.customerPhone}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-brand-400">No pickups or returns scheduled for today</p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/admin/bookings">View All Bookings</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="h-auto flex-col gap-1 py-4">
          <Link href="/admin/products/new">
            <span className="text-lg">+</span>
            <span className="text-xs">Add Product</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto flex-col gap-1 py-4">
          <Link href="/admin/customers">
            <span className="text-lg">👥</span>
            <span className="text-xs">Customers</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
