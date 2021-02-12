import { getUserData } from '@decentraland/Identity'

// get player data
const userData = executeTask(async () => {
  const data = await getUserData()
  return data
})

// external servers being used by the project - Please change these to your own if working on something else!
export let fireBaseServer =
  'https://us-central1-decentraland-arcade.cloudfunctions.net/app/'

// get latest scoreboard data from server
export async function getScoreBoard() {
  try {
    let url = fireBaseServer + 'get-scores'
    let response = await fetch(url)
    let json = await response.json()
    return json
  } catch (e) {
    log('error fetching scores from server ', e)
  }
}

// change data in scoreboard
export async function publishScore(score: number) {
  if (!userData) {
    await userData
  }
  try {
    let url = fireBaseServer + 'publish-scores'
    let body = JSON.stringify({
      name: (await userData).displayName,
      score: score,
    })
    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    })
	
    return response.json()
  } catch (e) {
    log('error posting to server ', e)
  }
}

export async function getAds() {
	try {
		let url = fireBaseServer + 'get-ads'
		
		let response = await fetch(url)
		let json = await response.json()
		return json
	} catch(e) {
		log('error fetching ads from server ', e)
	}
}