import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../Badge';
import { DataGrid, type DataGridRow, type SortDirection } from './DataGrid';

const columns = [
  { key: 'contact', label: 'Contact', sortable: true },
  { key: 'phone', label: 'Phone' },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'category', label: 'Category' },
  { key: 'actions', label: 'Actions', width: '8rem' },
];

const rows: DataGridRow[] = [
  {
    id: '1',
    values: {
      contact: 'Jordan Smith',
      phone: '(614) 555-0142',
      company: 'Brightside Consulting',
      category: <Badge variant="client">Client</Badge>,
      actions: 'View',
    },
  },
  {
    id: '2',
    values: {
      contact: 'Ada Lovelace',
      phone: '(212) 555-0199',
      company: 'Analytical Engines',
      category: <Badge variant="lead">Lead</Badge>,
      actions: 'View',
    },
  },
  {
    id: '3',
    values: {
      contact: 'Grace Hopper',
      phone: '(415) 555-0123',
      company: 'Naval Systems',
      category: <Badge variant="vendor">Vendor</Badge>,
      actions: 'View',
    },
  },
];

const meta: Meta<typeof DataGrid> = {
  title: 'Components/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

export const Default: Story = {
  args: { columns, rows },
};

export const Sortable: Story = {
  render: () => {
    const [sortKey, setSortKey] = useState('contact');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const handleSort = (columnKey: string) => {
      if (columnKey === sortKey) {
        setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(columnKey);
        setSortDirection('asc');
      }
    };

    return (
      <DataGrid
        columns={columns}
        rows={rows}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    );
  },
};

export const Paginated: Story = {
  args: {
    columns,
    pageSize: 2,
    rows: [
      ...rows,
      {
        id: '4',
        values: {
          contact: 'Alan Turing',
          phone: '(206) 555-0177',
          company: 'Bletchley Labs',
          category: <Badge variant="partner">Partner</Badge>,
          actions: 'View',
        },
      },
      {
        id: '5',
        values: {
          contact: 'Katherine Johnson',
          phone: '(713) 555-0164',
          company: 'Orbital Mechanics',
          category: <Badge variant="client">Client</Badge>,
          actions: 'View',
        },
      },
    ],
  },
};

export const WithExpandedRow: Story = {
  args: {
    columns,
    rows: [
      {
        ...rows[0],
        expandedContent: <div style={{ padding: '1rem' }}>Extra detail for Jordan Smith.</div>,
      },
      rows[1],
    ],
  },
};
