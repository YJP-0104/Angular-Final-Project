
# Final Project Setup Guide

This README provides step-by-step instructions to set up and configure the **Final Project** using Angular and Material UI.

---
## Table of Contents

1. [Create Project](#1-create-project)
2. [Install Material UI](#2-install-material-ui)
3. [Add Components](#3-add-components)
4. [Add Common Module](#4-add-common-module)
5. [Add Auth Service](#5-add-auth-service)
6. [Add Auth Gaurd](#6-add-auth-gaurd)

--

## 1. Create Project

To start, create a new Angular project and navigate into the project directory:

```bash
ng new final-project
cd final-project
```

---

## 2. Install Material UI

Add Angular Material to your project:

```bash
ng add @angular/material@18
```

During the setup process, make the following choices:
- **Choose a prebuilt theme name**: `Indigo/Pink`
- **Set up global Angular Material typography styles**: `Yes`
- **Include the Angular animations module**: `Include, but disable animations`

---

## 3. Add Components

Generate the required components for the application using these commands:

```bash
ng generate component auth/login
ng generate component auth/register
ng generate component home
ng generate component dashboard
ng generate component manage-users
```

This will create the following components:
- `auth/login`
- `auth/register`
- `home`
- `dashboard`
- `manage-users`

---

## 4. Add Common Module

Create a shared module to house reusable components, directives, and pipes:

```bash
ng generate module shared
```

Import the `SharedModule` in your app or feature modules using `importProvidersFrom`:

### Example of Importing `SharedModule`:

In your `main.ts` or feature module file:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [],
  imports: [
  ],
  exports:[
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatToolbarModule,
    MatCardModule
  ]
})
export class SharedModule { }

```

## 5. Add Auth Service

Generate auth service for the application using these commands:

```bash
ng generate service auth
```

## 6. Add Auth Gaurd

Generate auth gaurd for the application using these commands:

```bash
ng generate gaurd auth
```

---

### You're all set to build your Angular application!
Happy coding! 🚀
