db = db.getSiblingDB("aggregation");

//================== $project ================
db.inventory.aggregate([{ $project: { _id: 1, name: 1, 'newquantity': { $multiply: ['$quantity', 10] } } }])

db.language.aggregate([
    {
        $project: {
            income: {
                $multiply: ['$seats', '$price']
            },
            seats: 1,
            price: 1
        }
    }
])

//================== $match ================
db.language.aggregate([
    {
        $match: {
            language: 'english',
            seats: { $gte: 10 },
            price: { $lt: 200 }
        }
    }
])

// using find and then same using aggregation
db.people.find({
    $or: [
        { sex: 'female', 'address.city': 'Paris' },
        { sex: 'male', 'address.city': 'Cracow' }
    ],

    'wealth.realEstates.type': {
        $all: ['flat', 'house', 'land']
    },
    $and: [
        { 'wealth.realEstates.worth': { $gt: 2000000 } },
        { 'wealth.realEstates.worth': { $not: { $lt: 500000 } } }
    ]
}).count()

// can be written using aggregation like this - 
db.people.aggregate([
    {
        $match: {
            $or: [
                { sex: 'female', 'address.city': 'Paris' },
                { sex: 'male', 'address.city': 'Cracow' }
            ],

            'wealth.realEstates.type': {
                $all: ['flat', 'house', 'land']
            },
            $and: [
                { 'wealth.realEstates.worth': { $gt: 2000000 } },
                { 'wealth.realEstates.worth': { $not: { $lt: 500000 } } }
            ]
        }
    },
    {
        $count: "count"
    }
])



//================== $group, aggregation accumulators ================
db.inventory.aggregate([{ $group: { _id: "$dept", 
    
   count : {
    $sum : "$price" 
   }, } }])

db.language.aggregate([
    {
        $group: {
            _id: '$school',
            groupedCourses: { $sum: 1 },
            allSeats: { $sum: '$seats' },
            avgSeats: { $avg: '$seats' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            languagesAsArray: { $push: '$language' },
            languagesAsArrayUniqueOnly: { $addToSet: '$language' }
        }
    }
])


//================== $sort, $skip, $limit ================

db.people.aggregate([
    {
        $project: {
            firstName: 1,
            lastName: 1,
            _id: 0
        }
    },
    {
        $sort: {
            firstName: 1
        }
    },
    {
        $skip: 2 // check diff by setting 0
    },
    {
        $limit: 5
    }
])

//================== $unwind ================
db.unwind.aggregate([
    {
        $unwind: {
            path: '$survivalItems',
            includeArrayIndex: 'index',
            preserveNullAndEmptyArrays: false
        }
    }
])

//================== $lookup ================
db.employees.aggregate([
    {
        $lookup: {
            from: 'cars',  // collection to join
            foreignField: '_carId',  // field from the input documents
            localField: '_id',  // field from the documents of the "from" collection
            as: 'cars' // output array field
        }
    }
]) // this wont work, if the relation is other way around it will work without unwind

db.employees.aggregate([
    {
        $unwind: {
            path: '$_carId',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'cars',
            localField: '_carId',
            foreignField: '_id',
            as: 'cars'
        }
    },
    {
        $unwind: {
            path: '$cars',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: '$_id',
            carIds: { $addToSet: '$_carId' },
            cars: { $addToSet: '$cars' }
        }
    }
])

//================== $out, $merge ================
db.inventory.aggregate([{ $match: { dept: 'A' } }, { $out: "out-coll-example" }])

db.inventory.aggregate([{ $match: { dept: 'A' } }, { $merge: { into: "myOutput", on: "_id", whenMatched: "replace", whenNotMatched: "insert" } }])

//================== allowDiskSpace ================
db.people.aggregate([{ $sort: { firstName: 1 } }], { allowDiskUse: true })


