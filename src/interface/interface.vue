<template>
	<div class="cep-input-wrapper">
		<v-input
			:model-value="displayValue"
			@update:model-value="handleInput"
			:placeholder="placeholder"
			maxlength="9"
			:disabled="disabled || loading"
			:loading="loading"
			font-family="monospace"
		>
			<template #append v-if="lastFetchSuccess !== null && !loading">
				<v-icon
					v-if="lastFetchSuccess"
					name="check_circle"
					small
					style="color: var(--theme--success);"
					v-tooltip="'CEP encontrado'"
				/>
				<v-icon
					v-else
					name="error"
					small
					style="color: var(--theme--danger);"
					v-tooltip="'CEP não encontrado'"
				/>
			</template>
		</v-input>

		<v-notice v-if="errorMessage" type="danger" class="error-notice">
			{{ errorMessage }}
		</v-notice>
	</div>
</template>

<script setup>
import { ref, computed, inject, nextTick, watch } from 'vue';
import { cleanCEP, formatCEP, fetchAddressByCEP } from '../utils/cep-utils.js';

const props = defineProps({
	value: {
		type: String,
		default: '',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	placeholder: {
		type: String,
		default: '00000-000',
	},
	autofillEnabled: {
		type: Boolean,
		default: true,
	},
	streetField: {
		type: String,
		default: null,
	},
	neighborhoodField: {
		type: String,
		default: null,
	},
	cityField: {
		type: String,
		default: null,
	},
	stateField: {
		type: String,
		default: null,
	},
	complementField: {
		type: String,
		default: null,
	},
	overwriteExisting: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['input', 'setFieldValue']);

// Access other field values from form context
const values = inject('values', ref({}));

// State management
const loading = ref(false);
const errorMessage = ref('');
const lastFetchSuccess = ref(null);

// Display value with formatting
const displayValue = computed(() => {
	return formatCEP(props.value);
});

// Watch for complete CEP and auto-trigger search
watch(() => props.value, (newValue) => {
	const cleanedCEP = cleanCEP(newValue);

	// Auto-trigger search when exactly 8 digits are entered
	if (cleanedCEP.length === 8 && props.autofillEnabled && !loading.value) {
		performCEPSearch(cleanedCEP);
	}
});

function handleInput(newValue) {
	const cleanValue = cleanCEP(newValue);

	lastFetchSuccess.value = null;
	errorMessage.value = '';

	// Emit the clean value to be stored in database
	emit('input', cleanValue);
}

// Unified CEP search function
async function performCEPSearch(cleanedCEP) {
	if (!props.autofillEnabled || loading.value) {
		return;
	}

	if (cleanedCEP.length !== 8) {
		return;
	}

	errorMessage.value = '';
	loading.value = true;

	try {
		const addressData = await fetchAddressByCEP(cleanedCEP);

		if (!addressData) {
			lastFetchSuccess.value = false;
			errorMessage.value = 'CEP não encontrado. Verifique o número digitado.';
			loading.value = false;
			return;
		}

		lastFetchSuccess.value = true;
		await populateAddressFields(addressData);

	} catch (error) {
		lastFetchSuccess.value = false;
		errorMessage.value = error.message || 'Erro ao buscar CEP. Verifique sua conexão.';
	} finally {
		loading.value = false;
	}
}

async function populateAddressFields(addressData) {
	const fieldMappings = [
		{ field: props.streetField, value: addressData.logradouro },
		{ field: props.neighborhoodField, value: addressData.bairro },
		{ field: props.cityField, value: addressData.localidade },
		{ field: props.stateField, value: addressData.uf },
		{ field: props.complementField, value: addressData.complemento },
	];

	for (const mapping of fieldMappings) {
		if (!mapping.field) {
			continue;
		}

		if (!mapping.value) {
			continue;
		}

		if (!props.overwriteExisting && values.value[mapping.field]) {
			continue;
		}

		emit('setFieldValue', { field: mapping.field, value: mapping.value });

		// CRITICAL: Wait for Vue to process the update before next emit
		await nextTick();
	}
}
</script>

<style scoped>
.cep-input-wrapper {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.error-notice {
	margin-top: 8px;
}
</style>
