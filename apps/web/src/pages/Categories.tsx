import CategoryDialog from "@/components/CategoryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { categoryIcons } from "@/constant/categoryIcons";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types/categories";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";

function Categories() {
  const { data: categories, isPending } = useCategories();

  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">categories</h1>
          <p className="text-sm text-muted-foreground"> Manage your income and expense categories</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus />
          Add category
        </Button>
      </div>
      <Card>
        <CardHeader className="text-base">Your categories</CardHeader>
        <CardContent className="space-y-2">
          {isPending ? (
            <p>Loading categories ...</p>
          ) : (
            categories?.map((category) => {
              const Icon = categoryIcons[category.icon as keyof typeof categoryIcons];
              return (
                <div key={category.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-lg text-lg"
                      style={{
                        backgroundColor: `${category.color}20`,
                      }}>
                      {Icon && <Icon className="size-5" />}
                    </div>

                    <div>
                      <p className="text-sm font-medium">{category.name}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditCategory(category)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
      <CategoryDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <CategoryDialog
        open={!!editCategory}
        onOpenChange={(open) => {
          if (!open) {
            setEditCategory(null);
          }
        }}
        category={editCategory}
      />
    </div>
  );
}

export default Categories;
