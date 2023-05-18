# Backend for E-parent

## Technologies & Tools

- Fastify
- PostgreSQL
- TypeORM
- TypeScriopt

## Installation & Usage

1. Clone repo on your local machine:

   `git clone https://github.com/confidentmeerkat/backend-eparent.git `

2. Rename the .env.example file to .env
3. Install npm modules

    `yarn install`
4. Migrate database
    ` yarn typeorm migration:run -d src/dataSource `
5. Start server by `yarn start`
