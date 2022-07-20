// Find the 3 people who have the most in their bank accounts.

db.getCollection("people").aggregate(
[
    {
        $unwind: '$wealth.bankAccounts'
    },
    {
        $group: {
            _id: '$_id',
            'firstName': {
                $max: '$firstName'
            },
            'lastName': {
                $max: '$lastName'
            },
            'totalBalance': {
                $sum: '$wealth.bankAccounts.balance'
            }
        }
    },
    {
        $project: {
            firstName: 1,
            lastName: 1,
            _id: 0,
            totalBalance: 1
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
