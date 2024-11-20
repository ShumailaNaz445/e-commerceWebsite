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
}).then((res) => {
    console.log("response >>>>>", res);

    const { token, isAdmin } = res.data;

    console.log("isAdmin value:", isAdmin); 

    localStorage.setItem('authToken', token);

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

//render product data for admin
const getData = () => {
  axios.get('http://localhost:3000/getProduct')
    .then((res) => {
      const container = document.getElementById('product-detail');
      container.innerHTML = ''; 

      res.data.data.map((product) => {
        const productHTML = `
          <li data-id="${product._id}">
            <div>
              <img src= "${product.productImage}" alt="product Image" /img>
              <h5 onclick="editData(this, 'name')">${product.name}</h5>
              <p onclick="editData(this, 'description')">${product.description}</p>
              <span onclick="editData(this, 'price')">${product.price}</span>
            </div>
            <button onclick="deleteData('${product._id}')">Delete</button>
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
const deleteData = (id) => {
  axios.delete(`http://localhost:3000/deleteProduct/${id}`)
    .then((res) => {
      alert(res.data.message);
      getData(); 
    })
    .catch((error) => {
      console.log(error.message);
    });
};

document.addEventListener('click', (event) => {
  const target = event.target;

  // Delete product
  if (target.classList.contains('delete-btn')) {
    const productId = target.closest('li').getAttribute('data-id');
    deleteData(productId);
  }


});

// postdata to backend
function dataToBackend() {
  var productName1 = document.getElementById("name").value;
  var productprice = document.getElementById("description").value;
  var productdescription = document.getElementById("price").value;
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
        const productHTML = `
          <li data-id="${product._id}">
            <div>
              <img src="${product.productImage}" alt="Product Image" class="product-img" />
              <h2 class="product-title">${product.productName}</h2>
              <p class="product-price">${product.description}</p>
              
              <a class="add-cart"><i class="fa-solid fa-bag-shopping " id="add-cart"></i></a>
            </div>
          </li>
          
        `;        
        // console.log(productHTML);
        
        container.innerHTML += productHTML;
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
};

//render user data
const getUserData = () => {
  axios.get('http://localhost:3000/getdata')
    .then((res) => {
      console.log(res);
      
      let container = document.getElementById('user-list');
    //   container.innerHTML = '';
      

      res.data.data.map((user) => {
        console.log(user);
        console.log(container);
        
        const userHTML = `

          <div data-id="${user._id}" class="user-card">
            <div>
              <h2>${user.name}</h2>
              <p>${user.email}</p>
              <p>${user.contact}</p>
              <button class="delete-user-btn">Delete</button>
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
const deleteUserData = (id) => {
  axios.delete(`http://localhost:3000/deletedata/${id}`)
    .then((res) => {
      alert('User deleted successfully' , res.data.message);
      getUserData();
    })
    .catch((error) => {
      console.log("Error deleting user:", error.message);
    });
};

// Cart
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cart-close");

const cartCountElement = document.querySelector("#cart-count");

cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

function start() {
  addEvents();
}

function update() {
  addEvents();
  updateTotal();
}

function handle_addCartItem() {
  let product = this.parentElement;
  let title = product.querySelector(".product-title").innerHTML;
  let price = product.querySelector(".product-price").innerHTML;
  let imgSrc = product.querySelector(".product-img").src;
  console.log(imgSrc);
  
  console.log(title, price, imgSrc);

  let newToAdd = {
    title,
    price,
    imgSrc,
  };

  if (itemsAdded.find((el) => el.title == newToAdd.title)) {
    alert("This Item Is Already Exist!");
    return;
  } else {
    itemsAdded.push(newToAdd);
  }

  let cartBoxElement = CartBoxComponent(title, price, imgSrc);
  let newNode = document.createElement("div");
  newNode.innerHTML = cartBoxElement;
  const cartContent = cart.querySelector(".cart-content");
  cartContent.appendChild(newNode);

  updateCartCount();

  update();
}



function updateCartCount() {
  const cartItemCount = itemsAdded.length; 
  cartCountElement.textContent = cartItemCount;
}


function addEvents() {
  let cartRemove_btns = document.querySelectorAll(".cart-remove");
  console.log(cartRemove_btns);
  cartRemove_btns.forEach((btn) => {
    btn.addEventListener("click", handle_removeCartItem);
  });

  let cartQuantity_inputs = document.querySelectorAll(".cart-quantity");
  cartQuantity_inputs.forEach((input) => {
    input.addEventListener("change", handle_changeItemQuantity);
  });

  let addCart_btns = document.querySelectorAll(".add-cart");
  addCart_btns.forEach((btn) => {
    btn.addEventListener("click", handle_addCartItem);
  });

  const buy_btn = document.querySelector(".btn-buy");
  buy_btn.addEventListener("click", handle_buyOrder);
}

let itemsAdded = [];

function handle_addCartItem() {
  let product = this.parentElement;
  let title = product.querySelector(".product-title").innerHTML;
  let price = product.querySelector(".product-price").innerHTML;
  let imgSrc = product.querySelector(".product-img").src;

  let newToAdd = {
    title,
    price,
    imgSrc,
  };

  if (itemsAdded.find((el) => el.title == newToAdd.title)) {
    alert("This Item Is Already Exist!");
    return;
  }

  itemsAdded.push(newToAdd);

  let cartBoxElement = CartBoxComponent(title, price, imgSrc);
  let newNode = document.createElement("div");
  newNode.innerHTML = cartBoxElement;
  const cartContent = cart.querySelector(".cart-content");
  cartContent.appendChild(newNode);

  updateCartCount();
  update(); 
}


function handle_changeItemQuantity() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  this.value = Math.floor(this.value);

  update();
}

function handle_buyOrder() {
  if (itemsAdded.length <= 0) {
    alert("There is No Order to Place Yet! \nPlease Make an Order first.");
    return;
  }
  const cartContent = cart.querySelector(".cart-content");
  cartContent.innerHTML = "";
  alert("Your Order is Placed Successfully :)");
  itemsAdded = [];

  update();
}

function updateTotal() {
  let cartBoxes = document.querySelectorAll(".cart-box");
  const totalElement = cart.querySelector(".total-price");
  let total = 0;
  cartBoxes.forEach((cartBox) => {
    let priceElement = cartBox.querySelector(".cart-price");
    let price = parseFloat(priceElement.innerHTML.replace("$", ""));
    let quantity = cartBox.querySelector(".cart-quantity").value;
    total += price * quantity;
  });

  total = total.toFixed(2);

  totalElement.innerHTML = "$" + total;
}

function CartBoxComponent(title, price, imgSrc) {
  return `
    <div class="cart-box">
        <img src=${imgSrc} alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <!-- REMOVE CART  -->
        <i class='bx bxs-trash-alt cart-remove'></i>
    </div>`;
}


window.addEventListener('load', () => {
  setTimeout(getUserData(),2000);
  getData(); 
  userData();

});

