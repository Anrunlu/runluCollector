import pymongo
import datetime
from bson.objectid import ObjectId

db_addr = "mongodb://localhost:27017/"
db_name = "runluCollector"

client = pymongo.MongoClient(db_addr)
db = client[db_name]


def get_clt(cltId):
    pipeline = [
        {"$match": {"_id": ObjectId(cltId)}},
        {
            "$lookup": {
                "from": "users",
                "localField": "creator",
                "foreignField": "_id",
                "as": "creator",
            }
        },
        {
            "$lookup": {
                "from": "groups",
                "localField": "groups",
                "foreignField": "_id",
                "as": "groups",
            }
        },
        {
            "$project": {
                "title": 1,
                "endtime": 1,
                "property": 1,
                "groups.ddwebhook": 1,
                "groups.ddsecret": 1,
                "creator.nickname": 1,
            }
        },
    ]
    clts = db.collections.aggregate(pipeline)
    clt = list(clts)[0]
    return clt


def get_group(groupId):
    group = db.groups.find_one(
        {"_id": ObjectId(groupId)}, {"ddwebhook": 1, "ddsecret": 1}
    )
    return group


def get_nearlyEnd_tasks():
    pipeline = [
        {
            "$match": {
                "endtime": {
                    "$gte": datetime.datetime.now() - datetime.timedelta(hours=8),
                    "$lt": datetime.datetime.now() - datetime.timedelta(hours=7),
                }
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "creator",
                "foreignField": "_id",
                "as": "creator",
            }
        },
        {
            "$lookup": {
                "from": "groups",
                "localField": "groups",
                "foreignField": "_id",
                "as": "groups",
            }
        },
        {
            "$project": {
                "title": 1,
                "endtime": 1,
                "property": 1,
                "groups.ddwebhook": 1,
                "groups.ddsecret": 1,
                "creator.nickname": 1,
            }
        },
    ]
    return db.collections.aggregate(pipeline)
