<template>
  <q-page padding>
    <q-file
      v-show="false"
      v-model="profilePic"
      ref="profilePic"
      @input="uploadUserPic"
      accept=".jpg, image/*"
    />

    <q-card flat>
      <q-card-section class="text-center">
        <q-avatar size="120px" v-if="user.picture !== undefined">
          <q-img :src="user.picture" />
        </q-avatar>
        <q-avatar font-size="132px" v-if="user.picture === undefined" size="120px" icon="account_circle" />
      </q-card-section>

      <q-card-section class="text-center">
        <q-btn @click="triggerUploadWindow" label="Change Photo" color="dark" rounded outline/>
        <div class="text-h6 text-center">{{ user.name }}</div>
      </q-card-section>

      <div class="row">
          <div class="q-pa-xs col-4">
            <q-card flat bordered class="text-center">
              <div class="text-h6">120</div>
              <div class="text-subtitle1">Rides</div>
            </q-card>
          </div>
          <div class="q-pa-xs col-4">
            <q-card flat bordered class="text-center">
              <div class="text-h6">120</div>
              <div class="text-subtitle1">Rides</div>
            </q-card>
          </div>
          <div class="q-pa-xs col-4">
            <q-card flat bordered class="text-center">
              <div class="text-h6">120</div>
              <div class="text-subtitle1">Rides</div>
            </q-card>
          </div>
        </div>
    </q-card>

    <q-list bordered separator>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ user.name }}</q-item-label>
              <q-item-label caption>Full Name</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="3">{{ user.email }}</q-item-label>
              <q-item-label caption>Email Address</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="phone" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ user.phone }}</q-item-label>
              <q-item-label caption>Phone Number</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-capitalize">{{ user.gender }}</q-item-label>
              <q-item-label caption>Gender</q-item-label>
            </q-item-section>
          </q-item>


          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Usman</q-item-label>
              <q-item-label caption>Full Name</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Usman</q-item-label>
              <q-item-label caption>Full Name</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

    <q-dialog position="top" v-model="dialog.edit">
      <q-card style="width: 450px">
        <q-toolbar style="background-color: #f39766" class="text-white">
          <q-toolbar-title>Update Profile</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-form @submit.prevent="updateUserProfile">
            <q-input
              v-model.trim="profileUpdate.name"
              type="text"
              label="Full Name"
              name="name"
              lazy-rules
              outlined
              dense
              :rules="[val => val && val.length > 0 || 'Please type in fullname']"
            />
            <q-input
              v-model.trim="profileUpdate.phone"
              type="tel"
              label="Phone Number"
              name="tel"
              lazy-rules
              outlined
              dense
              :rules="[val => val && val.length > 0 || 'Please type in phone number']"
            />
            <q-btn
              label="Update"
              type="submit"
              style="color: #f39766"
              outline
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="profileUpdate = Object.assign({}, user), dialog.edit = !dialog.edit" fab icon="edit" color="orange-7" glossy />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { api, baseUrl } from 'boot/config'

export default {
  data: () => ({
    user: {},
    profilePic: null,
    dialog: { edit: false },
    profileUpdate: {}
  }),

  methods: {
    triggerUploadWindow () {
      this.$refs.profilePic.$el.click()
    },

    uploadUserPic (file) {
      const fileUpload = {
        _id: 'profilepic:' + new Date().toISOString(),
        _attachments: {
          [file.name]: {
            content_type: file.type,
            data: file
          }
        }
      }
      this.user.picture = baseUrl + '/' + fileUpload._id + '/' + file.name

      api.bulkDocs([fileUpload, this.user]).then(response => {
        const userRef = response.find(doc => doc.id === this.user._id)
        this.user._ref = userRef.rev
        this.$q.localStorage.set('session', this.user)
        this.$q.notify({
          type: 'positive',
          message: 'Profile picture uploaded successfully !'
        })
      }).catch(error => {
        this.$q.notify({
          type: 'negative',
          message: 'Unable to upload picture. Please check your network and try again !'
        })
        return error
      })
    },

    updateUserProfile () {
      api.put(this.profileUpdate).then(response => {
        this.profileUpdate._rev = response.rev
        this.$q.localStorage.set('session', this.profileUpdate)
        this.user = this.profileUpdate
        this.$q.notify({
          type: 'positive',
          message: 'Profile updated successfully !'
        })
        this.dialog.edit = !this.dialog.edit
      }).catch(error => {
        this.$q.notify({
          type: 'negative',
          message: 'Unable to update user profile. Please check your network and try again !'
        })
        return error
      })
    }
  },

  mounted () {
    this.user = this.$q.localStorage.getItem('session')
  }
}
</script>
