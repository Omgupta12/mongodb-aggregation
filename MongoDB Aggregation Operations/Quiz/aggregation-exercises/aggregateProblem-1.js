// Count the number of people, divided into countries.

db = db.getSiblingDB("aggregation");
db.getCollection("people").aggregate(
    [
       {
           $group:{
                _id: {
                    country: '$address.country',
                },
                totalPeople: {
                    $sum: 1
                }
           }
       }
    ], 
    {
        "allowDiskUse" : false
    }
);
