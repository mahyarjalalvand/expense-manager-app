import type { Dispatch, SetStateAction } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination";
import { Loader2 } from "lucide-react";

interface TransactionsPaginationType {
  page: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
  isFetching: boolean;
}

function TransactionsPagination({ page, totalPages, setPage, isFetching }: TransactionsPaginationType) {
  if (totalPages <= 1) return null;
  return (
    <div className="center gap-2">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) {
                  setPage((prev) => prev - 1);
                }
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={pageNumber === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(pageNumber);
                  }}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) {
                  setPage((prev) => prev + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {isFetching && <Loader2 className="animate-spin" />}
    </div>
  );
}

export default TransactionsPagination;
