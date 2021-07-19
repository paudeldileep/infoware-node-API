
Different node.js end points for :
 A)
For Website Owner:
//available in routes/owner.js

Add account   // localhost:4000/owner/add         (post method)
Add products // localhost:4000/owner/add-product  (post method)
View Orders  // localhost:4000/owner/view-orders  (get method)

   B)
For End Customers

//available in routes/customer.js
Add account                                  // localhost:4000/customer/add     (post method)
Login                                        // localhost:4000/customer/login   (post method)
Browse Products                              // localhost:4000/customer/browse-products (get method)
Order products(no payment integration)       // localhost:4000/customer/order (post method)
View Orders                                  // localhost:4000/customer/orders (get method)


diffrent mongoose schema defined in models folder and field values are based on assumptions.
authentication middle ware is in middlewares folder.
database connection code in config folder.

USAGE:
1. npm install
2. try different endpoints with jason data in body.
3. jwt token is passed in x-access-token field in headers.(for customer end points except /add and /login)