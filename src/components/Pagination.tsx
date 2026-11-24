import "./Pagination.css";
import { FC } from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

// сколько номеров страниц показывать слева и справа от текущей
const WINDOW = 1;

// Номера, которые видны: первая, последняя и страницы рядом с текущей; null — пропуск «…»
const visiblePages = (currentPage: number, totalPages: number): (number | null)[] => {
  const numbers = new Set([1, totalPages]);
  for (let page = currentPage - WINDOW; page <= currentPage + WINDOW; page++) {
    if (page >= 1 && page <= totalPages) numbers.add(page);
  }

  const pages: (number | null)[] = [];
  let previous = 0;
  for (const page of [...numbers].sort((x, y) => x - y)) {
    if (page - previous > 1) pages.push(null);
    pages.push(page);
    previous = page;
  }
  return pages;
};

// Пагинация плитки: предыдущая, первая, номера рядом с текущей, последняя, следующая
export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <BootstrapPagination size="sm" className="mb-0 tilesPager">
      <BootstrapPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
      />
      {visiblePages(currentPage, totalPages).map((page, index) =>
        page === null ? (
          <BootstrapPagination.Ellipsis key={`gap-${index}`} className="tilesPagerGap" disabled />
        ) : (
          <BootstrapPagination.Item
            key={page}
            active={page === currentPage}
            disabled={disabled}
            onClick={() => onPageChange(page)}
          >
            {page.toLocaleString("ru-RU")}
          </BootstrapPagination.Item>
        ),
      )}
      <BootstrapPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
      />
    </BootstrapPagination>
  );
};
