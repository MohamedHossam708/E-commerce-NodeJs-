identification

• This is an e-commerce app every section in this app can do all the necessary CRUD operations and All the authentication and validation is included in the app

• The SignUp Function in This app sends a verification email to the user in a dynamic way Using Nodemailer For Signing in you need to verify the email first

• Every order is counted and the available quantity of the product is dynamically changing depending on the order quantity (the quantity doesn’t change when adding the product to the Cart)

•The cart is created in sign in and it cleared when the order is done

• The app can make a dynamic invoice using pdfKit and apply a discount too

• MongoDB is The database used in this app

•The payment gateway is Stripe

How to initialize

First: npm install

Second: you need to configure these variables for .env file :
MONGO_CONN=
GMAIL=
PASSWORD=
SALT_ROUND=
SECRET_KEY=
COLUD_NAME=
API_KEY=
API_SECRET=
CLOUD_FOLDER_NAME=
StRIPE_KEY=
ENDPOINT_SECREAT=

This app can be easily modified to meet specific business needs.
