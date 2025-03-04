import { useState, useEffect } from "react";
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  toast,
} from "@medusajs/ui";

export default function SignUpForm() {
  const [customers, setCustomers] = useState<{ id: string; first_name: string; last_name: string; email: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; title: string }[]>([]);
  const [variants, setVariants] = useState<{ title: string; sku: string }[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; title: string } | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  // Fetch customers and products
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:9000/admin/customers?limit=20&offset=0", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = await response.json();

        if (response.ok) {
          setCustomers(data.customers);
          console.log("Customer IDs:", data.customers.map((c: any) => c.id));
        } else {
          toast.error("Error", { description: "Failed to fetch customers" });
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Error", { description: "Unexpected error occurred" });
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:9000/admin/products?limit=20&offset=0&fields=id%2Ctitle", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products);
          console.log("Product IDs:", data.products.map((p: any) => p.id));
        } else {
          toast.error("Error", { description: "Failed to fetch products" });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error", { description: "Unexpected error occurred" });
      }
    };

    fetchCustomers();
    fetchProducts();
  }, []);

  // Fetch variants when a product is selected
  useEffect(() => {
    if (!selectedProduct) return;

    const fetchVariants = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/admin/products/${selectedProduct.id}/variants?order=variant_rank&limit=10&fields=title%2Csku`,
          {
            headers: { "Content-Type": "application/json" },
            method: "GET",
          }
        );
        const data = await response.json();

        if (response.ok) {
          setVariants(data.variants);
          console.log("Variant Data:", data.variants);
        } else {
          toast.error("Error", { description: "Failed to fetch variants" });
        }
      } catch (error) {
        console.error("Error fetching variants:", error);
        toast.error("Error", { description: "Unexpected error occurred" });
      }
    };

    fetchVariants();
  }, [selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer || !selectedEmail || !selectedProduct || !selectedVariant || !password) {
      toast.info("Error", { description: "Please fill in all fields." });
      return;
    }

    console.log("Selected Customer:", selectedCustomer);
    console.log("Selected Email:", selectedEmail);
    console.log("Selected Product:", selectedProduct.title);
    console.log("Selected Variant:", selectedVariant);
    console.log("Selected Password:", password);
  };

  return (
    <Container className="p-8 max-w-md mx-auto">
      <Heading level="h2" className="mb-2">
        Create Order
      </Heading>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Dropdown */}
        <div>
          <DropdownMenu>
            <DropdownMenu.Trigger>
              {selectedCustomer || "Select Customer"}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {customers.map((customer) => (
                <DropdownMenu.Item
                  key={customer.id}
                  onSelect={() => {
                    setSelectedCustomer(`${customer.first_name} ${customer.last_name}`);
                    setSelectedEmail(customer.email);
                  }}
                  className="flex flex-col"
                >
                  <span className="font-semibold">{customer.first_name} {customer.last_name}</span>
                  <span className="text-sm text-gray-500 lowercase">{customer.email}</span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        {/* Product Dropdown */}
        <div>
          <DropdownMenu>
            <DropdownMenu.Trigger>
              {selectedProduct?.title || "Select Product"}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {products.map((product) => (
                <DropdownMenu.Item
                  key={product.id}
                  onSelect={() => {
                    setSelectedProduct(product);
                    setVariants([]); // Reset variants when a new product is selected
                    setSelectedVariant(null); // Clear selected variant
                  }}
                >
                  {product.title}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        {/* Variant Dropdown (Only show when a product is selected) */}
        {selectedProduct && (
          <div>
            <DropdownMenu>
              <DropdownMenu.Trigger>
                {selectedVariant || "Select Variant"}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {variants.length > 0 ? (
                  variants.map((variant) => (
                    <DropdownMenu.Item
                      key={variant.sku}
                      onSelect={() => setSelectedVariant(variant.title)}
                    >
                      {variant.title} (SKU: {variant.sku})
                    </DropdownMenu.Item>
                  ))
                ) : (
                  <DropdownMenu.Item disabled>No variants available</DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        )}

        {/* Password Input */}
        <div>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Submit
        </Button>
      </form>
    </Container>
  );
}
