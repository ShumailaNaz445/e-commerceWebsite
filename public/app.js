// Log in && sign up && forget password
function signUp() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contact = document.getElementById('contact').value;
    const password = document.getElementById('password').value;
    axios.post('http://localhost:3000/myData', {
        name: name,
        contact:contact,
        email: email,
        password: password,
    }
    ).then((res) => {
        console.log(res);
        alert(res.data.message)
    }).catch((error) => {
        alert(error.message);

    })
}


function logIn() {
  var email1 = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  console.log(email1, password);

axios.post('http://localhost:3000/logindata', {
    email: email1,
    password: password
    }
    // ,{
    // haders:{
    //   'Authorization' : token    
    // },
    // }
  ).then((res) => {
    const { token , isAdmin } = res.data;

    console.log("isAdmin value:", isAdmin); 
    
    localStorage.setItem('authToken', token);
    
    localStorage.setItem('userId', res.data.token);
    console.log("userId:" , res.data.token);

    if (isAdmin) {
      window.location.href = 'adminpanel.html';
    } else {
      window.location.href = 'customer.html'; 
    }
  }).catch((error) => {
      console.log("err >>>> ", error.message);
  });
}


function forgetPassword() {
  var email1 = document.getElementById('email').value;

  axios.post('http://localhost:3000/forget-password', {
      email: email1
  })
  .then((res) => {
      console.log("Response >>>>>", res);
      alert(res.data.message);
  })
  .catch((error) => {
      console.error("Error >>>>", error);

      if (error) {
          alert(error.data.message);
      } else {
          alert(`Request error: ${error.message}`);
      }
  });
}

function logOut() {
  localStorage.removeItem('token');
  
  window.location.href = './login.html';
}

function openSidebar() {
  const sideBar = document.getElementById('side-bar');
  sideBar.classList.add("active");
}

function closeSidebar() {
  const sidebar = document.getElementById('side-bar');
  sidebar.classList.remove("active");
}

//render product data for admin
const getData = () => {
  axios.get('http://localhost:3000/getProduct')
    .then((res) => {
      const container = document.getElementById('product-detail');
      container.innerHTML = ''; 

      res.data.data.map((product) => {       
        const productHTML = `
          <li data-id="${product.id}">
            <div>
              <img src= "${product.productImage}" alt="product Image" /img>
              <h1>${product.productName}</h1>
              <p>${product.description}</p>
              <p>${product.category}</p>
              <p>${product.price}</p>
              <button onclick="deleteData('${product._id}')">Delete</button>
              </div>
          </li>
        `;        
        container.innerHTML += productHTML;
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
};


// Delete product from the backend
const deleteData = (_id) => {
  axios.delete(`http://localhost:3000/deleteproduct/${_id}`)
  
    .then((res) => {
      alert(res.data.message);
      document.getElementById('product-detail').innerHTML = ''
      getData(); 
    })
    .catch((error) => {
      console.log(error.message);
    });
};

// postdata to backend
function dataToBackend() {
  var productName1 = document.getElementById("name").value;
  var productprice = document.getElementById("price").value;
  var productdescription = document.getElementById("description").value;
  var productcategory = document.getElementById("category").value;
  var productImage = document.getElementById("productImage").files[0];

  var formData = new FormData();
    formData.append("productName", productName1);
    formData.append("price", productprice);
    formData.append("description", productdescription);
    formData.append("category", productcategory);
    formData.append("productImage", productImage);

  axios
    .post("http://localhost:3000/addproduct",  formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    })
    .then((res) => {
      console.log("response >>>>>", res);
      alert(res.data.message);
      document.getElementById("name").value = "";
      document.getElementById("description").value = "";
      document.getElementById("category").value = "";
      document.getElementById("price").value = "";
      document.getElementById("productImage").value = "";
      
    })
    .catch((error) => {
      console.log("error >>>> ", error.message);
    });
}

// render customer products
const userData = () => {
  axios.get('http://localhost:3000/getProduct')
    .then((res) => {
      const container = document.getElementById('product-list');
      container.innerHTML = '';       

      res.data.data.map((product) => {
        console.log(res.data);
        const productHTML = `
          <li data-id="${product._id}">
            <div>
              <img src="${product.productImage}" alt="${product.productName}" class="product-img" id='product-image' />
              <h3 class="product-title" id='product-name'>${product.productName}</h3>
              <p class="product-price" id='product-price'>${product.price}</p>
              
              <button id='addCart' onclick="handle_addCartItem('${product._id}', '${product.productImage}', '${product.productName}', '${product.price}')"> Add to Cart</button>
            </div>
          </li>
          
        `;        
        container.innerHTML += productHTML;
        
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
};


//search filter
function searchFilter(){
  const searchValue = document.getElementById('search-bar') .value
  let item = '';
  if(searchValue){
    item += `search = ${searchValue}`
  }
  axios.get(`http://localhost:3000/getproduct?${item}`)
  .then( (res) =>{
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    if(res.data.data.length === 0){
      container.innerHTML = "No products found matching your criteria";
    }else{
      const products = res.data.data;

      const searchResults = products.filter((product) =>
        product.productName.toLowerCase().includes(searchValue.toLowerCase())
      );

      const otherProducts = products.filter((product) =>
        !product.productName.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      searchResults.forEach((product) => {
        console.log(res.data);
        const productHTML = `
          <li data-id="${product._id}">
            <div>
              <img src="${product.productImage}" alt="${product.productName}" class="product-img" id='product-image' />
              <h1 class="product-title" id='product-name'>${product.productName}</h1>
              <p class="product-price" id='product-price'>${product.price}</p>
              
              <button id='addCart' onclick="handle_addCartItem('${product._id}', '${product.productImage}', '${product.productName}', '${product.price}')"> Add to Cart</button>
            </div>
          </li>
          
        `;        
        container.innerHTML += productHTML;
        
      });


      otherProducts.forEach((product) => {
        const productHTML = `
          <li data-id="${product._id}>
            <div>
              <img src="${product.productImage}" alt="${product.productName}" class="product-img" id='product-image' />
              <h1 class="product-title" id='product-name'>${product.productName}</h1>
              <p class="product-price" id='product-price'>${product.price}</p>
              
              <button id='addCart' onclick="handle_addCartItem('${product._id}', '${product.productImage}', '${product.productName}', '${product.price}')"> Add to Cart</button>
            </div>
          </li>
        `;
        container.innerHTML += productHTML; 
      });
    }
  })
  .catch((error) => {
      console.log('Error fetching products:', error.message);
      document.getElementById('product-list').innerHTML = 'An error occurred while fetching products.';
  });
}


//render user data
const getUserData = () => {
  axios.get('http://localhost:3000/getdata')
    .then((res) => {      
      let container = document.getElementById('user-list');
      container.innerHTML = '';
      

      res.data.data.map((user) => {
        const userHTML = `
          <div data-id="${user.id}" class="user-card">
            <div>
              <h2>${user.name}</h2>
              <p>${user.email}</p>
              <p>${user.contact}</p>
              <button onclick="deleteUserData()" class="delete-user-btn">Delete</button>
            </div>
          </div>
        `;
        container.innerHTML += userHTML;
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
};


// Delete user from the backend
const deleteUserData = (_id) => {
  axios.delete(`http://localhost:3000/deletedata/${_id}`)
    .then((res) => {
      alert('User deleted successfully' , res.data.message);

      getUserData();
      console.log(">>>>>" , res);
      

    })
    .catch((error) => {
      console.log("Error deleting user:", error.message);
    });
};


// Cart
function openCart() {
  const cart = document.getElementById('cart-section');
  cart.classList.add("active");
}

function closeCart() {
  const cart = document.getElementById('cart-section');
  cart.classList.remove("active");
}


function renderCartItems() {

  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; 
  const cartContent = document.getElementById('cart-content');
  cartContent.innerHTML = ''; 
  cartItems.forEach((item) => {
    const cartItem = `
      <div class="cart-item" id="${item._id}">
        <img src="${item.productImage}" alt="${item.productName}" class="product-image" />
        <p class="product-name">${item.productName}</p>
        <p class="product-price">${item.price}</p>
        <p class="para">
         <button class="decrease" onclick="updateQuantity('${item._id}', -1)"> < </button> 
         <span class="quantity">${item.quantity}</span> 
         <button class="increase" onclick="updateQuantity('${item._id}', 1)"> > </button> 
        </p>
        <i class="fa-solid fa-trash" onclick="removeCartItem('${item._id}')" id="trash"></i>
      </div>
    `;
    cartContent.innerHTML += cartItem;
  });
}


const token = localStorage.getItem('authToken');

function handle_addCartItem(_id, productImage, productName, productPrice) { 
  
  if (!token) {
    alert('Please log in to add items to your cart.');
    window.location.href = 'login.html';
    return;
  }
  
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  const productExists = cartItems.find((item) => item._id === _id);
  if (productExists) {
    alert("This product is already in the cart.");
    return;
  }

  const newProduct = {
    _id: _id,
    productImage: productImage,
    productName: productName,
    price: parseFloat(productPrice),
    quantity: 1,
  };
  console.log(newProduct);
  
  
  cartItems.push(newProduct);
  
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  console.log("cartItems from localStorage:", localStorage.getItem('cartItems'));
  console.log(cartItems);
    

  renderCartItems();
  cartCount();
  updateTotalPrice();

}



function updateQuantity(_id , change) {
  
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) ||  [];
  cartItems = cartItems.map((item) => {
    if (item._id === _id) {
      item.quantity += change;
      if (item.quantity < 1) item.quantity = 1; 
    }
    return item;
  });
  localStorage.setItem('cartItems', JSON.stringify(cartItems)); 
  renderCartItems();
  cartCount();
  updateTotalPrice();

}


function cartCount() {

  const cartItems =  JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartCount = document.getElementById('cart-count');
  cartCount.textContent = cartItems.length;
}


function removeCartItem(_id) {

  let cartItems =  JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems = cartItems.filter((item) => item._id !== _id); 
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  renderCartItems();
  cartCount();
  updateTotalPrice();

}


function updateTotalPrice() {
  
  const cartItems =  JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalAmount = document.getElementById('total-amount');
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalAmount.textContent = `${total.toFixed(2)}`;

}

function customerInfo(){

  const form = document.getElementById('form');
  form.classList.add("active");
  
}

const buyNow = document.getElementById('buyNow');
const placeOrder = () => {

  const userId = localStorage.getItem('userId'); 
  if (!userId) {
    console.log('User is not logged in!');
    return;
  }
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; 

  const orderItems = cartItems.map(item => ({
    productId: item._id,
    quantity: item.quantity,
  }));

  const email = document.getElementById('email').value;
  const number = document.getElementById('number').value;
  const address = document.getElementById('address').value;
  
  axios.post('http://localhost:3000/orderplacement', {
    orderItems: orderItems,
    email: email,
    number: number,
    address: address,
    userId:userId
  })
       
  .then((res) => {
    console.log(res.data.message);
    localStorage.removeItem('cartItems'); 
    window.location.href = 'orderConfirmation.html'; 
  })
  .catch((error) => {
    console.log( error.message);
  });
};

getUserData();
userData();
getData(); 

