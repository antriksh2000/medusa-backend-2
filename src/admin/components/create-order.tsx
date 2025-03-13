import { useState, useEffect } from "react";
import { Button, Heading, Input, toast } from "@medusajs/ui";
import MultiSelectDropdown from "./MultiDropdown";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function OrderForm() {
  const [addresses, setAddresses] = useState<
    {
      phone: string;
      province: string;
      company: string;
      country_code: string;
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      address_1: string;
      city: string;
      postal_code: string;
    }[]
  >([]);
  const [products, setProducts] = useState<{ id: string; title: string }[]>([]);
  const [customers, setCustomers] = useState<
    { id: string; first_name: string; last_name: string; email: string }[]
  >([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [customerEmail, setSelectedCustomerEmail] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [selectedProducts, setSelectedProducts] = useState<
    { id: string; title: string; variants?: any }[]
  >([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const [searchCustomer, setSearchCustomer] = useState<string>("");
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [regionId, setRegionId] = useState<string>("");

  const [selectedVariant, setSelectedVariant] = useState<
    {
      selectedProductId: string;
      selectedVariantTitle: string;
      variantId: string;
    }[]
  >([]);
  const [showShippingForm, setShowShippingForm] = useState(false);

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
    const fetchRegion = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API_URL
          }admin/regions/?limit=40&offset=0`,
          {
            headers: { "Content-Type": "application/json" },
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) setRegionId(data?.regions?.[0].id);
        else toast.error("Failed to fetch regions");
      } catch (error) {
        toast.error("Unexpected error occurred");
      }
    };
    fetchRegion();
  }, []);

  useEffect(() => {
    const fetchCustomerAddresses = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API_URL
          }admin/customers/${selectedCustomerId}/addresses`,
          {
            headers: { "Content-Type": "application/json" },
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) setAddresses(data?.addresses);
        else toast.error("Failed to fetch regions");
      } catch (error) {
        toast.error("Unexpected error occurred");
      }
    };
    fetchCustomerAddresses();
  }, [selectedCustomerId]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API_URL
          }admin/customers?limit=40&offset=0&q=${searchCustomer}`,
          {
            headers: { "Content-Type": "application/json" },
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) setCustomers(data.customers);
        else toast.error("Failed to fetch customers");
      } catch (error) {
        toast.error("Unexpected error occurred");
      }
    };

    fetchCustomers();
  }, [searchCustomer]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API_URL
          }admin/products?limit=40&offset=0&q=${searchProduct}`,
          {
            headers: { "Content-Type": "application/json" },
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) setProducts(data.products);
        else toast.error("Failed to fetch products");
      } catch (error) {
        toast.error("Unexpected error occurred");
      }
    };
    fetchProducts();
  }, [searchProduct]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const items = selectedVariant.map((variant) => ({
    variant_id: variant.variantId,
    quantity: 1,
  }));

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
    if (!customers) {
      toast.error("Customer and product and variant are required.");
      return;
    }

    try {
      const data = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}admin/manual-orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              "pk_2a0920f648401e883b892b7dde36d24a700b5964d836ab18c6ab1c8ac1822dd1",
          },
          body: JSON.stringify({
            region_id: regionId,
            email: customerEmail,
            items: items,
            shipping_address: shippingAddress,
          }),
        }
      );
      if (data.ok) {
        toast.success("Order created successfully");
        setSelectedCustomerId(null);
        setShowCustomerDropdown(true);
        setSelectedVariant([]);
        setShowShippingForm(false);
        setSelectedProducts([]);
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVariantSelect = (
    productId: string,
    variantTitle: string,
    variantId: string
  ) => {
    setSelectedVariant((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.selectedProductId === productId
      );

      if (existingIndex !== -1) {
        const updatedVariants = [...prev];
        updatedVariants[existingIndex] = {
          selectedProductId: productId,
          selectedVariantTitle: variantTitle,
          variantId: variantId,
        };

        return updatedVariants;
      } else {
        return [
          ...prev,
          {
            selectedProductId: productId,
            selectedVariantTitle: variantTitle,
            variantId: variantId,
          },
        ];
      }
    });
    setShowShippingForm(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  useEffect(() => {
    if (selectedAddressId) {
      const selectedAddress = addresses.find(
        (address) => address.id === selectedAddressId
      );
      if (selectedAddress) {
        setShippingAddress({
          first_name: selectedAddress.first_name || "",
          last_name: selectedAddress.last_name || "",
          address_1: selectedAddress.address_1 || "",
          company: selectedAddress.company || "",
          postal_code: selectedAddress.postal_code || "",
          city: selectedAddress.city || "",
          country_code: selectedAddress.country_code || "",
          province: selectedAddress.province || "",
          phone: selectedAddress.phone || "",
        });
      }
    }
  }, [selectedAddressId, addresses]);

  return (
    <div className="min-w-2xl max-w-full min-h-screen pl-20 flex flex-col overflow-x-scroll ">
      <div className="min-w-2xl max-w-2xl mx-auto flex flex-col gap-4">
        <div className="min-w-2xl relative mt-5">
          <Input
            placeholder="Search Customer..."
            value={
              selectedCustomerId
                ? (() => {
                    const selectedCustomer = customers.find(
                      (c) => c.id === selectedCustomerId
                    );
                    return selectedCustomer?.first_name?.trim() &&
                      selectedCustomer?.last_name?.trim()
                      ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                      : selectedCustomer?.email || "";
                  })()
                : searchCustomer
            }
            onChange={(e) => {
              setSearchCustomer(e.target.value);
              setSelectedCustomerId(null);
              setShowCustomerDropdown(true);
            }}
            className="min-w-2xl"
            onFocus={() => setShowCustomerDropdown(true)}
          />
          {showCustomerDropdown && customers.length > 0 && (
            <div className="w-2xl absolute bg-white border mt-1 w-full max-h-60 overflow-auto z-10 shadow-lg">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedCustomerId(customer.id);
                    setSelectedCustomerEmail(customer.email);
                    setSearchCustomer("");
                    setShowCustomerDropdown(false);
                  }}
                >
                  <span>
                    {customer.first_name && customer.last_name
                      ? customer.first_name + " " + customer.last_name
                      : customer.email}{" "}
                  </span>
                  <br />
                  <span className="text-sm text-gray-500">
                    {customer.email}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <MultiSelectDropdown
            options={products}
            setSelectedProducts={setSelectedProducts}
            search={searchProduct}
            setSearch={setSearchProduct}
          />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 gap-4">
            {selectedProducts?.map((product) => (
              <div key={product.id} className="mb-2">
                <div className="mt-2">
                  <Slider {...settings} className="w-full mb-8">
                    {Array.isArray((product as any).images) &&
                    (product as any).images.length > 0 ? (
                      (product as any).images.map(
                        (variant: any, index: number) => (
                          <div key={index} className="p-2">
                            <img
                              src={variant.url}
                              alt={`Product ${index}`}
                              className="w-full h-40 object-contain rounded-md shadow-md"
                            />
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-center">No images</p>
                    )}
                  </Slider>
                </div>
                <span className="font-semibold pt-2">{product.title}:</span>
                <h3 className="mb-2">Size</h3>

                <div className="grid grid-cols-3 gap-2">
                  {product.variants.map((variant: any) => {
                    const isSelected = selectedVariant.find(
                      (item) =>
                        item.selectedProductId === product.id &&
                        item.variantId === variant.id
                    );

                    return (
                      <button
                        key={variant.id}
                        name={`variant-${product.id}`}
                        value={variant.title}
                        onClick={() =>
                          handleVariantSelect(
                            product.id,
                            variant.title,
                            variant.id
                          )
                        }
                        className={`cursor-pointer border border-gray-300 rounded-md p-2 text-center ${
                          isSelected ? "bg-blue-500 text-white" : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        {variant.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-2xl">
          {addresses.length > 0 && (
            <div className="relative mt-5">
              <h1>Select Address</h1>
              <Input
                placeholder="Select Address"
                value={
                  selectedCustomerId
                    ? (() => {
                        const selectedAddress = addresses.find(
                          (c) => c.id === selectedAddressId
                        );
                        return selectedAddress?.first_name?.trim() &&
                          selectedAddress?.last_name?.trim()
                          ? `${selectedAddress.first_name} ${selectedAddress.last_name}`
                          : selectedAddress?.email || "";
                      })()
                    : searchCustomer
                }
                onChange={(e) => {
                  setSearchCustomer(e.target.value);
                  setSelectedCustomerId(null);
                  setShowAddressDropdown(true);
                }}
                onFocus={() => setShowAddressDropdown(true)}
              />
              {showAddressDropdown && customers.length > 0 && (
                <div className="absolute bg-white border mt-1 w-full max-h-60 overflow-auto z-10 shadow-lg">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedAddressId(address.id);
                        setSearchCustomer("");
                        setShowAddressDropdown(false);
                      }}
                    >
                      <span>
                        {address.first_name && address.last_name
                          ? address.first_name + " " + address.last_name
                          : address.email}
                      </span>
                      <br />
                      <span className="text-sm text-gray-500">
                        {address.address_1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {showShippingForm && (
          <form
            className=" space-y-4 mt-6 max-w-2xl"
            onSubmit={handleShippingSubmit}
          >
            <Heading level="h3">Shipping Address</Heading>
            <Input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={shippingAddress.first_name}
              onChange={handleShippingChange}
              required
            />
            <Input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={shippingAddress.last_name}
              onChange={handleShippingChange}
            />
            <Input
              type="text"
              name="address_1"
              placeholder="Address"
              value={shippingAddress.address_1}
              onChange={handleShippingChange}
              required
            />
            <Input
              type="text"
              name="company"
              placeholder="Company"
              value={shippingAddress.company}
              onChange={handleShippingChange}
            />
            <Input
              type="text"
              name="postal_code"
              placeholder="Postal Code"
              value={shippingAddress.postal_code}
              onChange={handleShippingChange}
            />
            <Input
              type="text"
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleShippingChange}
              required
            />
            <Input
              type="text"
              name="province"
              placeholder="State/Province"
              value={shippingAddress.province}
              onChange={handleShippingChange}
            />
            <Input
              type="text"
              name="country_code"
              placeholder="Country"
              value={shippingAddress.country_code}
              onChange={handleShippingChange}
            />
            <Input
              type="text"
              name="phone"
              placeholder="Phone"
              value={shippingAddress.phone}
              onChange={handleShippingChange}
            />

            <Button type="submit" variant="primary" className="w-full">
              Submit
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
