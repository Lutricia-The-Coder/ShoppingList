# OrgList — Shopping List App

## Project Overview

OrgList is a responsive shopping list management web application built with React, TypeScript, Redux, and JSON Server.

The application allows authenticated users to create, manage, search, sort, and organise shopping lists and their items. Users can also manage their profile information and update their login credentials.

The application was developed as part of Task 4: Shopping List App for React Lesson 5.

---

## Objective

The objective of this project is to build a fully functional shopping list application that demonstrates:

* React and TypeScript development
* Redux state management
* CRUD operations
* JSON Server data persistence
* Authentication and authorisation
* Protected routes
* React Router navigation
* Responsive web design
* URL-based searching and sorting
* Reusable React components
* Profile management
* Secure password handling

---

## Features

### Authentication

Users can:

* Register a new account
* Log in using their email and password
* Log out of their account
* Remain authenticated while navigating the application
* Access protected pages only when logged in

Registration requires:

* Email address
* Password
* Name
* Surname
* Cell number

Passwords are hashed using SHA-256 before being stored in the JSON Server database.

---

### Profile Management

Authenticated users can:

* View their profile
* View their name, surname, email and cell number
* Edit their personal details
* Update their password
* Log out

Profile changes are persisted to JSON Server using PATCH requests.

---

### Shopping List Management

Users can create multiple shopping lists.

Shopping list items support:

* Item name
* Quantity
* Optional notes
* Category
* Image
* Date added
* Completion status

Users can:

* Create shopping lists
* View their existing shopping lists
* Open a shopping list
* Add items
* Edit items
* Delete items
* Delete shopping lists
* Mark items as completed
* Manage multiple lists

All list and item changes are persisted to JSON Server.

---

### Search

Users can search for shopping items by name.

The search keyword is stored in the URL so that the application can respond to URL changes.

Example:

```text
/dashboard?search=milk
```

When the search parameter changes, the displayed results are updated automatically.

---

### Sorting

Shopping items can be sorted according to:

* Name
* Category
* Date added

The selected sorting option is stored in the URL.

Example:

```text
/dashboard?sort=name
```

The application listens for URL changes and updates the displayed items accordingly.

---

### Categories

Shopping items can be classified using categories such as:

* Groceries
* Household
* Clothing
* Electronics

Categories make it easier for users to organise and manage their shopping items.

---

## Responsive Design

The application is designed to work across different screen sizes.

The following breakpoints are supported:

| Breakpoint | Device / Screen                  |
| ---------- | -------------------------------- |
| 320px      | Small mobile                     |
| 480px      | Mobile                           |
| 768px      | Tablet                           |
| 1024px     | Small desktop / tablet landscape |
| 1200px     | Desktop                          |

The layout, forms, navigation, shopping lists and profile interface adapt to different screen sizes.

---

## Pages

### 1. Login Page

Allows existing users to authenticate.

Features:

* Email input
* Password input
* Login validation
* Error messages
* Forgot password link
* Registration link

---

### 2. Registration Page

Allows new users to create an account.

Fields:

* First name
* Surname
* Email
* Cell number
* Password

Passwords are hashed before being saved.

---

### 3. Home / Dashboard Page

The main authenticated area of the application.

Users can:

* View shopping lists
* Create lists
* Open lists
* Manage items
* Search
* Sort
* Delete lists

---

### 4. Profile Page

Users can access their profile from the navigation bar.

The profile interface allows users to:

* View personal information
* Edit personal information
* Change their password
* Log out

---

## Route Protection

Protected routing is used to control access to authenticated pages.

Unauthenticated users cannot access protected application pages such as the dashboard.

Authenticated users are prevented from accessing authentication pages such as:

* Login
* Registration

This ensures that users are directed to the appropriate part of the application based on their authentication status.

---

## Data Management

The application uses JSON Server as its main data storage solution.

The database contains:

```text
users
shoppingLists
shoppingItems
```

Example structure:

```json
{
  "users": [],
  "shoppingLists": [],
  "shoppingItems": []
}
```

### Users

Users contain:

```text
id
email
password
name
surname
cellNumber
```

### Shopping Lists

Shopping lists contain:

```text
id
name
userId
dateAdded
```

### Shopping Items

Shopping items contain:

```text
id
listId
name
quantity
notes
category
image
dateAdded
completed
```

---

## CRUD Operations

The application uses REST API operations with JSON Server.

### Create

```text
POST
```

Used for creating:

* Users
* Shopping lists
* Shopping items

### Read

```text
GET
```

Used to retrieve:

* Users
* Shopping lists
* Shopping items

### Update

```text
PATCH
```

Used to update:

* User details
* Passwords
* Shopping lists
* Shopping items

### Delete

```text
DELETE
```

Used to delete:

* Shopping lists
* Shopping items

---

## State Management

Redux Toolkit is used for application state management.

Redux manages important authentication state such as:

```text
currentUser
isAuthenticated
```

The application uses Redux hooks such as:

```text
useAppSelector
useAppDispatch
```

This allows components to access and update shared application state without unnecessarily passing data through multiple component levels.

---

## Reusable Components

The application is divided into reusable components to improve maintainability and reduce duplicated code.

Examples include:

* Navbar
* Protected Route
* Shopping List components
* Shopping Item components
* Forms
* Buttons
* Profile interface
* Search controls
* Sorting controls

Components are designed to handle specific responsibilities rather than putting all application logic into a single component.

---

## Project Structure

A simplified project structure is:

```text
src/
│
├── components/
│   └── Navbar.tsx
│
├── features/
│   └── auth/
│       └── authSlice.ts
│
├── layouts/
│   └── AppLayout.tsx
│
├── pages/
│   ├── LoginPage.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── ...
│
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── shoppingListService.ts
│   └── shoppingItemService.ts
│
├── store/
│   ├── hooks.ts
│   └── store.ts
│
├── types/
│   ├── index.ts
│   └── encryption.ts
│
└── App.tsx
```

---

## Technologies Used

### Frontend

* React
* TypeScript
* React Router DOM
* Redux Toolkit
* CSS

### Backend / Data Storage

* JSON Server
* REST API

### Additional Libraries

* Axios
* CryptoJS
* Lucide React

---

## Password Security

Passwords are hashed using SHA-256 through CryptoJS.

The hashing function produces a consistent hexadecimal hash:

```text
SHA-256(password)
```

The original plain-text password is not stored in the database.

During login, the entered password is hashed using the same function and compared with the stored hash.

Password updates also hash the new password before sending it to JSON Server with PATCH.

---

## Password Reset

The forgot-password functionality allows a user to reset their password using their registered cell number.

The process is:

```text
User enters cell number
        |
        v
Application checks JSON Server
        |
        v
User is found
        |
        v
User enters new password
        |
        v
Password is hashed
        |
        v
PATCH /users/:id
        |
        v
New hashed password is stored
        |
        v
User can log in using the new password
```

---

## URL Search and Sorting

The application uses URL parameters for search and sorting.

### Search

```text
?search=milk
```

### Sorting

```text
?sort=name
```

This allows the application to respond when users manually change the URL.

The URL acts as part of the application's state for search and sorting.

---

## Accessibility

Accessibility considerations include:

* Labels for form fields
* Semantic buttons
* Keyboard-accessible controls
* Clear hover states
* Visible error messages
* Descriptive button actions
* Responsive layouts
* Appropriate colour contrast

Users can also share their shopping lists with others where the sharing functionality is implemented.

---

## User Interface

The application uses a consistent minimal design system.

The interface focuses on:

* Clear spacing
* Consistent typography
* Neutral colours
* Simple forms
* Rounded cards
* Clear buttons
* Consistent hover states
* Responsive layouts

The same visual language is used across authentication, dashboard, shopping list and profile interfaces.

---

## User Interaction

Interactive elements provide visual feedback when the user hovers over them.

Examples include:

* Buttons changing colour
* Links changing appearance
* Cards responding to interaction
* Form controls showing focus states
* Cursor changes on clickable elements

Notifications and validation messages are displayed where appropriate after user operations.

---

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Enter the project directory

```bash
cd your-project-name
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start JSON Server

If your project uses `db.json`, run:

```bash
npx json-server --watch db.json --port 3000
```

### 5. Start the React application

In another terminal:

```bash
npm run dev
```

The application can then be accessed through the local development URL provided by Vite.

---

## API

The application communicates with JSON Server through Axios.

The API contains endpoints such as:

```text
GET    /users
POST   /users
PATCH  /users/:id

GET    /shoppingLists
POST   /shoppingLists
PATCH  /shoppingLists/:id
DELETE /shoppingLists/:id

GET    /shoppingItems
POST   /shoppingItems
PATCH  /shoppingItems/:id
DELETE /shoppingItems/:id
```

---

## Git Branching

Development is carried out using the `development` branch.

The intended workflow is:

```text
main
 |
 └── development
       |
       ├── feature/authentication
       ├── feature/shopping-lists
       ├── feature/profile
       ├── feature/search
       └── feature/responsive-design
```

The `main` branch should contain the reviewed and completed project.

The `development` branch is used for active development.

---

## Development Practices

The project follows these development practices:

* Frequent Git commits
* Meaningful commit messages
* Reusable React components
* TypeScript types
* Separation of API services
* Redux for shared application state
* Protected routes
* Responsive CSS
* Small, focused functions
* Clear variable names
* Comments where additional explanation is useful

---

## Testing Checklist

Before submission, the following functionality should be tested.

### Authentication

* [ ] User can register
* [ ] Password is hashed
* [ ] User can log in
* [ ] Incorrect credentials are rejected
* [ ] User can log out
* [ ] Protected routes work
* [ ] Logged-in users cannot access login/register

### Profile

* [ ] User can view profile
* [ ] User can edit name
* [ ] User can edit surname
* [ ] User can edit cell number
* [ ] Changes persist after refresh
* [ ] User can change password
* [ ] New password is hashed
* [ ] New password works after logging in again

### Shopping Lists

* [ ] User can create a list
* [ ] User can view lists
* [ ] User can edit lists
* [ ] User can delete lists
* [ ] User can add items
* [ ] User can edit items
* [ ] User can delete items
* [ ] User can mark items complete

### Search and Sorting

* [ ] Search works
* [ ] Search keyword appears in URL
* [ ] URL search changes update the page
* [ ] Sort by name works
* [ ] Sort by category works
* [ ] Sort by date works
* [ ] Sort option appears in URL
* [ ] Changing the URL updates the displayed results

### Responsiveness

* [ ] 320px
* [ ] 480px
* [ ] 768px
* [ ] 1024px
* [ ] 1200px

---


## Author

Lutricia Ngomane


---

## Links

Hosted link : shopping-list-git-main-lutricia-s-projects.vercel.app

Github : https://github.com/Lutricia-The-Coder