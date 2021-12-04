<template>
  <q-layout>
    <q-page-container>
      <q-page style="background-color: #f39766" class="flex flex-center">
        <q-card style="width: 450px; background-color: #f39766;" flat>
          <img src="rs.png" />
          <q-card-section>
            <q-form @submit.prevent="signIn">
              <q-input
                v-model.trim="account.email"
                dense
                standout
                bg-color="white"
                :input-style="{ color: 'black' }"
                type="email"
                name="email"
                label="Email Address"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type Email Address']"
              />
              <q-input
                v-model.trim="account.password"
                dense
                standout
                bg-color="white"
                :input-style="{ color: 'black' }"
                type="password"
                name="password"
                label="Password"
              />
              <q-btn :loading="loader" type="submit" label="Sign in" class="q-mt-md full-width" outline style="color: #f6f6f6" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/config'
import bcrypt from 'bcryptjs'

export default {
  data: () => ({
    account: {},
    loader: false
  }),

  methods: {
    signIn () {
      this.loader = true
      api.get('account:' + this.account.email).then(response => {
        if (bcrypt.compareSync(this.account.password, response.password)) {
          this.$q.localStorage.set('session', response)
          this.$router.push({ name: 'Main' })
        } else {
          this.$q.notify({
            type: 'info',
            message: 'Incorrect login credentials !'
          })
        }
        this.loader = false
      }).catch(error => {
        if (error.name === 'not_found') {
          this.$q.notify({
            type: 'info',
            message: 'No account registered with email ' + this.account.email
          })
        } else {
          this.$q.notify({
            type: 'negative',
            message: 'Unable to sign in. Please check your network and try again !'
          })
        }
        this.loader = false
        return error
      })
    }
  }
}
</script>

