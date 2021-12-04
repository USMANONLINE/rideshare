<template>
  <q-page padding>
    <q-card>
      <q-toolbar style="color: #f39766">
        <q-toolbar-title class="text-subtitle1">New Ride</q-toolbar-title>
      </q-toolbar>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="createRide">
          <GmapAutocomplete
            style="margin-top: 10px; width: 100%"
            placeholder="From"
            @place_changed="setLeaveLocation"
          /><br>
          <GmapAutocomplete
            style="margin-top: 10px; width: 100%"
            placeholder="Destination"
            @place_changed="setDestinationLocation"
          /><br>
          <q-input
            v-model.number="ride.seats"
            placeholder="Seats Available"
            style="margin-top: 10px"
            type="number"
            dense
            outlined
            lazy-rules
            :rules="[val => val && val > 0 || 'Please type in seats available']"
          />
          <q-input
            hint="4matic benz c350 (Black)"
            v-model.trim="ride.vehicle"
            label="Vehicle Info"
            outlined
            dense
            type="text"
            autogrow
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Please type in Vehicle Model']"
          />
          <q-input
            v-model.trim="ride.info"
            label="More about the trip"
            outlined
            dense
            type="text"
            autogrow
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Please type in more info about the trip']"
          />
          <q-input label="Date" dense outlined v-model="ride.date" mask="date" :rules="['date']">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="ride.date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input label="Time" dense outlined v-model="ride.time" mask="time" :rules="['time']">
            <template v-slot:prepend>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="ride.time" mask="HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-if="!ride.free" label="Cost Per Seat" type="number" dense outlined v-model.number="ride.price" lazy-rules :rules="[val => val && val > 0 || 'Ride Price Cannot be 0']" />
          <q-checkbox v-model="ride.free" color="orange" label="Free Ride" /><br>
          <q-btn
            outline
            type="submit"
            label="Save"
            style="color: #f39766"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { api } from 'boot/config'
export default {
  data: () => ({
    // status: HALT, TRANSIT, COMPLETE
    ride: { _id: 'ride:' + new Date().toISOString(), leave: null, destination: null, date: null, time: null, meta: { stores: '_ride', date: new Date().toISOString() }, seatsReserved: 0, free: true, price: 0, status: 'HALT' }
  }),

  methods: {
    createRide () {
      const user = this.$q.localStorage.getItem('session')
      this.ride.meta.from = user._id

      api.put(this.ride).then(response => {
        this.$q.notify({
          type: 'positive',
          message: 'Ride created successfully'
        })
        this.$router.push({ name: 'Main' })
      }).catch(error => {
        this.$q.notify({
          type: 'negative',
          message: 'Unable to create ride. Please check your network and try again !'
        })
        return error
      })
    },
    setLeaveLocation (location) {
      this.ride.leave = {
        formattedAddress: location.formatted_address,
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng()
      }
    },
    setDestinationLocation (location) {
      this.ride.destination = {
        formattedAddress: location.formatted_address,
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng()
      }
    }
  },

  mounted () {
    let formattedDateString = date.formatDate(Date.now(), 'YYYY-MM-DD')
    this.ride.date = formattedDateString
    let formattedTimeString = date.formatDate(Date.now(), 'HH:mm')
    this.ride.time = formattedTimeString
  }
}
</script>
