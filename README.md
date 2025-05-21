# Blog Platform Admin Panel - Frontend

A modern, responsive admin panel for managing blog content, authors, categories, and users.

## Features

- **Blog Management**: Create, edit, and delete blog posts with rich text editing
- **Media Management**: Upload and manage images for blog posts
- **Category Management**: Organize blogs with customizable categories
- **Author Management**: Manage author profiles and information
- **User Administration**: Control user access and permissions
- **SEO Tools**: Manage meta descriptions, keywords, and slugs
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technologies Used

This project is built with:

- **Vite**: Next generation frontend tooling
- **React**: UI component library
- **React Router**: For navigation and routing
- **Tanstack Query (React Query)**: For data fetching and state management
- **shadcn-ui**: Component library for consistent UI design
- **Tailwind CSS**: Utility-first CSS framework
- **Sonner**: Toast notifications
- **React Hook Form**: Form validation and handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

### Development

Start the development server:
```
npm run dev
```
or
```
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```
npm run build
```
or
```
yarn build
```

## Project Structure

- `/src/components` - Reusable UI components
- `/src/contexts` - React context providers
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and helpers
- `/src/pages` - Page components
- `/src/main.jsx` - Application entry point

## Deployment

You can deploy this project using Vercel, Netlify, or any other static site hosting service.

### Environment Variables

Create a `.env` file in the root directory with the following variables:
```
VITE_API_URL=your_backend_api_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
