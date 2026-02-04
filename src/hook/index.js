export default ({ filter }, { services, getSchema, database }) => {
  // CEP format validation (8 digits only)
  function validateCEPFormat(cep) {
    const digits = cep.replace(/\D/g, "");

    if (digits.length !== 8) {
      return false;
    }

    if (!/^\d{8}$/.test(digits)) {
      return false;
    }

    return true;
  }

  // Validate CEP fields before creating items
  filter("items.create", async (input, meta, context) => {
    await validateCEPFields(input, meta, context);
    return input;
  });

  // Validate CEP fields before updating items
  filter("items.update", async (input, meta, context) => {
    await validateCEPFields(input, meta, context);
    return input;
  });

  async function validateCEPFields(input, meta) {
    const { collection } = meta;
    const payload = Array.isArray(input) ? input : [input];

    // Use FieldsService to get field metadata
    const { FieldsService } = services;
    const fieldsService = new FieldsService({
      knex: database,
      schema: await getSchema(),
    });

    const fields = await fieldsService.readAll(collection);

    // Find fields that use the cep-autofill interface
    const cepFields = [];
    for (const field of fields) {
      if (field.meta?.interface === "cep-autofill") {
        cepFields.push(field.field);
      }
    }

    if (cepFields.length === 0) {
      return;
    }

    for (const item of payload) {
      for (const fieldName of cepFields) {
        const cepValue = item[fieldName];

        if (cepValue === undefined || cepValue === null || cepValue === "") {
          continue;
        }

        if (!validateCEPFormat(cepValue)) {
          const error = new Error(
            `CEP inválido no campo "${fieldName}". O CEP deve conter exatamente 8 dígitos.`,
          );
          error.extensions = { code: "INVALID_PAYLOAD" };
          throw error;
        }
      }
    }
  }
};
