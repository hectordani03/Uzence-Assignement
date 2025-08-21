import { useEffect, useState } from 'react'
import { InputField } from './components/InputField/InputField'
import { DataTable } from './components/DataTable/DataTable'

// --- User type definition ---
type User = { id: number; name: string; email: string; age: number }

// --- Demo data for playground and testing ---
const demoData: User[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@math.org', age: 36 },
  { id: 2, name: 'Grace Hopper', email: 'grace@navy.mil', age: 85 },
  { id: 3, name: 'Alan Turing', email: 'alan@bletchley.uk', age: 41 },
]

export default function App() {
  // --- State hooks ---
  const [value, setValue] = useState('hello')
  const [theme, setTheme] = useState('light')

  // --- Toggle theme handler ---
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  // --- Apply theme to <html> element ---
  useEffect(() => {
    if (theme === 'dark') {
      document.querySelector('html')?.classList.remove('light')
      document.querySelector('html')?.classList.add('dark')
    } else {
      document.querySelector('html')?.classList.remove('dark')
      document.querySelector('html')?.classList.add('light')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,216,255,0.5),rgba(255,255,255,0.9))]
      dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-neutral-900 dark:text-neutral-100 p-6 space-y-10">

      {/* --- Header with theme toggle --- */}
      <div className='flex w-full justify-between items-center'>
        <h1 className="text-2xl font-semibold">Uzence Design System – Demo Assignment</h1>
        
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center justify-center w-10 h-10 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          )}
        </button>
      </div>

      {/* --- Input fields section --- */}
      <section className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Your name"
          placeholder="Type something…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="Helper text"
          variant="outlined"
          size="md"
          clearable
        />

        <InputField
          label="Password"
          placeholder="••••••••"
          type="password"
          passwordToggle
          variant="filled"
          size="md"
        />
      </section>

      {/* --- Users table section --- */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Users</h2>
        <DataTable
          data={demoData}
          columns={[
            { key: 'name', title: 'Name',  dataIndex: 'name', sortable: true },
            { key: 'email', title: 'Email', dataIndex: 'email' },
            { key: 'age', title: 'Age',  dataIndex: 'age', sortable: true },
          ]}
          selectable
          onRowSelect={(rows) => console.log('selected:', rows)}
        />
      </section>
    </div>
  )
}
