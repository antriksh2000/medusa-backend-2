import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import {
  Badge,
  createDataTableColumnHelper,
  createDataTableFilterHelper,
  DataTable,
  DataTableFilteringState,
  DataTablePaginationState,
  DataTableSortingState,
  Heading,
  useDataTable,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/config";
import { useMemo, useState } from "react";
// import { Container } from "../../components/container"
import { HttpTypes, ProductStatus } from "@medusajs/framework/types";
import { useNavigate } from "react-router-dom";

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminOrder>();

const columns = [
  columnHelper.accessor("display_id", {
    header: "Order No",
    enableSorting: true,
    sortLabel: "display_id",
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <Badge color={status === "published" ? "green" : "grey"} size="xsmall">
          {status === "published" ? "Published" : "Draft"}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("email", {
    header: "Email",
    enableSorting: true,
    sortLabel: "email",
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
  }),
];

const filterHelper = createDataTableFilterHelper<HttpTypes.AdminProduct>();

const filters = [
  filterHelper.accessor("status", {
    type: "select",
    label: "Status",
    options: [
      {
        label: "Open",
        value: "open",
      },
      {
        label: "Completed",
        value: "completed",
      },
      {
        label: "Canceled",
        value: "canceled",
      },
      {
        label: "Draft",
        value: "draft",
      },
    ],
  }),
];

const limit = 15;

const CustomPage = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [filtering, setFiltering] = useState<DataTableFilteringState>({});
  const [sorting, setSorting] = useState<DataTableSortingState | null>(null);

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);
  const statusFilters = useMemo(() => {
    return (filtering.status || []) as ProductStatus;
  }, [filtering]);

  const { data, isLoading } = useQuery({
    queryFn: () =>
      sdk.admin.draftOrder.list({
        limit,
        offset,
        q: search,
        // status: statusFilters,
        order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
      }),
    queryKey: [
      [
        "products",
        limit,
        offset,
        search,
        statusFilters,
        sorting?.id,
        sorting?.desc,
      ],
    ],
  });

  const table = useDataTable({
    columns,
    data: data?.draft_orders || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    filtering: {
      state: filtering,
      onFilteringChange: setFiltering,
    },
    filters,
    sorting: {
      state: sorting,
      onSortingChange: setSorting,
    },

    onRowClick(event, row) {
      navigate(`/orders/${row.id}`);
    },
  });

  return (
    <DataTable instance={table}>
      <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <Heading>Draft Orders</Heading>
        <div className="flex gap-2">
          <DataTable.FilterMenu tooltip="Filter" />
          <DataTable.SortingMenu tooltip="Sort" />
          <DataTable.Search placeholder="Search..." />
        </div>
      </DataTable.Toolbar>
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable>
  );
};
export const config = defineRouteConfig({
  label: "Draft Orders",
  icon: ChatBubbleLeftRight,
});

export default CustomPage;
