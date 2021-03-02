<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col
          md="1"
          cols="12"
          :class="{ 'text-center': $vuetify.breakpoint.smAndDown }"
        >
          <validator-avatar :validator="validator" size="55px" />
        </v-col>
        <v-col cols="12" md="10">
          <h2 style="display: inline" class="text-h6">
            {{ validator.description.moniker }}
          </h2>
          <v-chip
            v-if="validator.status === 2"
            style="margin-top: -5px"
            class="ml-2 font-weight-medium"
            color="green"
            text-color="white"
            small
          >
            Active
          </v-chip>
          <v-chip
            v-if="validator.status !== 2"
            style="margin-top: -5px"
            class="ml-2 font-weight-medium"
            color="red"
            text-color="white"
            small
          >
            Inactive
          </v-chip>
          <v-chip
            v-if="validator.jailed"
            style="margin-top: -5px"
            class="ml-2 font-weight-medium"
            color="red"
            text-color="white"
            small
          >
            Jailed
          </v-chip>
          <p class="pr-8 mb-2">{{ validator.description.details }}</p>
          <div>
            <a
              v-if="validator.description.website"
              :href="validator.description.website"
              target="_blank"
              class="v-btn v-btn--flat v-btn--icon v-btn--round v-btn--router theme--light v-size--default"
            >
              <v-icon left>mdi-web</v-icon>
            </a>
            <a
              v-if="validator.description.security_contact"
              :href="`mailto:${validator.description.security_contact}`"
              target="_blank"
              class="v-btn v-btn--flat v-btn--icon v-btn--round v-btn--router theme--light v-size--default"
            >
              <v-icon>mdi-email</v-icon>
            </a>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col md="6" cols="12">
            <div class="subtitle-1">
              {{ validator.operator_address }}
            </div>
            <div
              class="grey--text subtitle-2 text--darken-2 font-weight-regular"
            >
              Operator Address
            </div>
          </v-col>
          <v-col md="6" cols="12">
            <div class="subtitle-1">
              <nuxt-link
                :to="`${explorerUrl}/account/${validator.delegator_address}`"
              >
                {{ validator.delegator_address }}
              </nuxt-link>
            </div>
            <div
              class="grey--text subtitle-2 text--darken-2 font-weight-regular"
            >
              Delegator Address
            </div>
          </v-col>
          <v-col md="6" cols="12">
            <div class="subtitle-1">
              {{ validator.address }}
            </div>
            <div
              class="grey--text subtitle-2 text--darken-2 font-weight-regular"
            >
              Address
            </div>
          </v-col>
          <v-col md="6" cols="12">
            <div class="subtitle-1">
              <amount
                :micro-amount="validator.tokens"
                :denom="stakeDenom"
              ></amount>
            </div>
            <div
              class="grey--text subtitle-2 text--darken-2 font-weight-regular"
            >
              Tokens
            </div>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-row>
              <v-col md="3" cols="6">
                <div class="subtitle-1">
                  {{
                    Number(
                      validator.commission.commission_rates.rate * 100
                    ).toFixed(2)
                  }}
                  %
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon size="20" v-on="on" style="margin-top: -5px"
                        >mdi-information-outline</v-icon
                      >
                    </template>
                    <span
                      >Last Update:
                      {{ new Date(validator.commission.update_time) }}</span
                    >
                  </v-tooltip>
                </div>
                <div
                  class="grey--text subtitle-2 text--darken-2 font-weight-regular"
                >
                  Commission
                </div>
              </v-col>
              <v-col md="3" cols="6">
                <div class="subtitle-1">
                  {{
                    Number(
                      validator.commission.commission_rates.max_rate * 100
                    ).toFixed(2)
                  }}
                  %
                </div>
                <div
                  class="grey--text subtitle-2 text--darken-2 font-weight-regular"
                >
                  Max Commission
                </div>
              </v-col>
              <v-col md="6" cols="12">
                <div class="subtitle-1">
                  {{
                    Number(
                      validator.commission.commission_rates.max_change_rate *
                        100
                    ).toFixed(2)
                  }}
                  %
                </div>
                <div
                  class="grey--text subtitle-2 text--darken-2 font-weight-regular"
                >
                  Max Change
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-container>
  </v-card>
</template>

<script>
import ValidatorAvatar from "@/components/Wallet/Common/ValidatorAvatar";
import Amount from "@/components/Wallet/Common/Amount";
export default {
  components: {
    ValidatorAvatar,
    Amount
  },

  props: {
    validator: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      showModalEditValidator: false
    };
  },

  computed: {
    stakeDenom() {
      return process.env.STAKEDENOM;
    },
    explorerUrl() {
      return process.env.URL_ACCOUNT_EXPLORER;
    }
  },

  methods: {
    onSelectEdit() {
      this.showModalEditValidator = true;
    },
    onCloseValidatorDialog() {
      this.showModalEditValidator = false;
    }
  }
};
</script>
