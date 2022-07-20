/*
Single Purpose Aggregation Methods - more control indiviual level
*/
db = db.getSiblingDB("aggregation");

db.inventory.insertMany
    ([{ "_id": 1, "dept": "A", "item": { "sku": "111", "color": "red" }, "sizes": ["S", "M"], "name": "inv-1", "quantity" : 5, "price" : 10 },
    { "_id": 2, "dept": "A", "item": { "sku": "111", "color": "blue" }, "sizes": ["M", "L"], "name": "inv-2", "quantity" : 50, "price" : 20 },
    { "_id": 3, "dept": "B", "item": { "sku": "222", "color": "blue" }, "sizes": "S", "name": "inv-3", "quantity" : 26, "price" : 25 },
    { "_id": 4, "dept": "A", "item": { "sku": "333", "color": "black" }, "sizes": ["S"], "name": "inv-1", "quantity" : 11, "price" : 50 }
    ])
    
db.inventory.find().pretty()

//===========================================================

db.inventory.estimatedDocumentCount({})
db.inventory.count()
db.inventory.distinct( "dept" )

//====================================================


db.inventory.count(
{name : {"$eq" : 'inv-1'}}, // criteria
{limit: 2, skip: 1}
)


db.inventory.aggregate( [
   { $count: "myCount" }
])

//The $count stage is equivalent to the following $group + $project sequence:
db.inventory.aggregate( [
   { $group: { _id: null, count: { $sum: 1 } } },
   { $project: { _id: 0 } }
] )


//=======================================================
db.inventory.distinct( "dept" )

db.inventory.distinct( "item.sku" )

db.inventory.distinct( "sizes" )

db.inventory.distinct( "item.sku", { dept: "A" } )


