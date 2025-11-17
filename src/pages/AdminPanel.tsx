import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { products, Product } from "@/data/products";
import { LogOut, Edit } from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    // Check admin auth
    const isAdmin = localStorage.getItem("adminAuth");
    if (isAdmin !== "true") {
      navigate("/hastilong/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(product.price);
  };

  const handleSave = (id: number) => {
    const updatedProducts = productsList.map(p => 
      p.id === id ? { ...p, price: editPrice } : p
    );
    setProductsList(updatedProducts);
    setEditingId(null);
    toast.success("Price updated! (Note: Changes are temporary without a backend)");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsList.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {editingId === product.id ? (
                          <Input
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24"
                          />
                        ) : (
                          product.price
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === product.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSave(product.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              ⚠️ Note: Without a backend, changes are temporary and will reset on page refresh.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
