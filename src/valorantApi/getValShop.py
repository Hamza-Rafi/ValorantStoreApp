from ValorantApi import ValorantAPI
from pymongo import MongoClient
import json
import os

dir_path = os.path.dirname(os.path.realpath(__file__))

client = MongoClient('mongodb://localhost:27017/')
db = client.valorantWeaponSkins
skinsCollection = db.skins

configPath = os.path.join(dir_path, 'config.json')
with open(f'{configPath}') as f:
    config = json.load(f)

def getValShop(username, password):

    valApi = ValorantAPI(username, password)

    header = {
        'Authorization': f'Bearer {valApi.accessToken}',
        'X-Riot-Entitlements-JWT': valApi.entitlementsToken
    }
    res = valApi.makeGetRequest(f'https://pd.eu.a.pvp.net/store/v2/storefront/{valApi.userID}', header)
    skins = res.json()['SkinsPanelLayout']['SingleItemOffers']

    returnList = []
    for skin in skins:
        result = skinsCollection.find_one({'uuid': skin})
        temp = {
            'uuid': result['uuid'],
            'displayName': result['displayName'],
            'displayIcon': result['displayIcon']
        }
        returnList.append(temp)
    
    return returnList

valShop = getValShop(config['USERNAME'], config['PASSWORD'])

print(valShop)
