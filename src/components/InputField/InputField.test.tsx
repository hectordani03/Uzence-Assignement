import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputField } from './InputField'

// --- 1 test for renders label and helper text correctly ---
test('renders label and helper', () => {
  render(<InputField label="Name" helperText="Helper" />)

  // Verify label is rendered
  expect(screen.getByLabelText('Name')).toBeInTheDocument()

  // Verify helper text is rendered
  expect(screen.getByText('Helper')).toBeInTheDocument()
})

// --- 2 test shows error state when invalid ---
test('shows error when invalid', () => {
  render(<InputField label="Email" invalid errorMessage="Bad email" />)

  // Error message should be displayed
  expect(screen.getByText('Bad email')).toBeInTheDocument()

  // Input should have aria-invalid attribute
  expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
})

// --- 3 test clear button removes input value ---
test('clear button clears value', async () => {
  const user = userEvent.setup()

  render(<InputField label="X" value="abc" onChange={() => {}} clearable />)

  // Simulate clicking the clear button
  await user.click(screen.getByRole('button', { name: /clear input/i }))

  // Expect the value to be cleared
  expect(screen.getByLabelText('X')).toHaveValue('')
})
