db = db.getSiblingDB("stored-js");

db.system.js.insertOne(
    {
        _id: "searchByPosition",
        value: function (position) {
            {
                return db.getCollection("employees").find({
                    'position': new RegExp(position)
                })
            }
        }
    });