// What is the most popular address, and how many people live there?

db = db.getSiblingDB("aggregation");
db.getCollection("people").aggregate(
    [
        {
            $group: {
                _id: {
                    'address' : '$address'
                },
                total: {
                    $sum: 1
                }
                
            }
        },
        {
             $sort: {
                  total: -1   
             }   
        },
        {
             $limit: 1   
        }
    ], 
    {
        "allowDiskUse" : false
    }
);