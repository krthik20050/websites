@echo off
SET DATABASE_URL=postgresql://postgres@localhost:5432/camrents
SET BETTER_AUTH_SECRET=1IDDcV4YSyDoxzjTwKw6BWeODmbEmnTCR0I+FWvmSHk=
SET NEXT_PUBLIC_APP_URL=http://localhost:3000
SET GOOGLE_CLIENT_ID=test
SET GOOGLE_CLIENT_SECRET=test
pnpm dev
