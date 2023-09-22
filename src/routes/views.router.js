import { Router } from 'express';
import { dbInstance } from './api/productsRouter.js';
// Importar todos los routers;
export const router = Router();

router.get("/", async (req, res) => {

    try {
        const { limit } = req.query
        let productos = await dbInstance.getProducts()
        if (limit) arrProduct = arrProduct.slice(0, limit)
        res.render("index",{productos})
    } catch (error) {
        res.send(500).json({ error:error })
    }
})

router.get("/realtimeproducts", async (req, res) => {

    try {
        res.render("realTimeProducts")
    } catch (error) {
        res.send(500).json({ error:error })
    }
})






