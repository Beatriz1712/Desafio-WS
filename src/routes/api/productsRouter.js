import { Router } from 'express';
import ProductManager from "../../../ProductManager.js"
const db = new ProductManager("productos.json")
// Importar todos los routers;
export const router = Router();
// Trae los productos
router.get("/", async (req, res) => {

    try {
        const { limit } = req.query
        let arrProduct = await db.getProducts()
        if (limit) arrProduct = arrProduct.slice(0, limit)
        res.status(200).json({ result: arrProduct })
    } catch (error) {
        res.status(500).json({ errror: error })
    }
})


// Endpoint para traer el producto solicitado by id en el params
router.get("/:pid", async (req, res) => {
    const { pid } = req.params
    if (pid) {
        try {

            let arrProduct = await db.getProductById(pid)
            res.status(200).json({ result: arrProduct })
        } catch (error) {
            res.status(500).json({ error: error })
        }
    } else res.status(400).json({ error: "Debe enviar un id de producto " })

})

router.post("/", async (req, res) => {
    const { title, description, code, price,
         stock,  img } = req.body

    if (title !== undefined && description !== undefined && code !== undefined && price !== undefined &&  stock !== undefined ) {
        try {
            let titleValidated = title.toString()
            let descriptionValidated = description.toString()
            let codeValidated = code.toString()
            let priceValidated = parseFloat(price)
            let stockValidated = parseInt(stock)
            let imgValidated = img.toString()
            
            let arrProduct = await db.addProduct(titleValidated, descriptionValidated, codeValidated, priceValidated, stockValidated, imgValidated)
            res.status(200).json({ result: arrProduct })
        } catch (error) {
            res.status(500).json({ error: error })
        }
    } else res.status(400).json({ error: "Datos incompletos" })

})

router.put("/:pid", async (req, res) => {
    const { pid } = req.params
    let objeChanges = { ...req.body }
    delete objeChanges.id;
    const keysArr = Object.keys(objeChanges)

    if (pid && keysArr.length > 0) {
        try {

            if (objeChanges.title) objeChanges.title = objeChanges.title.toString()
            if (objeChanges.description) objeChanges.description = objeChanges.description.toString()
            if (objeChanges.code) objeChanges.code = objeChanges.code.toString()
            if (objeChanges.price) objeChanges.price = parseFloat(objeChanges.price)
            if (objeChanges.stock) objeChanges.stock = parseInt(objeChanges.stock)
            if (objeChanges.img) objeChanges.img = objeChanges.img.toString();
                                 
            let arrProduct = await db.updateProduct(pid, objeChanges)
            res.status(200).json({ result: arrProduct })
        } catch (error) {
            res.status(500).json({ error: e })
        }
    } else res.status(400).json({ error: "Debe enviar un id de producto  y datos a modificar" })

})

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params


    if (pid) {
        try {
            let arrProduct = await db.deleteProduct(parseInt(pid))
            res.status(200).json({ result: arrProduct })
        } catch (error) {
            res.status(500).json({ error: error })
        }
    } else res.status(400).json({ error: "Debe enviar un id de producto " })

})

export const dbInstance= db



