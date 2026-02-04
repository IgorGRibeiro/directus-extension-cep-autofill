import InterfaceComponent from "./interface.vue";

export default {
  id: "cep-autofill",
  name: "Entrada de CEP com Autopreenchimento",
  icon: "place",
  description:
    "Campo de entrada de CEP com máscara e preenchimento automático de endereço via API ViaCEP",
  component: InterfaceComponent,
  options: ({ collection }) => [
    {
      field: "placeholder",
      name: "Placeholder",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "00000-000",
        },
      },
      schema: {
        default_value: "00000-000",
      },
    },
    {
      field: "autofillEnabled",
      name: "Ativar Autopreenchimento",
      type: "boolean",
      meta: {
        width: "half",
        interface: "boolean",
        options: {
          label: "Buscar endereço automaticamente",
        },
      },
      schema: {
        default_value: true,
      },
    },
    {
      field: "streetField",
      name: "Campo de Logradouro",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Nome do campo (ex: street, logradouro)",
          trim: true,
        },
        note: "Digite o nome do campo que armazena o logradouro/rua",
      },
    },
    {
      field: "neighborhoodField",
      name: "Campo de Bairro",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Nome do campo (ex: neighborhood, bairro)",
          trim: true,
        },
        note: "Digite o nome do campo que armazena o bairro",
      },
    },
    {
      field: "cityField",
      name: "Campo de Cidade",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Nome do campo (ex: city, cidade)",
          trim: true,
        },
        note: "Digite o nome do campo que armazena a cidade",
      },
    },
    {
      field: "stateField",
      name: "Campo de Estado",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Nome do campo (ex: state, uf)",
          trim: true,
        },
        note: "Digite o nome do campo que armazena o estado/UF",
      },
    },
    {
      field: "complementField",
      name: "Campo de Complemento",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Nome do campo (ex: complement, complemento)",
          trim: true,
        },
        note: "Digite o nome do campo que armazena o complemento",
      },
    },
    {
      field: "overwriteExisting",
      name: "Sobrescrever Campos Preenchidos",
      type: "boolean",
      meta: {
        width: "half",
        interface: "boolean",
        options: {
          label: "Substituir valores existentes ao buscar CEP",
        },
      },
      schema: {
        default_value: false,
      },
    },
  ],
  types: ["string"],
};
