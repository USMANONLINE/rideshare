<template>
  <q-page padding>

    <q-tabs
      dense
      v-model="tab"
      class="text-grey q-mb-sm"
      active-color="orange"
      indicator-color="orange"
      align="right"
    >
      <q-tab name="rides" label="My Rides" />
      <q-tab name="orders" label="My Orders" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="rides"  class="q-pa-none">
        <q-list bordered separator>
          <q-item v-for="(ride, rId) in rides" :key="rId">
            <q-item-section>
              <q-item-label lines="1">{{ getUser(ride.meta.from).name }}</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-weight-bold">{{ ride.leave.formattedAddress }}</span>
                -
                <span class="text-weight-bold">{{ ride.destination.formattedAddress }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn flat round dense icon="more_vert">
                <q-menu>
                  <q-list separator>
                    <q-item @click="initJourney(ride)" clickable v-close-popup v-if="ride.status === 'HALT'">
                      <q-item-section>Start Journey</q-item-section>
                    </q-item>
                    <q-item @click="endJourney(ride)" clickable v-close-popup>
                      <q-item-section>End Journey</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="orders" class="q-pa-none">
        <q-list bordered separator>
          <q-item v-for="(order, oId) in orders" :key="oId">
            <q-item-section>
              <q-item-label lines="1">{{ getUser(getRide(order.meta.ride).meta.from).name }}</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-weight-bold">{{ getRide(order.meta.ride).leave.formattedAddress }}</span>
                -
                <span class="text-weight-bold">{{ getRide(order.meta.ride).destination.formattedAddress }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn flat round dense icon="more_vert">
                <q-menu>
                  <q-list separator>
                    <q-item clickable v-close-popup @click="loadRideInfo(order)">
                      <q-item-section>Ride Info</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="loadOrderInfo(order)">
                      <q-item-section>Order Info</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog position="top" v-model.trim="dialog.orderInfo">
      <q-card style="width: 450px">
        <q-toolbar style="background-color: #f39766" class="text-white">
          <q-toolbar-title>Order Info</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-list separator bordered>
          <q-item>
            <q-item-section>
              <q-item-label>{{ order.seats }}</q-item-label>
              <q-item-label caption>Seats</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>{{ order.price }}</q-item-label>
              <q-item-label caption>Price</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-actions align="right">
          <q-btn
            outline
            label="Close"
            v-close-popup
            style="color: #f39766"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialog.rideInfo" position="bottom">
      <q-card style="width: 450px">
        <q-toolbar style="background-color: #f39766" class="text-white">
          <q-toolbar-title>Ride Info</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-list separator bordered>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ getUser(ride.meta.from) !== undefined ? getUser(ride.meta.from).name : '' }}</q-item-label>
              <q-item-label caption>Rider Name</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple tag="a" :href="'tel:' +getUser(ride.meta.from).phone">
            <q-item-section>
              <q-item-label>{{ getUser(ride.meta.from) !== undefined ? getUser(ride.meta.from).phone : '' }}</q-item-label>
              <q-item-label caption>Rider Phone</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ ride.vehicle }}</q-item-label>
              <q-item-label caption>Vehicle</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-if="!ride.free">
            <q-item-section>
              <q-item-label>{{ ride.price }}</q-item-label>
              <q-item-label caption>Price Per Seat</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ ride.leave.formattedAddress }}</q-item-label>
              <q-item-label caption>Start</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ ride.destination.formattedAddress }}</q-item-label>
              <q-item-label caption>Destination</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ new Date(ride.date).toDateString() }}</q-item-label>
              <q-item-label caption>Date</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ ride.time }}</q-item-label>
              <q-item-label caption>Time</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label lines="5">{{ ride.info }}</q-item-label>
              <q-item-label caption>Info</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-actions>
          <q-btn
            outline
            label="Close"
            color="grey"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { api } from 'boot/config'
export default {
  data: () => ({
    tab: 'rides',
    records: [],
    order: {},
    ride: { date: null, time: null, seats: null, vehicle: null, info: null, destination: { formattedAddress: '' }, leave: { formattedAddress: '' }, meta: {}, seatsReserved: 0 },
    dialog: {
      orderInfo: false,
      rideInfo: false
    }
  }),

  methods: {
    getRide (id) {
      return this.rides.find(r => r._id === id)
    },
    getUser (id) {
      if (id === null || id === undefined)
        return { name: '', phone: '' }
      return this.users.find(r => r._id === id)
    },

    loadRideInfo (order) {
      this.ride = this.getRide(order.meta.ride)
      this.dialog.rideInfo = !this.dialog.rideInfo
    },

    loadOrderInfo (order) {
      this.order = order
      this.dialog.orderInfo = !this.dialog.orderInfo
    },

    initJourney (ride) {
      this.$q.loading.show()
      const rideClone = JSON.parse(JSON.stringify(ride))
      rideClone.status = 'ON_TRANSIT'
      api.put(rideClone).then(response => {
        rideClone._rev = response.rev
        const storeClone = this.records.slice()
        const targetIndex = storeClone.findIndex(doc => doc._id === response.id)

        storeClone[targetIndex] = rideClone
        this.records = storeClone

        this.$q.notify({
          type: 'positive',
          message: 'Journey status has been updated successfully'
        })
        this.$q.loading.hide()
      }).catch(error => {
        this.$q.notify({
          type: 'negative',
          message: 'Unable to start journey. Please check your network and try again !'
        })
        this.$q.loading.hide()
        return error
      })
    },

    endJourney (ride) {
      this.$q.loading.show()
      const rideClone = JSON.parse(JSON.stringify(ride))
      rideClone.status = 'ARRIVED'
      api.put(rideClone).then(response => {
        rideClone._rev = response.rev
        const storeClone = this.records.slice()
        const targetIndex = storeClone.findIndex(doc => doc._id === response.id)

        storeClone[targetIndex] = rideClone
        this.records = storeClone

        this.$q.notify({
          type: 'positive',
          message: 'Congratulations, Hope you had a nice journey'
        })
        this.$q.loading.hide()
      }).catch(error => {
        this.$q.notify({
          type: 'negative',
          message: 'Unable to end journey. Please check your network and try again !'
        })
        this.$q.loading.hide()
        return error
      })
    }
  },

  computed: {
    orders () {
      return this.records.filter(r => r.meta.stores === '_orders')
    },
    rides () {
      return this.records.filter(r => r.meta.stores === '_ride')
    },
    users () {
      return this.records.filter(r => r.meta.stores === '_user')
    }
  },

  mounted () {
    const user = this.$q.localStorage.getItem('session')
    api.find({
      selector: {
        $or: [
          { 'meta.stores': '_orders', 'meta.for': user._id },
          { 'meta.stores': '_ride', 'meta.from': user._id },
          { 'meta.stores': '_user' }
        ]
      }
    }).then(response => {
      this.records = response.docs
    }).catch(error => {
      this.$q.notify({
        type: 'negative',
        message: 'Unable to load records. Please check your network and try again !'
      })
      return error
    })
  }
}
</script>
