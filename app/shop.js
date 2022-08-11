let inventarioProductos = []; // array vacío para capturar la info de stock.json
let carritoDeCompras = [];
const contenedorProductos = document.getElementById("contenedor-productos"); // Capturo el id "contenedor-productos" para mostrar dinámicamente todos los productos del array de artículos

// FUNCIONES

/*
1) Función para mostrar dinámicamente en el dom los productos, consultando en stock.json con fetch y await.
*/

const mostrarProductos = async () => {
    try {
        // ejecuto este código y si hay algún error lo capturo con catch. Await para esperar la request, y lo almaceno en la variable "response"
        const response = await fetch ("../stock.json") // --> en formato Json
        inventarioProductos = await response.json(); // parseo, formato array de objetos
        inventarioProductos.forEach(producto => {
            const article = document.createElement("article");
            article.classList.add("items");
            article.innerHTML += `<div class="product-img" id="item-img1" > 
                        <a href="#"><img src="${producto.img}"></a>
                    </div>
                    <div class="product-name">
                        <h5><a href="#">${producto.nombre}</a></h5>
                    </div>
                    <div class="description">
                        <p>${producto.desc}<br>
                        ${producto.dimensiones}
                        </p>
                    </div>
                    <div class="product-price">
                        <span class="price">$ ${producto.precio}</span>
                        <button type="button" class="btn agregar-al-carrito btn-dark border-0 rounded-0" id="btn${producto.id}">Agregar al carrito</button>
                    </div>`
                    
            contenedorProductos.appendChild(article) 

            const botonAgregarAlCarrito = document.getElementById(`btn${producto.id}`)
            botonAgregarAlCarrito.addEventListener("click", () => {
                botonAgregarAlCarrito.innerText = "Agregado!";
                agregarItem(producto.id);
                })

        })
        return inventarioProductos;

    } catch (error) {
        console.log("Hubo un error", error) //muestro el error
    }
}
mostrarProductos();

/*
2) Función para agregar items al carrito y guardarlos en storage     
*/

// let carritoDeCompras = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarItem(productoId){

    let productoSeleccionado = inventarioProductos.find(producto => producto.id === productoId); // busco con find si hay una coincidencia en el array de inventario con el productoId que paso por parámetro (1, 2, 3)
    console.log(productoSeleccionado);

    carritoDeCompras = JSON.parse(localStorage.getItem("carrito")) || [];
    console.log(carritoDeCompras);

    let search = carritoDeCompras.find(producto => producto.id === productoId) // chequeo si el producto ya está en el carrito.
    console.log(search)

    if (search === undefined){
            carritoDeCompras.push(productoSeleccionado);
            console.log("no se encontró el producto, lo agrego al carrito de compras")
            console.log(carritoDeCompras)
        } else {
            productoSeleccionado.cantidad++;
            console.log("actualizo cantidad del producto seleccionado")
            console.log(carritoDeCompras)
        }

        localStorage.setItem("carrito", JSON.stringify(carritoDeCompras))
}

/*
3) Función para mostrar artículos en el carrito 
*/

let mostrarCarrito = () =>{

    carritoDeCompras = JSON.parse(localStorage.getItem("carrito"))

    if (carritoDeCompras !== null) {
        console.log(carritoDeCompras);

    } else {
        let div = document.createElement("div");
        div.innerHTML = `<div id= "carrito-vacio">
                            <p> El carrito se encuentra vacío </p>
                        </div>`;
        const bodyOffcanvas = document.querySelector(".offcanvas-body");
        bodyOffcanvas.appendChild(div);
    }
}

mostrarCarrito();

// let totalCompra = 0;

// const carritoOffcanvas = (productoId) => {

//     totalCompra = carritoDeCompras.reduce((acc,el) => acc + el.precio, 0);

//     let div = document.createElement("div");

//     div.innerHTML = `<div id= "carrito-items">
//                         <p>${producto.nombre}</p>
//                         <p>Precio: $ ${producto.precio}</p>
//                         <p id"cantidad${producto.id}"> Cantidad ${producto.cantidad}</p>
//                         <button id "eliminar${producto.id}" class ="btn-eliminar"><i class="fa-solid fa-trash-can"></i></button> 
//                     </div>
//                     <div id= "carrito-footer">
//                         <p>TOTAL</p>
//                         <p class="carrito-total"></p>
//                         <button class="carrito-checkout" type="button">Comprar</button>
//                     </div>`;

//     const bodyOffcanvas = document.querySelector(".offcanvas-body");
//     bodyOffcanvas.appendChild(div);
// }

// carritoOffcanvas();


// let totalCompra;

// const carritoOffcanvas = () => {

//     let carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
//     console.log(carritoGuardado);
    
//     totalCompra = carritoGuardado.reduce((acc,el) => acc + el.precio, 0);

//     let div = document.createElement("div");

//     div.innerHTML = `<div id= "carrito-footer">
//                             <p>TOTAL $ ${totalCompra} </p>
//                             <p class="carrito-total"></p>
//                             <button class="carrito-checkout" type="button">Comprar</button>
//                     </div>`;

//     const bodyOffcanvas = document.querySelector(".offcanvas-body");
//     bodyOffcanvas.appendChild(div);
// }

// const bodyOffcanvas = document.getElementById("offcanvas-body")
const footerOffcanvas = document.getElementById("offcanvas-footer")

// función para renderizar carrito
