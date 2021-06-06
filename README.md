# Ecommerce backend

## Table of Contents
  - [Description](#description)
  - [Key features](#key-features)
  - [Demo video](#demo-video)
  - [Technologies used](#technologies-used)
  - [Installation](#installation)
  - [Routes](#api-routes)

## Description
This is an api designed to support ecommerce businesses by allowing them to manipulate product, category and tag information from a mySQL database through a series of api requests.

## Key Features
- users can get all or one product, category or tag
- users can update products, categories and tags
- users can create products, categories and tags
- users can delete products, categories and tags
  
## Demo Video
[Click here to view](https://drive.google.com/file/d/1Rt3A2w0BgIsEGboo1qo1gRac6apzXk8W/view?usp=sharing)

## Technologies Used
- Javascript
- jQuery
- Sequelize
- mySql
- Express

## Installation 
- Clone the GitHub project onto your local machine
``` 
git clone https://github.com/dominikacookies/ecommerce-backend-ORM
```
- Navigate into the project
- Open the project in VSCode
- Open the integrated terminal
- In the terminal, enter: 
  
  ```
  npm i  
  ``` 
  to install all of the packages.
  
  Next, use the code from the schema file to create an ecommerce database locally.

  If you'd like, you can seed the database with sample information to get started. To do this enter the below into your terminal:

    ```
  npm run seed  
  ``` 

  To start the application enter
  
  ```
  npm run start  
  ``` 

  Ensure that you have installed node.

  ## Api routes

  A list of endpoints to test the application can be found [here.](https://drive.google.com/file/d/1wMQCsZOaLrEUTClI6TLYLZKaOPOImTf6/view?usp=sharing)