<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
    max-width="400"
    :value="true"
  >
    <distribution-withdraw
      v-model="value"
      v-on:cancel="$emit('cancel')"
    ></distribution-withdraw>
  </v-dialog>
</template>

<script>
import DistributionRewards from "@/components/Wallet/Distribution/Rewards";
import DistributionWithdraw from "@/components/Wallet/Distribution/Withdraw";

export default {
  props: {
    value: {
      type: Array,
      required: true
    }
  },

  components: {
    DistributionRewards,
    DistributionWithdraw
  },

  data() {
    return {
      loading: false,
      withdraw: null,
      rewards: []
    };
  },

  computed: {
    address() {
      return this.$store.getters[`wallet/address`];
    }
  },

  created() {
    this.getRewards();
  },

  methods: {
    async getRewards() {
      try {
        this.loading = true;
        const validators = await this.$btsg.getValidators();
        const rewards = await this.$btsg.getDelegatorRewards(this.address);

        this.rewards = rewards.rewards
          .map(r => {
            const val = validators.result.find(
              v => v.operator_address === r.validator_address
            );
            return {
              ...r,
              validator_name: val !== undefined ? val.description.moniker : "",
              identity: val !== undefined ? val.description.identity : "",
              amt: r.reward === null ? 0 : r.reward[0].amount
            };
          })
          .sort((a, b) => {
            return b.amt - a.amt;
          });

        this.loading = false;
      } catch (e) {
        console.error(e);
      }
    },
    onWithdraw(valoper) {
      this.withdraw = valoper;
      this.$vuetify.goTo("#withdraw", {
        duration: 300,
        offset: 0,
        easing: "easeInOutCubic"
      });
    }
  }
};
</script>
