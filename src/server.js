import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { router, dbInstance } from "./routes/api/productsRouter.js";
import { router as viewsRouter } from "./routes/views.router.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use('/api/products', router);
app.use('/', viewsRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log("Escuchando en puerto " + PORT);
});

const socketServer = new Server(httpServer);
let p = 0;
socketServer.on('connection', async (socket) => {
    p += 1;
    console.log(`${p} connected`);

    const products = await dbInstance.getProducts();
    socket.emit('productList', products);
//io.on
    socket.on('addProduct', async product => {
        console.log(" agregar producto");
        try {
            let c = await dbInstance.addProduct(product);
            const updatedProducts = await dbInstance.getProducts();
            console.log(updatedProducts);

            if (Array.isArray(updatedProducts)) socketServer.emit('productList', updatedProducts);
        } catch (error) {
            return;
        }
    });

    socket.on('deleteProduct', async (idProduct) => {
        try {
            const c = await dbInstance.deleteProduct(idProduct);
            console.log(c);
            const updatedProducts = await dbInstance.getProducts();
            if (Array.isArray(updatedProducts)) socketServer.emit('productList', updatedProducts);
        } catch (error) {
            return;
        }
    });

    socket.on('disconnect', (mssg) => {
        p -= 1;
        console.log(`${p} connected`);
        console.log(mssg);
    });
});
