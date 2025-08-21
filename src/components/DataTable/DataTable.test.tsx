import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from './DataTable'

type U = { id: number; name: string; age: number }

const data: U[] = [
  { id: 1, name: 'C', age: 40 },
  { id: 2, name: 'A', age: 20 },
  { id: 3, name: 'B', age: 30 },
]

const columns = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
] as const

// --- 1 test sorting works correctly ---
test('sorts by column', async () => {
  const user = userEvent.setup()
  render(<DataTable<U> data={data} columns={columns} />)

  // Click to sort by name column
  await user.click(screen.getByRole('button', { name: /sort by name/i }))

  // Extract text content from "name" column cells
  const cells = screen.getAllByRole('cell').filter((_, i) => i % 2 === 0)

  // Expect sorted order by name
  expect(cells.map((c) => c.textContent)).toEqual(['A', 'B', 'C'])
})

// --- 2 test multiple row selection ---
test('selects multiple rows', async () => {
  const user = userEvent.setup()
  const onSel = vi.fn()

  render(
    <DataTable<U>
      data={data}
      columns={columns}
      selectable
      selectionMode="multiple"
      rowKey="id"
      onRowSelect={onSel}
    />
  )

  // Select first and second rows
  await user.click(screen.getByRole('checkbox', { name: /select row 1/i }))
  await user.click(screen.getByRole('checkbox', { name: /select row 2/i }))

  // Verify callback called with selected rows
  expect(onSel).toHaveBeenLastCalledWith([
    { id: 1, name: 'C', age: 40 },
    { id: 2, name: 'A', age: 20 }
  ])
})
