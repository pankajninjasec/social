# Installation 


### Clone the repo
`git clone https://github.com/pankajninjasec/social_media.git`


### For Backend

`cd backend && npm install`

#### Make sure to create a env named .env in backend directory

` DATABASE_URL="postgresql://postgres:test123@localhost:5432/mydb" `
`PORT=8000`
`SECRET_KEY="secret" `

#### make migrations for database
` npx prisma migrate dev --name init ` 
 `npx prisma db seed `
`npx prisma generate `
`npx prisma db push `

#### Run the backend
` npm run dev `


### Now run frontend

`cd socialmedia && npm install && npm run dev`


# social
