import React, { memo, useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { ReactElement } from "react";
/* -------------------- Types -------------------- */
type Header = {
  name: string;
  position?: "left" | "center" | "right";
};

type SafeRec = Record<string, unknown>;

export interface PaginatedSearchTableProps<T extends SafeRec> {
  /** Full dataset to display (no fetching here) */
  items: T[];
  /** Column headers */
  headers: Header[];
  /** Render a row (<tr>...</tr>) for an item */
  renderRow: (item: T, index: number) => React.ReactNode;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Items per page */
  itemsPerPage?: number;
  /**
   * Function that returns a string used for searching.
   * If omitted, a safe fallback is used: prefer "title" if string; else JSON.stringify(item).
   */
  searchBy?: (item: T) => string;
  /**
   * Optional: show a Refresh button and call this when clicked.
   * (Use it to re-supply `items` from the parent if needed.)
   */
  onRefresh?: () => void;
  /** Optional external loading flag (for when parent is refreshing items) */
  isLoading?: boolean;
}

/* -------------------- Inline DataTable -------------------- */
const DataTable = memo(function DataTable({
  headers,
  children,
}: {
  headers: Header[];
  children: React.ReactNode;
}) {
  return (
    <div className="relative my-2  rounded-lg">
      <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0  rounded-lg ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-600  rounded-lg ">
          <thead className="text-xs text-gray-50 uppercase  bg-teal-500">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`poppins-bold text-sm px-6 py-4 ${
                    index === 0 ? "rounded-tl-md" : ""
                  } ${index === headers.length - 1 ? "rounded-tr-md" : ""}`}
                >
                  <span
                    className={`flex text-center items-center ${
                      header.position === "center"
                        ? "justify-center"
                        : "justify-start"
                    }`}
                  >
                    {header.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
});

/* -------------------- Main Component -------------------- */
function PaginatedSearchTableInner<T extends SafeRec>({
  items,
  headers,
  renderRow,
  searchPlaceholder = "Search...",
  itemsPerPage = 10,
  searchBy,
  onRefresh,
  isLoading = false,
}: PaginatedSearchTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getSearchText = useCallback(
    (item: T) => {
      if (searchBy) return searchBy(item);

      if (typeof item === "string") return item;

      // Prefer a "title" field if it exists and is a string
      if ("title" in item && typeof (item as SafeRec).title === "string") {
        return String((item as SafeRec).title);
      }

      try {
        return JSON.stringify(item);
      } catch {
        return String(item);
      }
    },
    [searchBy]
  );

  // Filtered list based on search term
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => getSearchText(it).toLowerCase().includes(q));
  }, [items, searchTerm, getSearchText]);

  // Pagination math
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  // Current page slice
  const displayData = useMemo(
    () => filtered.slice(indexOfFirst, indexOfLast),
    [filtered, indexOfFirst, indexOfLast]
  );

  // Counts for footer
  const count = useMemo(
    () => ({
      from: filtered.length === 0 ? 0 : indexOfFirst + 1,
      to: Math.min(indexOfLast, filtered.length),
      total: filtered.length,
    }),
    [filtered.length, indexOfFirst, indexOfLast]
  );

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = indexOfLast >= filtered.length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const nextPage = () => !isNextDisabled && setCurrentPage((p) => p + 1);
  const prevPage = () => !isPrevDisabled && setCurrentPage((p) => p - 1);

  return (
    <div className="w-full rounded-lg text-gray-900 m-6">
      {/* Search + Optional Refresh */}
      <div className="w-full flex items-center mb-3 gap-1 z-50 ">
        <div>
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
            className="min-w-[250px] h-10 border-teal-500 shadow-none"
          />
        </div>

        {onRefresh && (
          <div>
            <button
              onClick={onRefresh}
              className="py-3 bg-[#004A98] text-gray-50"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <DataTable headers={headers}>
        {isLoading ? (
          <tr>
            <td colSpan={headers.length} className="text-center py-4">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 "></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            </td>
          </tr>
        ) : displayData.length > 0 ? (
          displayData.map((item, index) => renderRow(item, index))
        ) : (
          <tr>
            <td
              colSpan={headers.length}
              className="text-center px-6 py-4 text-gray-800  border-b"
            >
              No Available Data
            </td>
          </tr>
        )}
      </DataTable>

      {/* Pagination */}
      <div className="w-full flex justify-between pt-5 px-2 poppins-semibold">
        <div>
          <span className="text-sm text-gray-600 ">
            Showing{" "}
            <span className=" text-gray-600 ">
              {count.from}
            </span>{" "}
            to{" "}
            <span className=" text-gray-600 ">
              {count.to}
            </span>{" "}
            of{" "}
            <span className=" text-gray-600 ">
              {count.total}
            </span>{" "}
            Entries
          </span>
        </div>
        <div className="flex">
          <button
            onClick={prevPage}
            disabled={isPrevDisabled}
            className={`flex items-center justify-center px-3 h-8 me-3 text-sm font-medium border rounded-lg ${
              isPrevDisabled
                ? "text-gray-400 bg-gray-200 cursor-not-allowed  border-gray-50 "
                : "text-gray-50 bg-teal-600 hover:bg-gray-100 hover:text-gray-700  border-gray-50 "
            }`}
          >
            Prev
          </button>
          <button
            onClick={nextPage}
            disabled={isNextDisabled}
            className={`flex items-center justify-center px-3 h-8 text-sm font-medium border rounded-lg ${
              isNextDisabled
                ? "text-gray-400 bg-gray-200 cursor-not-allowed  border-gray-50 "
                : "text-gray-50 bg-teal-600 hover:bg-gray-100 hover:text-gray-700  border-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function PaginatedSearchTable<T extends SafeRec>(
  props: PaginatedSearchTableProps<T>
): ReactElement {
  return <PaginatedSearchTableInner {...props} />;
}

// memoize and keep the same type
export default memo(PaginatedSearchTable) as typeof PaginatedSearchTable;
