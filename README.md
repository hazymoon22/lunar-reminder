# 🌙 Lunar Reminder

A modern web application for managing reminders based on the lunar calendar. Built with Astro, Tailwind CSS, DaisyUI, and Deno.

## ✨ Features

- 🌙 **Lunar Calendar Integration** - Track events based on the lunar calendar system
- 🔐 **Google OAuth Authentication** - Secure sign-in with Google accounts
- 📱 **Responsive Design** - Mobile-first UI with DaisyUI components
- 🎨 **Theme Support** - Beautiful sunset theme powered by DaisyUI
- ⚡ **Hybrid Rendering** - Static pages with on-demand SSR for dynamic routes
- 🎯 **Reminder Management** - Create, edit, and manage lunar-based reminders

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) - Modern web framework
- **Runtime**: [Deno](https://deno.land) - Secure JavaScript/TypeScript runtime
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS
- **UI Components**: [DaisyUI](https://daisyui.com) - Tailwind CSS component library
- **Rendering**: Hybrid (Static + SSR with Deno adapter)

## 📁 Project Structure

```
lunar_reminder/
├── public/              # Static assets
├── src/
│   ├── assets/
│   │   └── icons/       # SVG icons
│   ├── components/
│   │   ├── GoogleSignInCard.astro  # Auth UI
│   │   ├── Main.astro              # Main content wrapper
│   │   ├── Reminder.astro          # Reminder card component
│   │   └── Sidebar.astro           # Navigation sidebar
│   ├── layouts/
│   │   ├── Layout.astro            # Base layout
│   │   └── DrawerLayout.astro      # Drawer layout with sidebar
│   ├── pages/
│   │   ├── index.astro             # Login page
│   │   ├── upcoming.astro          # Upcoming reminders
│   │   ├── reminders.astro         # All reminders
│   │   └── auth/
│   │       └── callback.astro      # OAuth callback (SSR)
│   └── styles/
│       └── global.css              # Global styles & theme
├── astro.config.mjs                # Astro configuration
├── deno.json                       # Deno configuration
└── package.json                    # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed on your system

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd lunar_reminder
```

2. Install dependencies:
```bash
deno install
```

3. Start the development server:
```bash
deno task dev
```

4. Open your browser at `http://localhost:4321`

## 📝 Available Commands

All commands are run from the root of the project:

| Command | Action |
|---------|--------|
| `deno install` | Install dependencies |
| `deno task dev` | Start dev server at `localhost:4321` |
| `deno task build` | Build production site to `./dist/` |
| `deno task preview` | Preview production build locally |
| `deno task astro` | Run Astro CLI commands |

## 🎨 Theming

The app uses DaisyUI's **sunset** theme by default. To change the theme, edit `src/styles/global.css`:

```css
@plugin "daisyui" {
  themes: yourtheme --prefersdark;
}
```

Available themes: light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, and more.

## 🔧 Configuration

### Astro Config

- **Output mode**: `hybrid` (static by default, SSR for specific pages)
- **Adapter**: `@astrojs/deno` for Deno deployment
- **Styling**: Tailwind CSS v4 via Vite plugin

### SSR Pages

Pages with `export const prerender = false` are rendered on-demand:
- `/auth/callback` - OAuth callback handler

All other pages are statically generated at build time.

## 🚧 Development Status

This project is currently in development. Planned features:

- [ ] Full Google OAuth integration
- [ ] Database integration for user data
- [ ] Lunar calendar API integration
- [ ] Reminder notifications
- [ ] User settings and preferences
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This is a personal hobby project. Feel free to use, modify, and learn from the code!

## 🤝 Contributing

This is primarily a personal project, but contributions, suggestions, and feedback are welcome! Feel free to:
- Open an issue for bugs or feature requests
- Submit a Pull Request
- Fork the project and make it your own

---

Built with ❤️ using Astro, Tailwind CSS, DaisyUI, Hono and Deno
