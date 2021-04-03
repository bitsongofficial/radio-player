<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="true"
  >
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-icon color="red" size="100">mdi-alert-circle-outline</v-icon>
            <h2 class="subtitle-1 mt-4">
              send transactions are disabled: failed to execute message; message
              index: 0
            </h2>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('cancel')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
