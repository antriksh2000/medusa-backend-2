import { useState, useEffect } from "react";
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  Input,
  toast,
} from "@medusajs/ui";

export default function OrderForm() {
  // State for customers, products, and variants
  const [customers, setCustomers] = useState<
    { id: string; first_name: string; last_name: string; email: string }[]
  >([]);
  const [products, setProducts] = useState<{ id: string; title: string }[]>([]);
  const [variants, setVariants] = useState<
    { title: string; sku: string; id: string }[]
  >([]);

  // Selected values
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedVariantTitle, setSelectedVariantTitle] = useState<
    string | null
  >(null);
  const [showShippingForm, setShowShippingForm] = useState(false);

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    company: "",
    postal_code: "",
    city: "",
    country_code: "",
    province: "",
    phone: "",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:9000/admin/customers", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) setCustomers(data.customers);
        else toast.error("Failed to fetch customers");
      } catch (error) {
        toast.error("Unexpected error occurred");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:9000/admin/products", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) setProducts(data.products);
        else toast.error("Failed to fetch products");
      } catch (error) {
        toast.error("Unexpected error occurred");
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
          `http://localhost:9000/admin/products/${selectedProduct.id}/variants`,
          {
            headers: { "Content-Type": "application/json" },
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) setVariants(data.variants);
        else toast.error("Failed to fetch variants");
      } catch (error) {
        toast.error("Unexpected error occurred");
      }
    };
    fetchVariants();
  }, [selectedProduct]);

  // Handle variant selection and show shipping form
  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId);
    setShowShippingForm(true);
  };

  // Handle shipping form input changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Submit shipping & send to cart API
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingAddress.first_name ||
      !shippingAddress.address_1 ||
      !shippingAddress.city
    ) {
      toast.error("Please fill in required fields.");
      return;
    }
    if (!selectedCustomer || !selectedVariant) {
      toast.error("Customer and Variant are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/store/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            "pk_2a0920f648401e883b892b7dde36d24a700b5964d836ab18c6ab1c8ac1822dd1",
        },
        body: JSON.stringify({
          region_id: "reg_01JMZ5ZCB2A15DN53A4MR0SG2B",
          email: selectedCustomer,
          items: [{ variant_id: selectedVariant, quantity: 1 }],
          shipping_address: shippingAddress,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Shipping address saved & Item added to cart!");
        console.log("Cart API Response:", data);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <Container className="p-8 max-w-md mx-auto">
      <div className=" flex flex-col gap-4">
        {/* Customer Selection */}
        <div>
          <DropdownMenu>
            <DropdownMenu.Trigger>
              Customer: {selectedCustomer || "Select Customer"}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {customers.map((customer) => (
                <DropdownMenu.Item
                  key={customer.id}
                  onSelect={() => setSelectedCustomer(customer.email)}
                >
                  {customer.first_name} {customer.last_name}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        {/* Product Selection */}
        <div>
          <DropdownMenu>
            <DropdownMenu.Trigger>
              Product: {selectedProduct?.title || "Select Product"}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {products.map((product) => (
                <DropdownMenu.Item
                  key={product.id}
                  onSelect={() => setSelectedProduct(product)}
                >
                  {product.title}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        {/* Variant Selection */}
        <div>
          {selectedProduct && (
            <DropdownMenu>
              <DropdownMenu.Trigger>
                Variant: {selectedVariantTitle || "Select Variant"}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {variants.map((variant) => (
                  <DropdownMenu.Item
                    key={variant.id}
                    onSelect={() => {
                      handleVariantSelect(variant.id);
                      setSelectedVariantTitle(variant.title);
                    }}
                  >
                    {variant.title}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Shipping Address Form */}
      {showShippingForm && (
        <form className="space-y-4 mt-6" onSubmit={handleShippingSubmit}>
          <Heading level="h3">Shipping Address</Heading>
          <Input
            type="text"
            name="first_name"
            placeholder="First Name"
            onChange={handleShippingChange}
            required
          />
          <Input
            type="text"
            name="last_name"
            placeholder="Last Name"
            onChange={handleShippingChange}
          />
          <Input
            type="text"
            name="address_1"
            placeholder="Address"
            onChange={handleShippingChange}
            required
          />
          <Input
            type="text"
            name="company"
            placeholder="Company"
            onChange={handleShippingChange}
          />
          <Input
            type="text"
            name="postal_code"
            placeholder="Postal Code"
            onChange={handleShippingChange}
          />
          <Input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleShippingChange}
            required
          />
          <Input
            type="text"
            name="province"
            placeholder="State/Province"
            onChange={handleShippingChange}
          />
          <Input
            type="text"
            name="country_code"
            placeholder="Country"
            onChange={handleShippingChange}
          />
          <Input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleShippingChange}
          />

          <Button type="submit" variant="primary" className="w-full">
            Submit
          </Button>
        </form>
      )}
    </Container>
  );
}
