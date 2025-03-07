import { useState, useEffect } from "react";
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  Input,
  toast,
} from "@medusajs/ui";

export default function SignUpForm() {
  const [customers, setCustomers] = useState<
    { id: string; first_name: string; last_name: string; email: string }[]
  >([]);
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [searchCustomer, setSearchCustomer] = useState<string>("");
  const [products, setProducts] = useState<{ id: string; title: string }[]>([]);
  const [variants, setVariants] = useState<{ title: string; sku: string }[]>(
    []
  );
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/admin/customers?limit=20&offset=0`,
          {
            headers: { "Content-Type": "application/json" },
            method: "GET",
          }
        );
        const data = await response.json();

        if (response.ok) {
          setCustomers(data.customers);
          setFilteredCustomers(data.customers);
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
        const response = await fetch(
          "http://localhost:9000/admin/products?limit=20&offset=0&fields=id%2Ctitle",
          {
            headers: { "Content-Type": "application/json" },
            method: "GET",
          }
        );
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products);
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

  useEffect(() => {
    if (searchCustomer.trim() === "") {
      setFilteredCustomers(customers);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const filtered = customers.filter((customer) =>
        `${customer.first_name} ${customer.last_name}`
          .toLowerCase()
          .includes(searchCustomer.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setIsDropdownOpen(true);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchCustomer, customers]);

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
        } else {
          toast.error("Error", { description: "Failed to fetch variants" });
        }
      } catch (error) {
        toast.error("Error", { description: "Unexpected error occurred" });
      }
    };

    fetchVariants();
  }, [selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      selectedProduct,
    );

    console.log(selectedVariant)
    const addToCartResponse = await fetch(
      `http://localhost:9000/de/products/${selectedProduct!.title}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          variant_id: selectedVariant,
          quantity: 1,
          countryCode:'de'
        })
      }
    );
    console.log(addToCartResponse)
    if (
      !selectedCustomer ||
      !selectedEmail ||
      !selectedProduct ||
      !selectedVariant
    ) {
      toast.info("Error", { description: "Please fill in all fields." });
      return;
    }
  };

  return (
    <Container className="p-8 max-w-md mx-auto relative">
      <Heading level="h2" className="mb-2">
        Create Order
      </Heading>

      <form className="space-y-6">
        {/* Customer Search & Dropdown */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search or enter new customer..."
            value={searchCustomer}
            onChange={(e) => {
              setSearchCustomer(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full"
          />

          {/* Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(
                        `${customer.first_name} ${customer.last_name}`
                      );
                      setSelectedEmail(`${customer.email} `);
                      setSearchCustomer(
                        `${customer.first_name} ${customer.last_name}`
                      );
                      setIsDropdownOpen(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <span className="font-semibold">
                      {customer.first_name} {customer.last_name}
                    </span>
                    <span className="text-sm text-gray-500 lowercase">
                      {" "}
                      {customer.email}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  onClick={() => {
                    setSelectedCustomer(searchCustomer);
                    setIsDropdownOpen(false);
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  Use "{searchCustomer}" as a new customer
                </div>
              )}
            </div>
          )}
        </div>

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
                  <DropdownMenu.Item disabled>
                    No variants available
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}
