let inventarioProductos = []; // array vacío para capturar la info de stock.json
const contenedorProductos = document.getElementById("contenedor-productos"); // Capturo el id "contenedor-productos" para mostrar dinámicamente todos los productos del array de artículos
const productosPintados = []
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

let carritoDeCompras;

function agregarItem(productoId){
    let productoSeleccionado = inventarioProductos.find(producto => producto.id === productoId); // busco con find si hay una coincidencia en el array de inventario con el productoId que paso por parámetro (1, 2, 3). Traigo un objeto con ese id.

    carritoDeCompras = JSON.parse(localStorage.getItem("carrito")) || []; //verifico storage (array)
    let search = carritoDeCompras.find(producto => producto.id === productoId); // chequeo si el producto (objeto) ya está en el carrito (array)

    if (search === undefined || search.id !== productoId){
            console.log("no se encontró el producto seleccionado lo agrego al carrito de compras")
            carritoDeCompras.push(productoSeleccionado);
            localStorage.setItem("carrito", JSON.stringify(carritoDeCompras))
        } else {
            console.log("el producto seleccionado ya está en el carrito")
            search.cantidad++;

            carritoDeCompras = carritoDeCompras.filter((x) => x.id !== productoId)
            console.log(carritoDeCompras)
            carritoDeCompras.push(search)
            localStorage.setItem("carrito", JSON.stringify(carritoDeCompras))
        }
}

/*
3) Función para mostrar artículos en el carrito 
*/

let totalCompra = 0;
let mostrarCarrito = () =>{
    
    carritoDeCompras = JSON.parse(localStorage.getItem("carrito"))

    if (carritoDeCompras !== null) {

        carritoDeCompras.forEach((producto)=>{

            let subtotal = producto.precio * producto.cantidad;
            console.log(subtotal);

            if(productosPintados.find ((p) =>p.nombre === producto.nombre)){
                console.log("ya está pintado")
            } else {
                console.log("no está pintado")
                productosPintados.push(producto)
                let div = document.createElement("div");
            div.innerHTML = 
        `<div class="modal-body">
            <div class="offcanvas-carrito-items" id="offcanvas-carrito-items">
                <div class="carrito-item">
                    <div class="carrito-img">
                        <img src="${producto.img}" alt="">
                    </div>
                    <div class="carrito-desc">
                        <div>
                            <h6>${producto.nombre}</h6>
                            <div class="carrito-item-precio"><strong>$ ${subtotal}</strong></div>
                            <div class="carrito-item-cantidad">
                                <div id=${producto.id}>Cantidad: ${producto.cantidad}</div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        const bodyOffcanvas = document.querySelector(".offcanvas-body");
        bodyOffcanvas.appendChild(div)
        };
    
    })

        totalCompra = carritoDeCompras.reduce((acc,el) => acc + el.precio * el.cantidad, 0);
        console.log(totalCompra)

        let offcanvasFooter = document.createElement("div");
            offcanvasFooter.innerHTML = 
            `<div class="carrito-footer">
                <div class="carrito-total">
                    <h4>Total: $ ${totalCompra} </h4>
                </div>
                <div class="carrito-finalizar">
                    <button type="button" class="btn btn-dark border-0 rounded-0 btn-finalizar-compra">Finalizar compra</button>
                </div>
                <div class="carrito-eliminar">
                    <button type="button" class="btn btn-light border-0 rounded-0 btn-eliminar-compra">Eliminar artículos seleccionados</button>
                </div>
            </div>
            `
    
        const bodyOffcanvas = document.querySelector(".offcanvas-body");
        bodyOffcanvas.appendChild(offcanvasFooter)
        
    } else {
        let div = document.createElement("div");
        div.innerHTML = `<div id= "carrito-vacio">
                            <p> El carrito se encuentra vacío </p>
                        </div>`;
        const bodyOffcanvas = document.querySelector(".offcanvas-body");
        bodyOffcanvas.appendChild(div);
    }
}

mostrarCarrito()

/*
4) Funciones del carrito 
*/

const btnFinalizarCompra = document.querySelector(".btn-finalizar-compra").addEventListener("click", finalizarCompra)

function finalizarCompra() {
    removerStorage();

    let compraFinalizada = document.createElement("div");
    compraFinalizada.innerHTML = 
    `<div id= "compra-finalizada">
        <p> Muchas gracias por su compra! </p>
    </div>`

    const bodyOffcanvas = document.querySelector(".offcanvas-body");
    bodyOffcanvas.appendChild(compraFinalizada);
}

const btnBorrarCarrito = document.querySelector(".btn-eliminar-compra").addEventListener("click", removerStorage)

function removerStorage() {
    localStorage.removeItem("carrito")
}




