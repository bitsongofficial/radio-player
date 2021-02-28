<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12" class="py-0">
        <v-flex
          class="tabs-wrapper overflow-none mb-3"
        >
          <!-- Tabs menu -->
          <v-tabs
            v-model="tab"
            grow
            centered
            show-arrows
          >
            <v-tab
              href="#all"
              :class="isDarkTheme ? 'black' : 'grey lighten-3'"
              class="text-uppercase"
            >
              All ({{ totalVotes }})
            </v-tab>
            <v-tab
              href="#yes"
              :class="isDarkTheme ? 'black' : 'grey lighten-3'"
              class="text-uppercase"
            >
              Yes ({{ totalYes }})
            </v-tab>
            <v-tab
              href="#no"
              :class="isDarkTheme ? 'black' : 'grey lighten-3'"
              class="text-uppercase"
            >
              No ({{ totalNo }})
            </v-tab>
            <v-tab
              href="#noWithVeto"
              :class="isDarkTheme ? 'black' : 'grey lighten-3'"
              class="text-uppercase"
            >
              NoWithVeto ({{ totalNoWithVeto }})
            </v-tab>
            <v-tab
              href="#abstain"
              :class="isDarkTheme ? 'black' : 'grey lighten-3'"
              class="text-uppercase"
            >
              Abstain ({{ totalAbstain }})
            </v-tab>
          </v-tabs>
          <!-- End Tabs menu -->
        </v-flex>
        <v-card>
          <v-card-title>
            Votes
          </v-card-title>

          <v-card-text>
            <v-flex>
              <v-data-table
                :headers="headers"
                :items="filterItems(votes, tab)"
                :loading="loading"
              >
                <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>

                <!-- Voter cell -->
                <template v-slot:item.voter="{ item }">
                  <a class="caption-1 link-color" :href="`${explorerUrl}/account/${item.voter}`">
                    {{ truncateString(item.voter) }}
                  </a>
                </template>

                <!-- Answer cell -->
                <template v-slot:item.answer="{ item }">
                  {{ captialize(item.answer) }}
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
            </v-flex>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { formatTimestamp, timeSince, captialize, truncateString } from "@/lib/utils";

export default {

  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },

  data () {
    return {
      tab: 'all',
      loading: false,
      headers: [
        { text: 'Voter', value: 'voter' },
        { text: 'Answer', value: 'answer' },
        { text: 'Time', value: 'time', align: 'right' }
      ],
      votes: [
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'no', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'no', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'no', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'no', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'no', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'noWithVeto', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'noWithVeto', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'noWithVeto', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'yes', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'abstain', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'abstain', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'abstain', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'abstain', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'abstain', time: '2021-02-12T05:35:54.623785Z' },
        { voter: 'cosmos1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep4tgu9q', txhash: '265BE2EEFC316B2ACC4E23978E6D2655479C47929777FA7AC6D485F982721394', answer: 'abstain', time: '2021-02-12T05:35:54.623785Z' }
      ]
    }
  },

  // TODO: Replace with actual values
  computed: {
    totalVotes () {
      return 698
    },
    totalYes () {
      return 684
    },
    totalNo () {
      return 6
    },
    totalNoWithVeto () {
      return 3
    },
    totalAbstain () {
      return 5
    },
    explorerUrl () {
      return this.$store.getters["app/url_account_explorer"];
    },
    isDarkTheme() {
      return this.$store.getters[`app/dark_theme`]
    }
  },

  methods: {
    filterItems (items, filter) {
      if (filter === 'all') {
        return items
      }
      return items.filter(i => i.answer === filter)
    },
    captialize (word) {
      return captialize(word)
    },
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