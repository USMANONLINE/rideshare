import Vue from 'vue'
import PouchDB from 'pouchdb'
import find from 'pouchdb-find'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA5tgK8eYRIzo4pArmcJjqOU8OvmSzJlvg',
    libraries: 'places'
  }
})
PouchDB.plugin(find)

const baseUrl = 'http://localhost:5984/sample'
const mapApi = 'AIzaSyA5tgK8eYRIzo4pArmcJjqOU8OvmSzJlvg'
const api = new PouchDB(baseUrl, { skip_setup: true })

export { api, baseUrl }
