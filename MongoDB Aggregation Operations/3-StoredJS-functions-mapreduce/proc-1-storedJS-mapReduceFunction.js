/*
call emit(key,value) to expose data for reduce function to be used with mapReduce(emitFunctionName,reducefunctionName, ..)

*/

db = db.getSiblingDB("stored-js");

db.system.js.insertMany(
[
    {
        _id: "emitDataMapFunction",
        value: function () {
			emit(this.cust_id, this.price);
        }
    },
	{
        _id: "reduceDataMapFunction",
        value: function (key, values) {
            return Array.sum(values);
        }
    }
]
)
