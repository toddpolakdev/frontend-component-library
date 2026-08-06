import { useMemo, useState, type ReactNode } from 'react';

import {
  Body,
  Cell,
  ExpandedRow,
  GridTable,
  HeaderCell,
  HeaderRow,
  PageIndicator,
  Pagination,
  PaginationButton,
  PaginationControls,
  PaginationText,
  Row,
  RowGroup,
  SortButton,
  SortIndicator,
} from './DataGrid.styles';

export type SortDirection = 'asc' | 'desc';

export interface DataGridColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
}

export interface DataGridRow {
  id: string;
  values: Record<string, ReactNode>;
  expandedContent?: ReactNode;
}

export interface DataGridProps {
  columns: DataGridColumn[];
  rows: DataGridRow[];
  pageSize?: number;
  resetPageKey?: string | number;
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (columnKey: string) => void;
}

interface PagedDataGridProps {
  columns: DataGridColumn[];
  rows: DataGridRow[];
  pageSize: number;
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (columnKey: string) => void;
}

function isCenterColumn(columnKey: string) {
  return columnKey === 'category' || columnKey === 'actions';
}

function getAriaSortValue(
  columnKey: string,
  sortKey?: string,
  sortDirection?: SortDirection,
) {
  if (columnKey !== sortKey) {
    return 'none';
  }

  return sortDirection === 'desc' ? 'descending' : 'ascending';
}

function getSortIndicator(
  columnKey: string,
  sortKey?: string,
  sortDirection?: SortDirection,
) {
  if (columnKey !== sortKey) {
    return '↕';
  }

  return sortDirection === 'desc' ? '▼' : '▲';
}

export function DataGrid({
  columns,
  rows,
  pageSize = 10,
  resetPageKey = 'default',
  sortKey,
  sortDirection,
  onSort,
}: DataGridProps) {
  return (
    <PagedDataGrid
      key={`${resetPageKey}-${pageSize}`}
      columns={columns}
      rows={rows}
      pageSize={pageSize}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
}

DataGrid.displayName = 'DataGrid';

function PagedDataGrid({
  columns,
  rows,
  pageSize,
  sortKey,
  sortDirection,
  onSort,
}: PagedDataGridProps) {
  const [page, setPage] = useState(1);

  const gridTemplateColumns = columns
    .map((column) => column.width ?? 'minmax(0, 1fr)')
    .join(' ');

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const visibleRows = useMemo(
    () => rows.slice(startIndex, endIndex),
    [rows, startIndex, endIndex],
  );

  const firstVisibleRow = rows.length === 0 ? 0 : startIndex + 1;
  const lastVisibleRow = Math.min(endIndex, rows.length);
  const showPagination = rows.length > pageSize;

  function goToPreviousPage() {
    setPage((currentPageNumber) => Math.max(1, currentPageNumber - 1));
  }

  function goToNextPage() {
    setPage((currentPageNumber) => Math.min(totalPages, currentPageNumber + 1));
  }

  return (
    <div>
      <GridTable role="table">
        <HeaderRow role="row" style={{ gridTemplateColumns }}>
          {columns.map((column) => {
            const isSortable = Boolean(column.sortable && onSort);

            return (
              <HeaderCell
                $center={isCenterColumn(column.key)}
                role="columnheader"
                aria-sort={
                  isSortable
                    ? getAriaSortValue(column.key, sortKey, sortDirection)
                    : undefined
                }
                key={column.key}
              >
                {isSortable ? (
                  <SortButton type="button" onClick={() => onSort?.(column.key)}>
                    <span>{column.label}</span>
                    <SortIndicator aria-hidden="true">
                      {getSortIndicator(column.key, sortKey, sortDirection)}
                    </SortIndicator>
                  </SortButton>
                ) : (
                  column.label
                )}
              </HeaderCell>
            );
          })}
        </HeaderRow>

        <Body role="rowgroup">
          {visibleRows.map((row) => (
            <RowGroup key={row.id}>
              <Row
                $active={Boolean(row.expandedContent)}
                data-active={row.expandedContent ? 'true' : undefined}
                role="row"
                style={{ gridTemplateColumns }}
              >
                {columns.map((column) => (
                  <Cell
                    $center={isCenterColumn(column.key)}
                    $column={column.key}
                    role="cell"
                    key={`${row.id}-${column.key}`}
                    data-label={column.label}
                  >
                    {row.values[column.key]}
                  </Cell>
                ))}
              </Row>

              {row.expandedContent && <ExpandedRow>{row.expandedContent}</ExpandedRow>}
            </RowGroup>
          ))}
        </Body>
      </GridTable>

      {showPagination && (
        <Pagination>
          <PaginationText>
            Showing {firstVisibleRow}-{lastVisibleRow} of {rows.length}
          </PaginationText>

          <PaginationControls>
            <PaginationButton type="button" onClick={goToPreviousPage} disabled={currentPage === 1}>
              Previous
            </PaginationButton>

            <PageIndicator>
              Page {currentPage} of {totalPages}
            </PageIndicator>

            <PaginationButton
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </PaginationControls>
        </Pagination>
      )}
    </div>
  );
}

export default DataGrid;
