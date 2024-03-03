import express from 'express'
import { mongoConection } from './database/dbConnection.js'
import dotenv from 'dotenv'
import userRouter from './src/modules/auth/auth.routes.js'
import categoryRouter from './src/modules/category/category.routes.js'
import SubcategoryRouter from './src/modules/subcategory/subCategory.routes.js'
import BrandRouter from './src/modules/brand/brand.routes.js'
import CuponRouter from './src/modules/Cupon/Cupon.routes.js'
import ProductRouter from './src/modules/product/product.routes.js'
import cartRouter from './src/modules/cart/cart.routes.js'
import orderRouter from './src/modules/order/order.routes.js'
import reviewRouter from './src/modules/review/review.routes.js'
import cors from 'cors'
dotenv.config()
const app = express()
const port = 3000
mongoConection()

app.use(cors())
app.use(express.json())




app.use(userRouter)
app.use('/Category',categoryRouter)
app.use('/Subcategory',SubcategoryRouter)
app.use('/Brand',BrandRouter)
app.use('/Cupon',CuponRouter)
app.use('/Product',ProductRouter)
app.use('/Cart',cartRouter)
app.use('/Order',orderRouter)
app.use('/Review',reviewRouter)


app.use((error,req,res,next)=>{
    const statusCode= error.cause || 500
    return res.status(statusCode).json({
        sucess:'False',
        message:error.message , 
        stack: error.stack})
})

app.all('*',(req,res,next)=>{
 return next(new Error("page not Found" , {cause: 404}))
 })




app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))