import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DataTable, type DataTableProps } from './DataTable'

type User = { id: number; name: string; email: string; age: number }

const data: User[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@math.org', age: 36 },
  { id: 2, name: 'Grace Hopper', email: 'grace@navy.mil', age: 85 },
  { id: 3, name: 'Alan Turing', email: 'alan@bletchley.uk', age: 41 },
]

const columns = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
] as const

// --- Storybook meta configuration ---
const meta: Meta<typeof DataTable<User>> = {
  title: 'Data Display/DataTable',
  component: DataTable<User>,
  parameters: {
    docs: {
      description: {
        component: 'Table with sorting, row selection, loading, and empty states.'
      }
    }
  }
}
export default meta

type Story = StoryObj<typeof DataTable<User>>

export const Basic: Story = {
  args: { data, columns }
}

// --- table with sortable columns ---
export const Sortable: Story = {
  args: { data, columns }
}

// --- table in loading state ---
export const Loading: Story = {
  args: { data, columns, loading: true }
}

// --- table with no data (empty state) ---
export const Empty: Story = {
  args: { data: [], columns, emptyMessage: 'Nothing here yet' }
}

// ---  multiple row selection ---
export const SelectableMultiple: Story = {
  render(args) {
    const [selected, setSelected] = useState<User[]>([])
    return (
      <>
        <DataTable<User>
          {...args}
          selectable
          selectionMode="multiple"
          rowKey="id"
          onRowSelect={setSelected}
        />
        <pre style={{ marginTop: 12 }}>
          Selected: {selected.map((u) => u.name).join(', ')}
        </pre>
      </>
    )
  },
  args: { data, columns }
}

// --- single row selection ---
export const SelectableSingle: Story = {
  render(args) {
    const [selected, setSelected] = useState<User[]>([])
    return (
      <>
        <DataTable<User>
          {...args}
          selectable
          selectionMode="single"
          rowKey="id"
          onRowSelect={setSelected}
        />
        <pre style={{ marginTop: 12 }}>
          Selected: {selected.map((u) => u.name).join(', ')}
        </pre>
      </>
    )
  },
  args: { data, columns }
}
