/*
There is one country in which the average payment in a restaurant is the highest, and one in which 
the average payment in a restaurant is the lowest. How many times do people from the first country 
spend more than people from the second country?
*/

db.getCollection("aggregateTask6Out").aggregate(
[
    {
         $group: {
              _id: null,
              maxAmount: {
                   $max: "$avgAmount"   
              },
              minAmount: {
                   $min: "$avgAmount"   
              }  
         }   
    },
    {
         $project: {
              _id: 1,
              diff: {
                   $divide: ["$maxAmount", "$minAmount"]   
              }   
         }   
    }
]

)
