import requests, json

class ValorantAPI():
    def __init__(self, username, password):
        self.username = username
        self.password = password

        self.accessToken, self.entitlementsToken, self.userID = self.getAuthTokens()

    def __str__(self) -> str:
        return json.dumps({
            'username': self.username,
            'password': self.password,
            'accessToken': self.accessToken,
            'entitlementsToken': self.entitlementsToken,
            'userID': self.userID
        })

    def getAuthTokens(self):

        def parseToken(url):
            splittedTemp = url.split('&')
            return splittedTemp[0].split('=')[1]

        session = requests.Session()

        data = {
            "client_id":"play-valorant-web-prod",
            "nonce":"1",
            "redirect_uri":"https://playvalorant.com/opt_in",
            "response_type":"token id_token"
        }

        session.post('https://auth.riotgames.com/api/v1/authorization', json=data)


        data = {
            "type": "auth",
            "username": self.username,
            "password": self.password,
            "remember": True,
            "language": "en_US"
        }
        res = session.put('https://auth.riotgames.com/api/v1/authorization', json=data)

        data = res.json()
        url = data['response']['parameters']['uri']

        accessToken = parseToken(url)

        header = {
            'Authorization': f'Bearer {accessToken}'
        }
        res = session.post('https://entitlements.auth.riotgames.com/api/token/v1', headers=header, json={})
        data = res.json()

        entitlementsToken = data['entitlements_token']

        res = session.get('https://auth.riotgames.com/userinfo', headers=header)
        userId = res.json()['sub']

        return accessToken, entitlementsToken, userId

    def makeGetRequest(self, url, header):
        try:
            res = requests.get(url, headers=header)
            return res
        except:
            self.getAuthTokens()
            return self.makeGetRequest(url, header)

    def makePostRequest(self, url, header):
        try:
            res = requests.post(url, headers=header)
            return res
        except:
            self.getAuthTokens()
            return self.makePostRequest(url, header)

