# Frontend Application Documentation
The frontend application is built using Next.js, a popular React framework for building web applications. It also uses Redux for state management, and Tailwind CSS for styling.

## Live Url
The website is live in : `https://frontend-bookstore-nextjs.vercel.app/`


## Key Files and Components
pages/_document.tsx
This is a custom Document, which is commonly used to augment your application's <html> and <body> tags. This is necessary because Next.js pages skip the definition of the surrounding document's markup. Here, the Toaster component for showing toast notifications is added to the body.

pages/index.tsx
This is the main page of the application. It fetches the books data from the backend, and provides functionality to filter the books by category and search term. It also provides functionality to add a book to the cart.

components/ui/dropdown-menu
This is a dropdown menu component used for selecting a category to filter the books.

components/ui/button
This is a button component used throughout the application.

components/ui/toaster
This is a toaster component used for showing toast notifications.

components/layouts
This is a layout component used to wrap the main content of each page.

slices/cartSlice
This is a Redux slice for managing the cart state.

## Running the Application
To run the application, use the following commands:

npm run dev: Runs the application in development mode.
npm run build: Builds the application for production.
npm run start: Starts a production server.

## Dependencies

The application has several dependencies, including:

next: The Next.js library.
react and react-dom: The React library and its DOM bindings.
redux and react-redux: Libraries for managing application state.
axios: A library for making HTTP requests.
@radix-ui/react-*: Libraries for various UI components.
tailwindcss: A utility-first CSS framework.
Please refer to the package.json file for the full list of dependencies and their versions.
