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
      <q-tab name="map" label="Map" />
      <q-tab name="list" label="List" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="map" class="no-padding">
        <GmapMap
          :center="{ lat:10, lng:10 }"
          :zoom="7"
          map-type-id="terrain"
          style="width: 100%; height: 400px"
        >
          <GmapMarker
            v-for="(ride, rId) in rides" :key="rId"
            :position="{ lat: ride.destination.lat, lng: ride.destination.lng }"
            :clickable="true"
            :draggable="true"
            @click="free = ride, dialog.rideInfo = !dialog.rideInfo"
          />
        </GmapMap>
      </q-tab-panel>

      <q-tab-panel name="list" class="q-pa-none">
        <q-list bordered separator>
          <q-item @click="free = ride, dialog.rideInfo = !dialog.rideInfo" clickable v-ripple v-for="(ride, rId) in rides" :key="rId">
            <q-item-section avatar>
              <q-avatar v-if="getUserInfo(ride.meta.from).picture !== undefined">
                <img :src="getUserInfo(ride.meta.from).picture">
              </q-avatar>
              <q-avatar v-if="getUserInfo(ride.meta.from).picture === undefined" style="background-color: #f39766" text-color="white" icon="account_circle">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ getUserInfo(ride.meta.from).name }}</q-item-label>
              <q-item-label caption lines="5">
                <span class="text-weight-bold">{{ ride.leave.formattedAddress }}</span>
                -
                <span class="text-weight-bold">{{ ride.destination.formattedAddress }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn flat round dense icon="info">
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="dialog.rideInfo" position="bottom">
      <q-card style="width: 450px">
        <q-toolbar style="background-color: #f39766" class="text-white">
          <q-toolbar-title>Ride Info</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-list separator bordered>
          <q-item clickable v-ripple v-if="free.meta.from">
            <q-item-section>
              <q-item-label>{{ getUserInfo(free.meta.from).name }}</q-item-label>
              <q-item-label caption>Rider Name</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="free.meta.from" clickable v-ripple tag="a" :href="'tel:' +getUserInfo(free.meta.from).phone">
            <q-item-section>
              <q-item-label>{{ getUserInfo(free.meta.from).phone }}</q-item-label>
              <q-item-label caption>Rider Phone</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ free.vehicle }}</q-item-label>
              <q-item-label caption>Vehicle</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ free.seats }}</q-item-label>
              <q-item-label caption>Seats</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-if="!free.free">
            <q-item-section>
              <q-item-label>{{ free.price }}</q-item-label>
              <q-item-label caption>Price Per Seat</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ free.leave.formattedAddress }}</q-item-label>
              <q-item-label caption>Start</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ free.destination.formattedAddress }}</q-item-label>
              <q-item-label caption>Destination</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ new Date(free.date).toDateString() }}</q-item-label>
              <q-item-label caption>Date</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>{{ free.time }}</q-item-label>
              <q-item-label caption>Time</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label lines="5">{{ free.info }}</q-item-label>
              <q-item-label caption>Info</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-actions>
          <q-btn
            @click="joinTrip"
            outline
            label="Join"
            style="color: #f39766"
          />
          <q-btn
            outline
            label="Close"
            color="grey"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialog.reserve" position="top">
      <q-card style="width: 450px">
        <q-toolbar style="background-color: #f39766" class="text-white">
          <q-toolbar-title>Reserve Info</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-form @submit.prevent="makeReservation">
            <q-input
              v-model.number="numberOfSeats"
              autofocus
              type="number"
              label="Number of Seats"
              outlined dense
              lazy-rules
              :rules="[val => val > 0 && val <= (free.seats) || 'Number of seats cannot be 0 or greater than seats available']"
            />
            <q-btn
              type="submit"
              label="Save"
              style="color: #f39766"
              outline
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn :to="{ name: 'Create Ride' }" fab icon="add" color="orange-7" glossy />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { api } from 'boot/config'
export default {
  data: () => ({
    free: {
      date: null, time: null, seats: null, vehicle: null, info: null, destination: { formattedAddress: '' }, leave: { formattedAddress: '' }, meta: {}, seatsReserved: 0
    },
    tab: 'map',
    rides: [],
    users: [],
    dialog: {
      reserve: false,
      rideInfo: false
    },
    numberOfSeats: 1
  }),

  computed: {
  },

  methods: {
    getUserInfo (id) {
      return this.users.find(doc => doc._id === id)
    },

    joinTrip () {
      this.dialog.rideInfo = !this.dialog.rideInfo
      this.dialog.reserve = !this.dialog.reserve
    },

    makeReservation () {
      const user = this.$q.localStorage.getItem('session')
      this.free.seatsReserved += this.numberOfSeats
      this.free.seats -= this.numberOfSeats

      const order = {
        _id: 'order:' + new Date().toISOString(),
        seats: this.numberOfSeats,
        price: this.free.free ? 0 : (this.numberOfSeats * this.free.price),
        free: this.free.free ? true : false,
        meta: { stores: '_orders', date: new Date().toISOString(), for: user._id, ride: this.free._id }
      }

      api.bulkDocs([this.free, order]).then(response => {
        this.$q.notify({
          type: 'positive',
          message: 'Ride booked successfully'
        })
        this.dialog.reserve = !this.dialog.reserve
        const rideIndex = this.rides.findIndex(r => r._id === this.free._id)
        this.rides[rideIndex] = JSON.parse(JSON.stringify(this.free))

        this.free = { date: null, time: null, seats: null, vehicle: null, info: null, destination: { formattedAddress: '' }, leave: { formattedAddress: '' }, meta: {}, seatsReserved: 0 }
        this.numberOfSeats = 1
      }).catch(error => {
        this.$q.notify({
          type: 'negative',
          message: 'Unable to book ride. Please check your network and try again !'
        })
        return error
      })
    }
  },

  mounted () {
    api.find({
      selector: {
        $or: [
          { 'meta.stores': '_ride' },
          { 'meta.stores': '_user' }
        ]
      },
      limit: 2000
    }).then(response => {
      const rides = response.docs.filter(doc => doc.meta.stores === '_ride')
      const users = response.docs.filter(doc => doc.meta.stores === '_user')
      this.rides = rides
      this.users = users
    }).catch(error => {
      this.$q.notify({
        type: 'negative',
        message: 'Unable to load rides. Please check your network and try again !'
      })
      return error
    })
  }
}
</script>
