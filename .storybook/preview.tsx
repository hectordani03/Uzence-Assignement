import type { Preview } from '@storybook/react-vite'
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0a0a0a" },
      ],
    },
  },

  // Definition of toolbar toggle
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "dark",
      toolbar: {
        icon: "mirror",
        items: ["light", "dark"],
      },
    },
  },

  // Change dark class in html
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === "dark";
      document.documentElement.classList.toggle("dark", isDark);

      return (
        <div className="p-6">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
