import mongodb from 'mongodb'
const { MongoClient } = mongodb

export default new class {
  connect = async uri => {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = this.client.db()
  }

  disconnect = async () => {
    await this.client.close()
    this.client = null
    this.db = null
  }

  getCollection = async name => {
    if (!this.client || !this.client.isConnected()) {
      await this.connect(this.uri)
    }
    return this.db.collection(name)
  }
}()
