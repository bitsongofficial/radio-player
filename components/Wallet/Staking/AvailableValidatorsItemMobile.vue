<template>
  <v-list-item class="mb-3 mx-0 px-0">
    <v-card class="w-full" @click.stop="onSelectCard">
      <v-card-text>
        <v-flex>
          <v-row>
            <v-col cols="12" align="center" justify="start">
              <!-- Name cell -->
              <v-flex class="d-flex flex-row align-center">
                <validator-avatar
                  :identity="validator.tokens"
                  :valoper="validator.operator_address"
                  size="30px"
                />
                <dot-status-with-tooltip
                  :status="validator.status === 2"
                  :msg="validator.status === 2 ? 'Active' : 'Inactive'"
                  class="mx-2"
                />
                <span class="caption-1">
                  {{ validator.description.moniker }}
                </span>
              </v-flex>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8" class="flex-col-start">
              <!-- Tokens cell -->
              <amount
                :style="$vuetify.breakpoint.mdAndUp ? 'font-size: 1.4em': 'font-size: 1em'"
                class="my-auto"
                :micro-amount="validator.tokens"
                :noDecimals="true"
                :denom="denom"
              />
              <span class="ml-1">
                ({{ validator.voting_power_percent }}) %
              </span>
            </v-col>
            <v-col cols="4" align="center" justify="end">
              <warning-commission-icon
                v-if="validator.details !== null && validator.commission.commission_rates.rate > 0.5"
              />
              <span class="mr-5">
                {{ validator.details !== null ? validator.commission.commission_rates.rate * 100 : 0 }}%
              </span>
            </v-col>
          </v-row>
        </v-flex>
      </v-card-text>
    </v-card>
  </v-list-item>
</template>

<script>
import ValidatorAvatar from "@/components/Wallet/Common/AvatarToken.vue";
import Amount from "@/components/Wallet/Common/Amount.vue";
import DotStatusWithTooltip from "@/components/Wallet/Common/DotStatusWithTooltip.vue";
import WarningCommissionIcon from "@/components/Wallet/Common/WarningCommissionIcon.vue";

export default {
  components: {
    ValidatorAvatar,
    Amount,
    DotStatusWithTooltip,
    WarningCommissionIcon
  },

  props: {
    validator: {
      type: Object,
      required: true
    }
  },

  computed: {
    denom() {
      return this.$store.getters["app/micro_stake_denom"];
    },
    decimals() {
      return this.$store.getters["app/decimals"];
    }
  },

  methods: {
    onSelectCard () {
      this.$emit('select', this.validator)
    }
  }
}
</script>

<style>
.w-full {
  width: 100%;
}
</style>
