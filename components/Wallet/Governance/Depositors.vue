<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12" class="py-0">
        <v-card>
          
          <v-card-title>
            Depositors
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="depositors"
              :loading="loading"
              hide-default-footer
            >
              <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>

              <!-- Depositor cell -->
              <template v-slot:item.depositor="{ item }">
                <a class="caption-1" :href="`${explorerUrl}/account/${item.depositor}`">
                  {{ truncateString(item.depositor) }}
                </a>
              </template>

              <!-- Amount cell -->
              <template v-slot:item.amount="{ item }">
                <amount
                  style="font-size: 12pt"
                  :micro-amount="item.amount"
                  :denom="microStakeDenom"
                />
              </template>

              <!-- Time cell -->
              <template v-slot:item.time="{ item }">
                <div>
                  <div class="text-right">
                    {{ timeSince(item.time) }}
                  </div>
                  <div class="text-right caption grey--text">
                    ({{ formatTimestamp(item.time) }})
                  </div>
                </div>
              </template>

            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Amount from '@/components/Wallet/Common/Amount.vue'
import { formatTimestamp, timeSince, truncateString } from "@/lib/utils";

export default {
  
  components: {
    Amount
  },

  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },

  // TODO: replace placeholders
  data () {
    return {
      loading: false,
      headers: [
        { text: 'Depositor', value: 'depositor' },
        { text: 'Amount', value: 'amount' },
        { text: 'Time', value: 'time' },
      ],
      depositors: [
        { depositor: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', amount: '88530588570370', time: '2021-01-28T21:07:30.044676Z' },
        { depositor: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', amount: '88530588570370', time: '2021-01-28T21:07:30.044676Z' },
        { depositor: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', amount: '88530588570370', time: '2021-01-28T21:07:30.044676Z' },
        { depositor: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', amount: '88530588570370', time: '2021-01-28T21:07:30.044676Z' }
      ]
    }
  },

  computed: {
    explorerUrl () {
      return this.$store.getters["app/url_account_explorer"];
    },
    microStakeDenom () {
      return this.$store.getters["app/micro_stake_denom"];
    }
  },

  methods: {
    truncateString (word) {
      return truncateString(word)
    },
    formatTimestamp (timestamp) {
      return formatTimestamp(timestamp)
    },
    timeSince (date) {
      return timeSince(date)
    }
  }
}
</script>

<style>
.theme--light.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, .1) !important;
}
.theme--dark.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, .1);
}
</style>