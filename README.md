# Sankranthi Foundation Website

A multilingual community foundation website built with Next.js, Prisma and PostgreSQL.

## Public experience

- Home overview, projects, about, services and special-case contact
- Research publications and reports
- Volunteer events and gallery
- Donation, suggestions and contact forms
- Community Nail Spa treatment menu and online appointment requests

## Admin

The admin area at `/admin` manages site content, settings, translations, donations, messages, suggestions and Nail Spa bookings.

Starter login after seeding:

- Email: `admin@sankranthi.org`
- Password: `admin12345`

Change the starter password immediately after the first login.

## Local setup

1. Copy `.env.example` to `.env` and configure PostgreSQL, authentication and payment values.
2. Install dependencies with `pnpm install`.
3. Run `pnpm db:push`.
4. Run `pnpm db:seed:settings -- --force`, followed by `pnpm db:seed`.
5. Start the site with `pnpm dev`.

Use `pnpm build` for a production build.
