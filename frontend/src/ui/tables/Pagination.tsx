"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "../form/Button";
import {
  MdOutlineKeyboardArrowLeft as ArrowLeft,
  MdOutlineKeyboardArrowRight as ArrowRight,
} from "react-icons/md";

const DOTS = "...";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}
export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex gap-1 my-4">
      <Button
        size="small"
        variant="secondary-outline"
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ArrowLeft />
      </Button>
      {pages.map((page, i) => (
        <Button
          key={i}
          size="small"
          variant="secondary-outline"
          aria-selected={page === currentPage}
          disabled={page === DOTS}
          onClick={() => currentPage !== page && setPage(Number(page))}
        >
          {page}
        </Button>
      ))}
      <Button
        size="small"
        variant="secondary-outline"
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}

function getPageNumbers(page: number, totalPages: number) {
  let previous: (string | number)[] = Array.from({ length: page - 1 }).map(
    (_, i) => i + 1
  );
  let next: (string | number)[] = Array.from({ length: totalPages - page }).map(
    (_, i) => i + page + 1
  );

  if (previous.length > 3) {
    previous = [previous[0], DOTS, previous[previous.length - 1]];
  }
  if (next.length > 3) {
    next = [next[0], DOTS, next[next.length - 1]];
  }

  return [...previous, page, ...next];
}
