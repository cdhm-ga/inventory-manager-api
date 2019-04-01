# Power Inventory API

Client Repo: https://github.com/cdhm-ga/inventory-manager-client

Production Application: https://cdhm-ga.github.io/inventory-manager-client/

Heroku Application: https://shielded-springs-26271.herokuapp.com

## API Documentation:

### Application Description
What is Power Inventory and how is it powered?

Power Inventory is a new, computerized way to track your store’s inventory. It allows you to select items from a NoSQL database and update the quantity on hand, instantly and electronically.

Your store will have an account that is secured by username and password access. Once you sign in, you are ready to make updates.

The first time you use Power Inventory, you will have to add all items in your current inventory each as a New Item.
Click on “New Item.”
In the box that appears, click on your item from the dropdown menu and enter the quantity in the Quantity field.
If you already have items in Power Inventory, you can either delete them or update their quantity. Within the Power Table, click next to an item to select “Remove” or “Update.”

### Technology

- Powered by Node.js
- Powered by Express.js
- Powered by Heroku
  - with MLabs add-on for added database Power
- Powered by MongoDB
- Powered by Mongoose
- Powered by Passport authentication package

### ERD
```
User -|---< Storefront Items -|---|- Warehouse Items
```
### Routes

#### Authentication

| VERB | PATH | PARAMETERS |
| :------: | :----: | :----------: |
|  POST  | /sign-up  | `credentials` containing `email`, `password`, `password_confirmation`  |
|  POST  | /sign-in  | `credentials` containing `email` and `password`  |
|  PATCH | /change-password  | `passwords` containing `old` and `new` (requires Authorization header)  |
| Delete | /sign-out | None (requires Authorization header) |

#### Storefront Items

| VERB | PATH | PARAMETERS |
| :------: | :----: | :----------: |
|  GET  |  /storefront-items  | none (requires Authorization header)  |
| POST  |  /storefront-items | `storfrontItem` containing `warehouseItem`, `owner`, `quantity` (requires Authorization header)  |
| PATCH  | /storefront-items/:id  | `storefrontItem` containing `quantity` (requires Authorization header) |
| DELETE   | /storefront-items/:id  | none (requires Authorization header)  |

#### Warehouse Items

| VERB | PATH | PARAMETERS |
| :------: | :----: | :----------: |
| GET  | /warehouse  | none (requires Authorization header)  |


### Planning, Process, and Problem Solving

#### Planning

PowerHaus began work on this app with planning the data structure’s form. With an initial idea of having only one collection other than Users, we soon realized that an efficient way to prevent replication of documents within a user’s inventory might necessitate an additional collection.

Adding a Storefront Items table allowed the app to reference a “static” database of warehouse items that the Storefront Items would reference. This would prevent errors introduced by entering a new item, as the only fields allowed to be updated would be Quantity, a Storefront Item-stored value.

#### Process

- First, meet all initial user stories
    - Write an api with routes to support the proper Create, Read, Update,
Delete functions on the necessary resources.
    - Write a client front-end capable of sending requests to these routes.
- Then, bring the user interface up to the latest DOS standards
    - Utilize all 16 colors.
Process
Utilizing the Agile workflow structure, our team distributed Power along these general roles:
  -  Back-End Maestro
  -  Front-End Maestro
  -  Quality Assurance Maven
  -  Scrum Master

#### Problem-solving

When used along with our adopted workflow of pair programming, separating front and
back end concerns allowed two pairs to work on two sections of the project at the same
time without introducing merge conflicts. One exception would be when we performed a
“Power Murge”: a deliberate concurrent effort on the same files that would be resolved
upon merging by accepting both sets of changes. (The Power Murge only works if the two
pairs work on separate functions within those files — in this case, on client calls to
different api routes).

### Known Issues

1. Prices do not convert to dollars and cents.
