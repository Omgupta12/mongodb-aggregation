// Count the number of all restaurant visits, the total amount spent, and the average amount per visit. 
//All of this should be divided into countries.

db.getCollection("people").aggregate(
[
    {
        $match: {
            payments: {
                $elemMatch: {
                    name: 'restaurant'
                }
            }
        }
    },
    {
        $project: {
             "address.country": 1,
             paymentsFilter: {
                 $filter: {
                      input: "$payments",
                      as: "p",
                      cond: {
                           $eq: [
                               "$$p.name", "restaurant"
                           ]   
                      }   
                 }
             } 
        }
    },
    {
        $unwind: "$paymentsFilter"
    },
    {
        $group: {
             _id: "$address.country",
             totalVisits:{
                  $sum: 1
             },
             totalAmount:{
                  $sum: "$paymentsFilter.amount"   
             }
        }
    },
    {
        $project: {
             _id: 1,
             totalVisits: 1,
             totalAmount: 1,
             avgAmount: {
                  $divide: ["$totalAmount","$totalVisits"]   
             }
        }
    },
    {
         $out: "aggregateTask6Out" 
    }
]

)
