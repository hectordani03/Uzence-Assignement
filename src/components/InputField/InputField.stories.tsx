import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputField } from './InputField'

// --- Storybook metadata configuration ---
const meta: Meta<typeof InputField> = {
  title: 'Form/InputField',
  component: InputField,
  parameters: {
    docs: {
      description: {
        component: 'Flexible input component with variants, sizes, and states.'
      }
    }
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['filled','outlined','ghost'] },
    size: { control: 'inline-radio', options: ['sm','md','lg'] },
    invalid: { control: 'boolean' },
    loading: { control: 'boolean' },
    clearable: { control: 'boolean' },
    passwordToggle: { control: 'boolean' },
  }
}
export default meta

type Story = StoryObj<typeof InputField>

// --- Default examples ---
export const States: Story = {
  args: { label: 'Username', placeholder: 'jdoe', loading: false, invalid: false }
}

export const Password: Story = {
  args: { label: 'Password', type: 'password', passwordToggle: true, variant: 'filled' }
}

export const WithError: Story = {
  args: { label: 'Email', invalid: true, errorMessage: 'Email is invalid' }
}
