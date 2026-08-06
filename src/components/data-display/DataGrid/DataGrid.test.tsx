import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid, type DataGridColumn, type DataGridRow } from './DataGrid';

const columns: DataGridColumn[] = [
  { key: 'contact', label: 'Contact', sortable: true },
  { key: 'company', label: 'Company' },
];

function makeRows(count: number): DataGridRow[] {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    values: {
      contact: `Contact ${index + 1}`,
      company: `Company ${index + 1}`,
    },
  }));
}

describe('DataGrid', () => {
  it('renders column headers and row cells', () => {
    render(<DataGrid columns={columns} rows={makeRows(2)} />);

    expect(screen.getByRole('columnheader', { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /company/i })).toBeInTheDocument();
    expect(screen.getByText('Contact 1')).toBeInTheDocument();
    expect(screen.getByText('Company 2')).toBeInTheDocument();
  });

  it('does not show pagination when rows fit on one page', () => {
    render(<DataGrid columns={columns} rows={makeRows(3)} pageSize={5} />);

    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
  });

  it('paginates rows and advances to the next page', () => {
    render(<DataGrid columns={columns} rows={makeRows(3)} pageSize={2} />);

    expect(screen.getByText('Showing 1-2 of 3')).toBeInTheDocument();
    expect(screen.getByText('Contact 1')).toBeInTheDocument();
    expect(screen.queryByText('Contact 3')).not.toBeInTheDocument();

    const previous = screen.getByRole('button', { name: /previous/i });
    expect(previous).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByText('Showing 3-3 of 3')).toBeInTheDocument();
    expect(screen.getByText('Contact 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('calls onSort and reflects the active sort in aria-sort', () => {
    const onSort = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={makeRows(2)}
        sortKey="contact"
        sortDirection="asc"
        onSort={onSort}
      />,
    );

    expect(screen.getByRole('columnheader', { name: /contact/i })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );

    fireEvent.click(screen.getByRole('button', { name: /contact/i }));
    expect(onSort).toHaveBeenCalledWith('contact');
  });

  it('renders expanded content for a row', () => {
    const rows: DataGridRow[] = [
      {
        id: '1',
        values: { contact: 'Contact 1', company: 'Company 1' },
        expandedContent: <span>Expanded detail</span>,
      },
    ];

    render(<DataGrid columns={columns} rows={rows} />);

    expect(screen.getByText('Expanded detail')).toBeInTheDocument();
  });
});
