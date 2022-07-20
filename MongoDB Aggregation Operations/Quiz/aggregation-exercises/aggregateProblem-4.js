// Find the 3 people who have the most in their bank accounts.

db.getCollection("people").aggregate(
[
    {
        $project: {
            firstName: 1,
            lastName: 1,
            _id: 0,
            totalBalance: {
                 $sum: "$wealth.bankAccounts.balance"   
            }
        }
    },
    {
         $sort: {
              totalBalance: -1   
         }   
    },
    {
        $limit: 3
        
    }

])
