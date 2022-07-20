/*
- load scripts
- pass the emit and reduce function name to mapReduce
*/
db = db.getSiblingDB("stored-js");

db.loadServerScripts()

searchByName("Jo")
searchByPosition("Pro")

//================= Map Reduce ===================

db.orders.mapReduce(emitDataMapFunction,reduceDataMapFunction, { out: "mapReduceUsingStoredJS" })

db.getCollection("mapReduceUsingStoredJS").find({})


