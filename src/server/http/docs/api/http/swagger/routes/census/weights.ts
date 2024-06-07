import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "../../commons/status";


const TAGS = ["Weights"];

export const MANAGEMENT = {
    [`${BASE_URL.V1}/census/weights/basin`]: {
        get: {
            tags: TAGS,
            responses: {
                200: {
                    description: "Get recorded weights from basin or calculate if not exists",
                    content: {
                        "application/json": {
                            schema: {
                                example: {
                                    basin_ids: [1, 2],
                                    year: 2023
                                }
                            },
                        },
                    },
                },
                ...DEFAULT_RESPONSES,
            },
        },

    },
    [`${BASE_URL.V1}/census/weights/basin/calculated`]: {
        get: {
            tags: TAGS,
            security: [BEARER_AUTH],
            summary: "Get only calculated data",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ['basin_ids'],
                            properties: {
                                basin_ids: {
                                    type: 'array',
                                    items: {
                                        type: 'number',
                                    },
                                    description: 'An array of basin IDs'
                                },
                                area: {
                                    type: 'number',
                                    format: 'float',
                                    description: 'The area in square units'
                                },
                                users_registered_count: {
                                    type: 'number',
                                    format: 'int32',
                                    description: 'The count of registered users'
                                },
                                crops_names: {
                                    type: 'array',
                                    items: {
                                        type: 'string'
                                    },
                                    description: 'An array of names of crops'
                                }
                            },
                            example: {
                                basin_ids: [1, 2],
                                users_registered_count: 90,
                                area: 10.10,
                                crops_names: ["MILHO", "BANANA"]
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
                                example: {
                                    "data": [
                                        {
                                            basin_mask: 3,
                                            crop: "CAPIM",
                                            productivity_ha: 1,
                                            productivity_m3: 1,
                                            profitability_ha: 0.75,
                                            profitability_m3: 0.5,
                                            jobs_ha: 0.5,
                                            jobs_1000m3: 0.5,
                                            water_consumption: 0.5,
                                            crop_cycle: 1,
                                            year: null
                                        }
                                    ]
                                },
                            },
                        },
                    },
                },
                ...DEFAULT_RESPONSES,
            },
        },
    },
    [`${BASE_URL.V1}/census/weights/basin`]: {
        post: {
            tags: TAGS,
            security: [BEARER_AUTH],
            summary: "Create crop",
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                basin_ids: [1, 2],
                                year: 2023,
                                data: [
                                    {
                                        basin_mask: 3,
                                        crop: "CAPIM",
                                        productivity_ha: 1,
                                        productivity_m3: 1,
                                        profitability_ha: 0.75,
                                        profitability_m3: 0.5,
                                        jobs_ha: 0.5,
                                        jobs_1000m3: 0.5,
                                        water_consumption: 0.5,
                                        crop_cycle: 1,
                                        year: null
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
