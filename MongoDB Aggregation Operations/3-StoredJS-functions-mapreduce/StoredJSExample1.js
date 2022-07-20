db = db.getSiblingDB("stored-js");


db.system.js.insertOne(
    {
        _id: "searchByName",
        value: function (name) {
            {
                return db.getCollection("employees").aggregate([
                    {
                        "$match": {
                            "firstName": new RegExp(name)
                        }
                    }
                ], {
                        "allowDiskUse": false
                    });
            }
        }
    })
    
    
  db.loadServerScripts()
  
  searchByName("jo")