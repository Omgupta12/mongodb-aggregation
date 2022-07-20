/*
Updates with Aggregation Pipeline
*/

db = db.getSiblingDB("aggregation");

db.students.insertMany([
    { _id: 1, test1: 95, test2: 92, test3: 90, modified: new Date("01/05/2020") },
    { _id: 2, test1: 98, test2: 100, test3: 102, modified: new Date("01/05/2020") },
    { _id: 3, test1: 95, test2: 110, modified: new Date("01/04/2020") }
])

db.students.find()

db.students.updateOne({ _id: 3 }, [{ $set: { "test3": 98, modified: "$$NOW" } }]) // 1

db.students.find().pretty()
//===========================================================================

db.students2.insertMany([
    { "_id": 1, quiz1: 8, test2: 100, quiz2: 9, modified: new Date("01/05/2020") },
    { "_id": 2, quiz2: 5, test1: 80, test2: 89, modified: new Date("01/05/2020") },
])

db.students2.find()

db.students2.updateMany({},
    [
        {
            $replaceRoot: {
                newRoot:
                    { $mergeObjects: [{ quiz1: 0, quiz2: 0, test1: 0, test2: 0 }, "$$ROOT"] }
            }
        },
        { $set: { modified: "$$NOW" } }
    ]
)

db.students2.find()
//===========================================================================

db.students3.insertMany([
    { "_id": 1, "tests": [95, 92, 90], "modified": ISODate("2019-01-01T00:00:00Z") },
    { "_id": 2, "tests": [94, 88, 90], "modified": ISODate("2019-01-01T00:00:00Z") },
    { "_id": 3, "tests": [70, 75, 82], "modified": ISODate("2019-01-01T00:00:00Z") }
]);

db.students3.find()

db.students3.updateMany(
    {},
    [
        { $set: { average: { $trunc: [{ $avg: "$tests" }, 0] }, modified: "$$NOW" } },
        {
            $set: {
                grade: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$average", 90] }, then: "A" },
                            { case: { $gte: ["$average", 80] }, then: "B" },
                            { case: { $gte: ["$average", 70] }, then: "C" },
                            { case: { $gte: ["$average", 60] }, then: "D" }
                        ],
                        default: "F"
                    }}}}])

//===========================================================================

db.students4.insertMany([
    { "_id": 1, "quizzes": [4, 6, 7] },
    { "_id": 2, "quizzes": [5] },
    { "_id": 3, "quizzes": [10, 10, 10] }
])


db.students4.updateOne({ _id: 2 },
    [{ $set: { quizzes: { $concatArrays: ["$quizzes", [8, 6]] } } }] // will add data to array
)


//===========================================================================
db.temperatures.insertMany([
    { "_id": 1, "date": ISODate("2019-06-23"), "tempsC": [4, 12, 17] },
    { "_id": 2, "date": ISODate("2019-07-07"), "tempsC": [14, 24, 11] },
    { "_id": 3, "date": ISODate("2019-10-30"), "tempsC": [18, 6, 8] }
])


db.temperatures.updateMany({},
    [
        {
            $addFields: { // can add/update field
                "tempsF": {
                    $map: {
                        input: "$tempsC",
                        as: "celsius",
                        in: { $add: [{ $multiply: ["$$celsius", 9 / 4] }, 32] }
                    }
                }
            }
        }
    ]
)


db.getCollection("temperatures").update(
    {},
    { $set: { result: true, } },
    { upsert: false, multi: true }
)

db.temperatures.find()

