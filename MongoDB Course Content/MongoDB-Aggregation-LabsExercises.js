// match and project
db.movies.aggregate([
    { $match: { "imdb.rating": { $gte: 7 }, "genres": { $nin: ["Crime", "Horror"] }, $or: [{ "rated": "PG" }, { "rated": "G" }], $and: [{ "languages": { $all: ["English", "Japanese"] } }], } },
    { $project: { title: 1, rated: 1, _id: 0 } }
])


// string operation
db.movies.aggregate([
    { $project: { titleArray: { $split: ['$title', " "] }, } },
    { $match: { titleArray: { $size: 1 } } }
]).itcount()


db.movies.aggregate([
    {
        $match: {
            cast: { $elemMatch: { $exists: true } }, directors: { $elemMatch: { $exists: true } }, writers: { $elemMatch: { $exists: true } }
        }
    },
    {
        $project: {
            _id: 0, title: 1, cast: 1, directors: 1,
            writers: { $map: { input: "$writers", as: "writer", in: { $arrayElemAt: [{ $split: ["$$writer", " ("] }, 0] } } }
        }
    },
    { $project: { labor_of_love: { $gt: [{ $size: { $setIntersection: ["$cast", "$directors", "$writers"] } }, 0] } } },
    { $match: { labor_of_love: true } }, { $count: "labor_of_love" }
])


// Lab: Using Cursor-like Stages
//to store var
db.system.js.insertMany(
    [{
        _id: "fav_var", value: function () {
            var favorites = ["Sandra Bullock", "Tom Hanks", "Julia Roberts", "Kevin Spacey", "George Clooney"]
            return favorites;
        }
    }]
)

db.loadServerScripts()

db.movies.aggregate([
    { $match: { countries: "USA", "tomatoes.viewer.rating": { "$gte": 3 }, cast: { $in: fav_var() } } },
    { $project: { _id: 0, title: 1, "tomatoes.viewer.rating": 1, num_fav: { $size: { $setIntersection: [fav_var(), "$cast"] } } } },
    { $sort: { num_fav: -1, "tomatoes.viewer.rating": -1, title: -1 } }, { $skip: 24 }, { $limit: 1 }
])


//Lab - Bringing it all together, normalized_rating

db.movies.aggregate([
    { $match: { languages: "English", "imdb.rating": { "$gte": 1 }, "imdb.votes": { "$gte": 1 }, "year": { "$gte": 1990 } } },
    {
        $project: {
            _id: 0, title: 1, "imdb.rating": 1, "imdb.votes": 1,
            normalized_rating: { $avg: ["$imdb.rating", { $add: [1, { $multiply: [9, { $divide: [{ $subtract: ["$imdb.votes", 5] }, { $subtract: [1521105, 5] }] }] }] }] }
        }
    },
    { $sort: { normalized_rating: 1 } }, { $limit: 1 }
])


//Lab - $group and Accumulators

db.movies.aggregate([
    { $match: { awards: /Won \d{1,2} Oscars?/ } },
    {
        $group: {
            _id: null, StdDev: { $stdDevSamp: "$imdb.rating" },
            highest: { $max: "$imdb.rating" }, lowest: { $min: "$imdb.rating" }, average: { $avg: "$imdb.rating" },
        }
    },
])


// Lab - $unwind

db.movies.aggregate([
    { $match: { languages: "English" } },
    { $project: { _id: 0, cast: 1, "imdb.rating": 1 } },
    { $unwind: "$cast" },
    { $group: { _id: "$cast", numFilms: { $sum: 1 }, average: { $avg: "$imdb.rating" } } },
    { $project: { numFilms: 1, average: { $round: ["$average", 1] } } },
    { $sort: { numFilms: -1 } },
    { $limit: 1 }
])

//Lab - Using $lookup

db.air_routes.aggregate([
    { $match: { airplane: /747|380/ } },
    { $lookup: { from: 'air_alliances', localField: 'airline.name', foreignField: 'airlines', as: 'alliance' } },
    { $unwind: "$alliance" },
    { $group: { _id: "$alliance.name", count: { "$sum": 1 } } },
    { $sort: { "count": -1 } }
])
