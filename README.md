# AirBean-Admin-Exam

Airbean Documentation
Menu
Method: GET

URL: /api/menu

Description: Returns all items from menu

Method: POST - NY!

URL: /api/menu

Description: Adds new product to menu

Headers: Authorization : <token>

Body:

{
  "title" : <product name>,
  "desc" : <product description>,
  "price" : <product price>
}
Method: PUT - NY!

URL: /api/menu/{prodId}

Description: Updates product in menu

Headers: Authorization : <token>

Body:

{
  "title" : <product name>,
  "desc" : <product description>,
  "price" : <product price>
}
Method: DELETE - NY!

URL: /api/menu/{prodId}

Description: Deletes product in menu

Headers: Authorization : <token>

Auth
Method: GET

URL: /api/auth/logout

Description: Logout user

Method: POST - UPPDATERAD!

URL: /api/auth/register

Description: User registration where either "user" or "admin" is set as role in request body

Body:

{
  "username" : <username>,
  "password" : <password>,
  "role" : <role>
}
Method: POST

URL: /api/auth/login

Description: User login

Body:

{
  "username" : <username>,
  "password" : <password>
}
Cart
Method: GET

URL: /api/cart

Description: Returns all carts

Method: GET

URL: /api/cart/{cartId}

Description: Returns cart with the given cartId

Method: PUT

URL: /api/cart

Description: Updates cart with the product sent in the request body. If user is logged in, the cart will be connected to that user. If user is not lgged in, a temporary guest-ID which will connect the user to the cart is returned in response along with the current cart. A guest user must, once a cart is created, also send his/her guestID in the following request bodys (see second example below).

Body:

{
  "prodId" : <prodId>,
  "qty" : <qty>
}
or

{
  "guestId" : <guestId>
  "prodId" : <prodId>,
  "qty" : <qty>
}
Orders
Method: GET

URL: /api/orders

Description: Returns all orders

Method: GET

URL: /api/orders/{userId}

Description: Returns all orders connected to the userId sent in request params.

Method: POST

URL: /api/orders

Description: Targets the cart received in request body and creates an order. The order is then sent back to the user in the response.

Body:

{
  "cartId" : <cartId>
}
