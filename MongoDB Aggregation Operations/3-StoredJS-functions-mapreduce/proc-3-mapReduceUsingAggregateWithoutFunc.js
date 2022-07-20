/*
mapReduce same operation using group accumulator
*/

db.orders.aggregate([
    {
        $group: {
            _id: "$cust_id",
            totalPrice: {
                $sum: "$price"
            }
        }
    },
    {
        $sort: {
            _id: 1
        }
    },
    {
        $merge: {
            into: "mapReduceUsingAggregateWithoutFunc",
            on: "_id",
            whenMatched: "replace",
            whenNotMatched: "insert"
        }
    }
]
)
