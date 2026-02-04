/**
 * CEP utility functions for formatting, validation, and API integration
 */

/**
 * Format CEP as xxxxx-xxx progressively during input
 * @param {string} value - Raw input value
 * @returns {string} Formatted CEP
 */
export function formatCEP(value) {
  if (!value) return "";

  const digits = value.replace(/\D/g, "");

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

/**
 * Clean CEP to 8 digits only
 * @param {string} value - CEP value (formatted or not)
 * @returns {string} Clean 8 digits
 */
export function cleanCEP(value) {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

/**
 * Validate CEP format (8 digits)
 * @param {string} cep - CEP to validate
 * @returns {boolean} True if valid format
 */
export function validateCEPFormat(cep) {
  if (!cep) return false;
  const digits = cleanCEP(cep);
  return digits.length === 8 && /^\d{8}$/.test(digits);
}

/**
 * Fetch address data from ViaCEP API
 * @param {string} cep - CEP to lookup (8 digits)
 * @returns {Promise<Object|null>} Address data or null if not found
 * @throws {Error} On network or API errors
 */
export async function fetchAddressByCEP(cep) {
  const cleanedCEP = cleanCEP(cep);

  if (!validateCEPFormat(cleanedCEP)) {
    throw new Error("CEP deve ter 8 dígitos");
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cleanedCEP}/json/`,
    );

    if (!response.ok) {
      throw new Error("Erro ao conectar com o serviço de CEP");
    }

    const data = await response.json();

    // ViaCEP returns {erro: true} when CEP not found
    if (data.erro) {
      return null;
    }

    return {
      logradouro: data.logradouro || "",
      bairro: data.bairro || "",
      localidade: data.localidade || "",
      uf: data.uf || "",
      complemento: data.complemento || "",
    };
  } catch (error) {
    if (error.message.includes("CEP deve ter")) {
      throw error;
    }
    throw new Error("Erro ao buscar CEP. Verifique sua conexão.");
  }
}
