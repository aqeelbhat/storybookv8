export default class Worker {
    constructor(stringUrl) {
      this.url = stringUrl
      this.onmessage = () => {}
      this.onerror = () => {}
      this.terminate = () => {}
      this.dispatchEvent = () => boolean
    }
  
    postMessage(msg) {
      this.onmessage(msg)
    }

    addEventListener(type, callback, options) {}

    removeEventListener(type, callback, options) {}

    dispatchEvent(event) {
        return this.dispatchEvent(event)
    }

    onmessageerror(err) {
        this.onmessageerror(err)
    }

    terminate () {
        this.terminate()
    }

    onerror(err) {
        this.onerror(err)
    }
}