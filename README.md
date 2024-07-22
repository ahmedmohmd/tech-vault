<p align="center">
  <a href="https://github.com/ahmedmohmd/tech-vault" target="blank"><img src="./public//logo.svg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center">Your Gateway to Ultimate Performance</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
</p>

## Description

[Tech Vault](https://github.com/ahmedmohmd/tech-vault) is a backend API for an ecommerce platform selling tech products like PC hardware, software, games, storage devices, office equipment, and more. Built with NestJS, Node.js, and TypeScript, it uses TypeORM with Postgres for persistent storage and Redis for caching, ensuring performance and reliability..

## Technologies Used

### Back End

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, scalable backend applications.
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript which compiles to plain JavaScript.

### Database

- **Database**: [PostgreSQL](https://www.postgresql.org/) - A powerful, open source relational database.
- **ORM**: [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript (ES7, ES6, ES5) targeting MongoDB, MySQL, PostgreSQL, SQLite.

### Authentication

- **JWT**: [JWT](https://jwt.io/) - An open standard for securely transmitting information between parties as a JSON object.
- **Passport**: [Passport](http://www.passportjs.org/) - Simple, unobtrusive authentication middleware for Node.js.

### Other Technologies

- **Email**: [Nodemailer](https://nodemailer.com/about/) - Send e-mails from Node.js.
- **Payments**: [Stripe](https://stripe.com/) - Online payment processing platform.
- **File Uploads**: [Multer](https://www.npmjs.com/package/multer) - Node.js middleware for handling `multipart/form-data`.
- **Image Storage**: [Cloudinary](https://cloudinary.com/) - Image and video management service.
- **Security**: [Helmet](https://helmetjs.github.io/) - Help secure Express/Connect applications with various HTTP headers.

### Development Tools

- **Linting**: [ESLint](https://eslint.org/) - The pluggable linting utility for JavaScript and JSX.
- **Formatting**: [Prettier](https://prettier.io/) - An opinionated code formatter.

## Key Features

Sure! Here is an updated list of features with appropriate icons:

# App Features

## 🧑‍💻 Authentication & Security

- User credential authentication
- Google authentication with JWT and Google OAuth for enhanced security
- Password reset functionality linked to the user's email
- Email verification process upon registration
- Support for multiple user emails with primary and secondary designations

## User Profile & Media 👤

- Users can add/remove phone numbers and set a primary number
- Profile photo upload during registration and the ability to change it at any time, powered by Cloudinary and Multer

## 🔔 Notifications

- Email notifications using Nodemailer and Gmail
- In-app notifications for an improved user experience
- Redis-based caching layer for enhanced app performance

## 💰 💳 Payments & Invoices

- Integration with Stripe and PayPal for payment processing
- Promo codes with customizable usage limits and activation controls
- Invoicing for completed orders

## 🔍 Product Search & Discovery

- Categorized product listings for efficient browsing
- Advanced filtering and sorting options
- Product reviews to aid user decision-making
- Wishlist feature for users to save products for future reference

## 🛒 Cart & Checkout

- Persistent user cart for seamless shopping
- Order confirmation and payment processing

## Performance Optimization 📈

- Redis caching layer for improved app speed

## CI/CD & Deployment 🚀

- Automated CI/CD pipeline using GitHub Actions for dependency installation, linting, testing, and deployment
- Docker containerization with Docker Compose for the main app, PostgreSQL, Redis, and Nginx
- Nginx as a web server and reverse proxy

## Additional Features 🌟

- Well-designed database schema
- Email notifications for user registration

I've added emojis that conceptually represent each category and feature, making the list more visually appealing and engaging. Feel free to modify or replace the icons to match your personal preference or project theme!

## Installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Ahmed Muhammad](https://kamilmysliwiec.com)
- Website - [Ahmed Muhammad](https://a7m3d.vercel.app/)

## License

Nest is [MIT licensed](LICENSE).
