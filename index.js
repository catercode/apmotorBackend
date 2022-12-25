import express from 'express'
import mysql from 'mysql'

const port = '3000'
const app = express()
app.use(express.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'malik@12@',
    database: 'apmotors'

})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=========USER ACCOUNT AND LOGIN ROUTE=====================
//==========================================================
//this route will allowed user to create accounts
//==========================================================
app.post('/user/create/account', (req, res) => {
    var sqlStatement = "";
    var MyQuery;
    const userData = req.body

    sqlStatement = `SELECT * FROM users WHERE Phone=${userData.Phone}`
    MyQuery = connection.query(sqlStatement, (err, result) => {
        if (err) throw err
        if (result.length != 0) {
            res.json({
                message: "User already exist",
                data: result
            })
        } else {
            sqlStatement = 'INSERT INTO users SET ?'
            MyQuery = connection.query(sqlStatement, userData, (err, result) => {
                if (err)
                    throw err
                if (result)

                    return res.json({
                        message: "Account created successful",
                        data: MyQuery.values
                    })
            })
        }
    })
})
//=======================================================
//this route will allowed user to login
//=======================================================
app.get('/user/login/:phone/:password', (req, res) => {
    const phone = req.params.phone
    const password = req.params.password
    const sqlStatement = `SELECT * FROM users WHERE Phone=${phone} AND Password=${password}`
    const MyQuery = connection.query(sqlStatement, (err, result) => {
        if (err) throw err
        if (result) {
            return res.json({
                message: "Login successful",
                data: result.values
            })

        } else {
            res.json({
                message: "Login Failed",

            })

        }
    })

})
//=======================================================
//this route will allowed user to change password
//=======================================================

app.put('/user/setpassword', (req, res) => {
    const userid = req.body.User_ID
    const password = req.body.Password

    var sqlStatement = `UPDATE users SET Password = '${password}' WHERE User_ID = '${userid}'`;
    connection.query(sqlStatement, (err, result) => {
        if (err) throw err
        if (result.affectedRows == 1) {
            res.json({
                message: "Password reset successfull",
                data: result
            })
        } else {
            res.json({
                message: "Password reset failed",
            })
        }
    })
})

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=========USER ACCOUNT AND LOGIN ROUTE=====================
//==========================================================
// THIS ROUTE ALLOWED ADMIN TO ADD PRODUCT TO THE DATABASE
//==========================================================
app.get('/load/product', (req, res) => {

    const sqlStatement = "SELECT * FROM product LIMIT 20"
    const MyQuery = connection.query(sqlStatement, (err, result) => {
        if (err) throw err
        if (result.length != 0) {
            res.json({
                message: "Fetch successful",
                data: result
            })
        } else {
            res.json({
                message: "Fetch Failed",
                data: result
            })
        }
    })
})
app.post('/admin/add/product', (req, res) => {
    var productData = req.body
    var sqlStatement = "";
    var MyQuery;

    sqlStatement = `SELECT * FROM product WHERE ItemID=${productData.ItemID}`
    MyQuery = connection.query(sqlStatement, (err, result) => {

        if (err) throw err

        if (result.length != 0) {
            res.json({
                message: "Item already exist",
                data: result
            })
        } else {

            sqlStatement = 'INSERT INTO product SET ?'
            MyQuery = connection.query(sqlStatement, productData, (err, result) => {
                if (err) throw err
                if (result) {
                    return res.json({
                        message: "Item added successful",
                        data: MyQuery.values
                    })
                }
            })
        }
    }
    )

})

app.delete('/admin/delete/product/:id', (req, res) => {
    const id = req.params.id
    const sqlStatement = `DELETE FROM product WHERE ItemID=${id}`
    const MyQuery = connection.query(sqlStatement, (err, result) => {

        if (err) throw err
        if (result) {
            return res.json({
                message: "Item delete successful",
                data: MyQuery.values
            })
        } else {
            return res.json({
                message: "Item failed to delete",
                data: MyQuery.values
            })
        }
    })

})

app.put('/admin/update/product/:id', (req, res) => {
    const productData = req.body
    const id = req.params.id
    console.log(id)
    const sqlStatement = `UPDATE product SET ItemName='${productData.ItemName}',Model='${productData.Model}',Description='${productData.Description}',Price='${productData.Price}' WHERE ItemID='${id}'`
    const MyQuery = connection.query(sqlStatement, (err, result) => {
        if (err) throw err
        if (result.affectedRows == 1) {
            return res.json({
                message: "Item update successful",
                data: result
            })
        } else {
            return res.json({
                message: "Item failed to update",
                data: MyQuery.values
            })
        }
    })

})



connection.connect((err) => {
    if (err) {
        throw err
        console.log("Database connected successful")
    }

})












app.listen(port, () => {
    console.log("Server is listening to port" + port)
})