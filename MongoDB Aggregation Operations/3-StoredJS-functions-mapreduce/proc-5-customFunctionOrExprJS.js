/*
find data using expr function
*/
db = db.getSiblingDB("stored-js");

db.getCollection("orders").find(
    {
        $expr: {
            $function: {
                body: function (cust_id, price) {
                    return (cust_id == "Ant O. Knee" && price > 50);
                },
                args: [
                    "$cust_id",
                    "$price"
                ],
                lang: "js"
            }
        }
    })
	


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