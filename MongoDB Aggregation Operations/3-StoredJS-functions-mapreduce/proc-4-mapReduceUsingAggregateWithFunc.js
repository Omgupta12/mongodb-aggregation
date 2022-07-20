/*

MapReduce logic using aggregate function under projection

*/
db = db.getSiblingDB("stored-js");

db.getCollection("orders").aggregate(
    [
        {
            $group: {
                _id: "$cust_id",
                // You could push each item in to an array within the group projection
                priceArray: {
                    $push: {
                        p: "$price",
                    }
                }
            }
        },
        {
            $project: {
                totalPrice: {
                    $function: {
                        "body": function (price) {
                            return Array.sum(price)
                        },
                        "args": ["$priceArray.p"],
                        "lang": "js"
                    }
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
                into: "mapReduceUsingAggregateFunc",
                on: "_id",
                whenMatched: "replace",
                whenNotMatched: "insert"
            }
        }
    ]
)



// another custon function example

db.orders.aggregate([
    {
        $addFields:
            {
                isFound:
                    {
                        $function:
                            {
                                body: function (cust_id) {
                                    return hex_md5(cust_id) == "6aee6512f478160d979d060d8afc6762"
                                },
                                args: ["$cust_id"],
                                lang: "js"
                            }
                    },
                message:
                    {
                        $function:
                            {
                                body: function (cust_id, price) {
                                    let total = Array.sum(price);
                                    return `Hello ${cust_id}.  Your total items price is ${total}.`
                                },
                                args: ["$cust_id", "$items.price"],
                                lang: "js"
                            }
                    }
            }
    }
])