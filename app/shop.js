let inventarioProductos = []; // array vacío para capturar la info de stock.json
const contenedorProductos = document.getElementById("contenedor-productos"); // Capturo el id "contenedor-productos" para mostrar dinámicamente todos los productos del array de artículos

// FUNCIONES

// Función para mostrar dinámicamente en el dom los productos, consultando en stock.json.

const mostrarProductos = async () => {
    try {
        // ejecuto este código y si hay algún error lo capturo con catch. Await para esperar la request, y lo almaceno en la variable "response"
        const response = await fetch ("../stock.json") // --> en formato Json

        inventarioProductos = await response.json(); // parseo, formato array de objetos
        
        inventarioProductos.forEach(producto => {
            const article = document.createElement("article"); // genero el elemento article
    
            article.classList.add("items"); // agrego clase ".items"
    
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
                botonAgregarAlCarrito.innerText = "Agregado!"
                carritoOffcanvas(producto.id);
                // console.log(producto.id);
                // console.log(producto.nombre);
                // console.log(producto.precio);
            })

        })

        return inventarioProductos;

    } catch (error) {
        console.log("Hubo un error", error) //muestro el error
    }
}

mostrarProductos();

// Función para mostrar en offcanvas el detalle del carrito

let carritoDeCompras = []; // --> array vacío para almacenar los datos que obtengo con click
let totalCompra = 0;

const carritoOffcanvas = (productoId) => {
    let producto = inventarioProductos.find(producto => producto.id === productoId); // busco con find si hay una coincidencia en el array con el productoId que paso por parámetro (1, 2, 3)

    if (producto != undefined){
        carritoDeCompras.push(producto);
    }

    totalCompra = carritoDeCompras.reduce((acc,el) => acc + el.precio, 0);

    let div = document.createElement("div");

    div.innerHTML = `<div id= "carrito-items">
                        <p>${producto.nombre}</p>
                        <p>Precio: $ ${producto.precio}</p>
                        <p id"cantidad${producto.id}"> Cantidad ${producto.cantidad}</p>
                        <button id "eliminar${producto.id}" class ="btn-eliminar"><i class="fa-solid fa-trash-can"></i></button> 
                    </div>
                    <div id= "carrito-footer">
                        <p>TOTAL</p>
                        <p class="carrito-total"></p>
                        <button class="carrito-checkout" type="button">Comprar</button>
                    </div>`;

    const bodyOffcanvas = document.querySelector(".offcanvas-body");
    bodyOffcanvas.appendChild(div);
    guardarStorage();
}

carritoOffcanvas();

// Función para guardar en Storage

function guardarStorage (){
    let storage = localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
    console.log(storage)
    let carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
    console.log(carritoGuardado)
}

guardarStorage();

// function renovarStorage (){
//     localStorage.removeItem("carritoGuardado");
//     let carritoGuardado = localStorage.setItem("Carrito", JSON.stringify(carritoDeCompras))
// }


