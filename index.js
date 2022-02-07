const express = require('express')
const uuid = require('uuid')
const port = 3003
const app = express()

const orders = []

app.use(express.json())

const checkId = ( request , response , next ) => {
    const { id } = request.params
    const index = orders.findIndex(user => user.id === id )

    if ( index < 0 ){
        return response.status(404).json( { error : "User not found" } )
    }

    request.userIndex = index
    request.userId = id

    next()
}

const routesAndUrl = ( request , response , next ) => {
    const method = request.route.methods
    const url = request.route.path

    console.log(method ,url)
    
    next()
}

app.get("/users" ,routesAndUrl , ( request , response ) => {
    return response.json(orders)
})

app.post("/users" , routesAndUrl , ( request , response ) => {
    const { order , clientName , price } = request.body
    const status = "Em preparação"
    const newOrder = { id: uuid.v4() , order , clientName , price , status}

    orders.push(newOrder)

    return response.json(newOrder)
})

app.put("/users/:id", routesAndUrl, checkId , ( request , response ) => {
    const { order , clientName , price } = request.body
    const id = request.userId
    const index = request.userIndex
    const status = "Em preparação"

    const updateOrder = { id , order , clientName , price ,status }

    orders[index] = updateOrder
    
    return response.json(updateOrder)
})

app.delete("/users/:id" , routesAndUrl , checkId , ( request , response ) => {
    const { index } = request.userIndex

    orders.splice( index , 1 )

    return response.status(204).josn()
})

app.get("/users/:id" , routesAndUrl , checkId , ( request , response ) => {
    const index = request.userIndex

    return response.json(orders[index])
})

app.patch("/users/:id" , routesAndUrl , checkId , ( request , response ) => {
    const index = request.userIndex
    const { id , order , clientName , price } = orders[index]
    var status = orders[index].status = "Finalized"

    const orderFinalized = { id , order , clientName , price , status}

    orders[index] = orderFinalized

    return response.json(orderFinalized)
})


app.listen(port , () => {
    console.log(`🔥Server started on port ${port}`)
})