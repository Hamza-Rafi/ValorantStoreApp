from pymongo import MongoClient
import requests

client = MongoClient('mongodb://localhost:27017/')
db = client.valorantWeaponSkins
skinsCollection = db.skins

url = 'https://valorant-api.com/v1/weapons/skins'

res = requests.get(url).json()

data = res['data']

# pprint.pprint(data)

for skin in data:
    skinData = {}
    skinData['uuid'] = skin['levels'][0]['uuid']
    skinData['displayName'] = skin['displayName']
    skinData['displayIcon'] = skin['levels'][0]['displayIcon']

    skinsCollection.insert_one(skinData)
