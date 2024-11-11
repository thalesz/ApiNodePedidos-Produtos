# Express + Node.js Project

## Description

This project is built with Express and Node.js to manage products and orders. It integrates with a Sequelize database for data persistence. The API allows creating, updating, deleting, and retrieving products and orders.

## Features

- **Products:**
  - Create a product
  - Update product details
  - Delete a product
  - Retrieve a product by ID
  - List all products

- **Orders:**
  - Create an order
  - Retrieve an order by ID
  - List all orders

## Installation

1. Clone this repository.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.

```bash
npm install

```

## Configuration
Before running the application, make sure you have the following:

A database set up and configured with Sequelize.
The sequelize.authenticate() method will test the connection to the database.
Models for Produto and Pedido are defined in models.js.
# Usage
1. To start the application, run:
```bash

npm start

```

2. The server will start on port 3000.

## Routes
# Products

POST /produtos - Create a new product

Request body:
```json

{
  "nome": "Product Name",
  "preco": 100.0
}
```
PATCH /produtos/:id - Update an existing product

Request body:
```json

{
  "nome": "Updated Product Name",
  "preco": 150.0
}
```
DELETE /produtos/:id - Delete a product by ID

GET /produtos/:id - Retrieve a product by ID

GET /produtos - List all products

# Orders
POST /pedidos - Create a new order

Request body:
```json

{
  "produtos": [
    {
      "id": 1,
      "quantidade": 2
    }
  ],
  "valorTotal": 200.0
}

```

GET /pedidos/:id - Retrieve an order by ID

GET /pedidos - List all orders