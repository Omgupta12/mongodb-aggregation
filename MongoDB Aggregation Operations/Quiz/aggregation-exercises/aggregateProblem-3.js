// How many people from each country have visited a restaurant?

db = db.getSiblingDB("aggregation");
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
             $group: {
                  _id: {
                       'country': '$address.country'   
                  },
                  visits: {
                       $sum: 1   
                  }   
             }   
        }
    ], 
    {
        "allowDiskUse" : false
    }
);