# Personal Account Frontend && BFF

```
nvm use 18.16.0
yarn
```

Next13 + React18 + TS + Sockets.io

### Frontend:
#### Main Stack<br />
Framework: <b>React18 + TS</b><br/>
UI: <b>MIU5 + Tailwind3</b><br/>
State manager: <b>Mobx</b><br/>
Sockets: <b>Sockets.io</b><br/>
Preprocessor: <b>Sass</b><br/>
Bug tracker: <b>Sentry</b><br/>
Lint: <b>Eslint</b><br>

#### Additionally
Forms: <b>react-hook-form</b><br>
- react-hook-form
- react-phone-number-input

Image compress: <b>compressorjs</b></br>
Charts: <b>apexcharts</b><br/>
 - react-apexcharts
 - apexcharts

Dropzone: <b>react-dropzone</b><br/>
Icons: <b>@tabler/icons-react</b><br/>

### Next:
Cache: <b>Redis</b><br/>
 - <a href="https://www.npmjs.com/package/ioredis">ioredis</a>

Decorators:
 - <b><a href="https://www.npmjs.com/package/next-api-decorators">next-api-decorators</a></b> - <b><a href="https://next-api-decorators.vercel.app/docs/">doc</a></b>
 - <b><a href="https://www.npmjs.com/package/path-to-regexp">path-to-regexp (Route matching)</a></b> - <b><a href="https://next-api-decorators.vercel.app/docs/routing/route-matching">doc</a></b><br />

Cookies: <b><a href="https://www.npmjs.com/package/nookies">nookies</a></b><br />
Sockets: <b><a href="https://www.npmjs.com/package/socket.io-client">socket.io (client)</a></b><br />
<a href="https://nextjs.org/docs/pages/building-your-application/deploying/production-checklist#error-handling">Error Handling:</a> <b><a href="https://www.npmjs.com/package/@sentry/nextjs">Sentry</a></b><br />
<a href="https://nextjs.org/docs/pages/building-your-application/deploying/production-checklist#logging">Logging:</a>
 - dep <b><a href="https://www.npmjs.com/package/pino">pino</a></b><br />
 - dev dep <b><a href="https://www.npmjs.com/package/pino-pretty">pino-pretty</a></b><br />

DTO: <b>class-transformer, class-validator</b><br />


### TS notes:
1) <a href="https://next-api-decorators.vercel.app/">next-api-decorators</a>
   (<a href="https://nextjs.org/docs/architecture/nextjs-compiler" target="_blank">with NextJS SWC</a>)
   <br>
In "compilerOptions":
``` json
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
```
p.s. <a href="https://github.com/instantcommerce/next-api-decorators/issues/320">why?</a>


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev | npm pino-pretty
# or
yarn dev | yarn pino-pretty
# or
pnpm dev | pnpm pino-pretty
# or
npx dev | pnpm pino-pretty
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
