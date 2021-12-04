<template>
  <q-layout>
    <q-page-container>
      <q-page style="background-color: #f39766" class="flex flex-center">
        <q-card style="width: 450px; background-color: #f39766;" flat>
          <img src="rs.png" />
          <q-card-section>
            <q-form @submit.prevent="signUser">
              <q-input
                v-model.trim="account.name"
                dense
                standout
                bg-color="white"
                :input-style="{ color: 'black' }"
                type="text"
                name="name"
                label="Full Name"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type in Full Name']"
              />
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
                v-model.trim="account.phone"
                dense
                standout
                bg-color="white"
                :input-style="{ color: 'black' }"
                type="tel"
                name="phone"
                label="Phone Number"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type in Phone Number']"
              />
              <div>
                <label>Gender</label>
                <div class="q-gutter-sm">
                  <q-radio color="white" v-model="account.gender" val="male" label="Male" />
                  <q-radio color="white" v-model="account.gender" val="female" label="Female" />
                </div>
              </div>
              <q-input
                v-model.trim="account.password"
                dense
                standout
                :input-style="{ color: 'black' }"
                type="password"
                name="password"
                label="Password"
                bg-color="white"
              />
              <q-btn 
                :loading="loader"
                type="submit"
                label="Sign up"
                class="q-mt-md full-width"
                push
                glossy
                style="color: #f6f6f6" />
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
    loader: false,
    account: {
      meta: {
        stores: '_user',
        date: new Date().toISOString()
      }
    }
  }),

  methods: {
    signUser () {
      this.loader = true
      const accountClone = Object.assign({}, this.account)
      if (accountClone.gender === undefined) {
        this.$q.notify({
          type: 'info',
          message: 'Please select your gender'
        })
        this.loader = false
      } else {
        const salt = bcrypt.genSaltSync(13)
        accountClone.password = bcrypt.hashSync(this.account.password, salt)
        accountClone._id = 'account:' + accountClone.email
        api.put(accountClone).then(response => {
          this.$q.notify({
            type: 'positive',
            message: 'Account created successfully !'
          })
          this.loader = false
          this.$router.push({ name: 'Sign in' })
        }).catch(error => {
          this.$q.notify({
            type: 'negative',
            message: 'Unable to create account. Please check your network and try again !'
          })
          this.loader = false
          return error
        })
      }
    }
  }
}
</script>