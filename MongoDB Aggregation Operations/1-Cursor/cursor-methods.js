/*
cursor demo
*/

db = db.getSiblingDB("demo-on-cursor");

var cursor = db.language.find();
cursor
cursor.count()
cursor.explain()
while (cursor.hasNext()) {
   print(tojson(cursor.next()));
}

cursor.itcount() // remaining in cursor

var cursor = db.language.find();
cursor.limit(2)
cursor.forEach(printjson) // after this cursor is empty as nothing to iterate
cursor.map( function(l) { return l.language; } ) ;
cursor.skip(6)
cursor.sort({"school":1})
cursor.toArray()[1]
cursor.max()
cursor.min()
cursor.pretty()
cursor.readConcern()
cursor.isExhausted() // true if cursor closed
