<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="$store.getters['wallet/isBroadcasting']"
  >
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="48"
              class="mb-6"
            ></v-progress-circular>
            <h2 class="subtitle-1 mt-4">
              Waiting tx confirmation...
            </h2>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
