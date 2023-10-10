# Pixiemist

A SaaS application for image editing using AI.

![Project Image](https://github.com/Sanjay-Ganapathi/Pixiemist/blob/main/public/thumbnail.png)

## Technologies

- ✨ Next js 13 `App Router`
- ⚒ Models from **Replicate**
- 💎 Styled using **Tailwind CSS**
- 🎨 Components and Theme using **Shadcn/ui**
- 🔒 Authentication using **NextAuth.js**
- 🐻 State Management using **Zustand**
- 📊 ORM using **Prisma**
- 🧧 Database - SQL on **PlanetScale**
- 💳 Subscriptions using **Stripe**
- 🔧 Form Validations using **Zod**
- 📷 Image Storage using **Cloudinary**
- 📤 Drag n Drop using **React-dropzone**
- 🌀 Written in **TypeScript**

## Running Locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env` and update the variables according to the need.

```sh
cp .env.example .env
```

3. Start the development server:

```sh
pnpm dev
```

<br />
<br />

_Note_: Sometimes the generations can take upto 3 to 5 mins because of Replicate's Cold Start. [Learn More](https://replicate.com/docs/how-does-replicate-work#cold-boots)
