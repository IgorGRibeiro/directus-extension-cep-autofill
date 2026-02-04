<template>
	<div class="cep-display">{{ formattedCEP }}</div>
</template>

<script>
import { formatCEP } from '../utils/cep-utils.js';

export default {
	props: {
		value: String,
	},
	computed: {
		formattedCEP() {
			if (!this.value) return '—';
			return formatCEP(this.value);
		}
	}
};
</script>

<style scoped>
.cep-display {
	font-family: var(--theme--fonts--monospace--font-family);
}
</style>
