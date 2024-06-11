const GOOGLEAPIKEY = process.env.REACT_APP_GOOGLE_PLACE_API_KEY

export async function translateText (text: string, toLang: string): Promise<any> {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLEAPIKEY}`
  const request = {
    method: 'POST',
    headers: { 
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "q": text,
      "target": toLang
    })
  }

  return await fetch(url, request)
    .then(resp => resp.json())
    .then(data => data)
    .catch((error: any) => {
      return Promise.reject(error)
    })
}

const allDetectCalls: Array<string> = []
const allDetectCallsData: Array<{key: string, value: any}> = []
export async function detectTextLanguage (text: string): Promise<any> {
  const isDetectAllreadyCalled = allDetectCalls.find(item => item === text)
  if (!isDetectAllreadyCalled && text) {
    allDetectCalls.push(text)
    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLEAPIKEY}`
    const request: RequestInit = {
      method: 'POST',
      cache: 'force-cache',
      headers: { 
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "q": text
      })
    }

    return await fetch(url, request)
      .then(resp => resp.json())
      .then(data => {
        allDetectCallsData.push({
          key: text,
          value: data
        })
        return data
      })
      .catch((error: any) => {
        return Promise.reject(error)
      })
  }
  const findDataByKey = allDetectCallsData.find(item => item.key === text)
  if (findDataByKey) {
    return Promise.resolve(findDataByKey.value)
  }
  return Promise.reject('no input text to detect')
}
