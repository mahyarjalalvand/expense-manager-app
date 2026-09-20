import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";

const categories = [
  {
    id: "1",
    name: "Food",
    icon: "🍔",
    color: "#22c55e",
  },
  {
    id: "2",
    name: "Transport",
    icon: "🚗",
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "Shopping",
    icon: "🛍️",
    color: "#a855f7",
  },
  {
    id: "4",
    name: "Bills",
    icon: "🧾",
    color: "#f97316",
  },
  {
    id: "5",
    name: "Entertainment",
    icon: "🎬",
    color: "#ec4899",
  },
];

function Categories() {
  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex item-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">categories</h1>
          <p className="text-sm text-muted-foreground"> Manage your income and expense categories</p>
        </div>
        <Button>
          <Plus />
          Add category
        </Button>
      </div>
      <Card>
        <CardHeader className="text-base">Your categories</CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-lg text-lg"
                  style={{
                    backgroundColor: `${category.color}20`,
                  }}>
                  {category.icon}
                </div>

                <div>
                  <p className="text-sm font-medium">{category.name}</p>

                  <p className="text-xs text-muted-foreground">Default category</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default Categories;
