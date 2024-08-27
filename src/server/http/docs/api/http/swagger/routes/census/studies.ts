import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "../../commons/status";


const TAGS = ["Studies"];

export const STUDIES = {
    [`${BASE_URL.V2}/census/studies/basin/{id}`]: {
        get: {
            tags: TAGS,
            security: [BEARER_AUTH],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "basin id",
                    required: true,
                    schema: {
                        type: "number",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Get crops studies by basin",
                    content: {
                        "application/json": {
                            schema: {
                                example: {
                                    "data": {
                                        ACEROLA: {
                                            id_basin: 2,
                                            harvest_duration_in_months: 12,
                                            cultivation_period_in_days: null,
                                            consumption: 14280,
                                            productivity: 7000,
                                            year: 2023
                                        },
                                        BATATA: {
                                            id_basin: 2,
                                            harvest_duration_in_months: 12,
                                            cultivation_period_in_days: null,
                                            consumption: 11000,
                                            productivity: 10000,
                                            year: 2023
                                        },
                                    }
                                },
                            },
                        },
                    },
                },
                ...DEFAULT_RESPONSES,
            },
        },
        post: {
            tags: TAGS,
            security: [BEARER_AUTH],
            summary: "Create crop",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "basin id",
                    required: true,
                    schema: {
                        type: "number",
                    },
                },
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                data: [
                                    {
                                        crop: "TESTÃO",
                                        harvest_duration_in_months: 5,
                                        cultivation_period_in_days: 5,
                                        consumption: 5,
                                        productivity: 5,
                                        year: 5
                                    }
                                ]
                            }
                        },
                    },
                },
            },
            responses: {
                200: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                items: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "string",
                                        },
                                    },
                                },
                                example: {
                                    data: "Sucesso ao inserir estudos da bacia.",
                                },
                            },
                        },
                    },
                },
                ...DEFAULT_RESPONSES,
            },
        },
    }
};
