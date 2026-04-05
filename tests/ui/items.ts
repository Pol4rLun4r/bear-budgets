const markupList = [
    '(40%) Visolight',
    '(50%) Visolight Plus',
    '(25%) Fabricante',
    '(40%) Revenda ICMS 12%',
    '(35%) Revenda ICMS 7%',
    '(30%) Revenda ICMS 4%',
    '(00%) Zero',
    '(40%) Rockwell / Allen',
    '(45%) Mercado livre fora de sp',
    '(40%) Mercado livre dentro de sp',
    '(35%) Telbra'
];

type note = {
    type: "text" | "link",
    content: string,
}

type item = {
    item_basic_data: {
        description: string,
        internal_code: string,
        manufacturer_code: string,
        ncm: string,
    },
    notes: note[],
    values: {
        unit_price: number,
        quantity: number,
        ipi: number,
        st: number,
        markup: string,
        purchase_shipping: number,
    },
    
}

export const items: item[] = [
    {
        item_basic_data: {
            description: "Parafuso sextavado M8 x 50mm",
            internal_code: "PAR-M8-50",
            manufacturer_code: "ISO-4014-M8",
            ncm: "7318.15.10",
        },
        notes: [
            {
                type: "text",
                content: "Fornecedor: PARAFUSARIA XYZ",
            },
        ],
        values: {
            unit_price: 2.5,
            quantity: 100,
            ipi: 0,
            st: 0,
            markup: markupList[1],
            purchase_shipping: 25.0,
        },
    },
    {
        item_basic_data: {
            description: "Porca sextavada M8",
            internal_code: "POR-M8",
            manufacturer_code: "ISO-4032-M8",
            ncm: "7318.16.00",
        },
        notes: [
            {
                type: "link",
                content: "https://example.com/porca-m8",
            },
        ],
        values: {
            unit_price: 1.2,
            quantity: 200,
            ipi: 0,
            st: 0,
            markup: markupList[2],
            purchase_shipping: 15.0,
        },
    },
    {
        item_basic_data: {
            description: "Tubo PVC 25mm DN25",
            internal_code: "TUB-PVC-25",
            manufacturer_code: "PVC-TUBO-DN25",
            ncm: "3917.23.00",
        },
        notes: [
            {
                type: "text",
                content: "Comprimento: 6 metros por peça",
            },
        ],
        values: {
            unit_price: 8.5,
            quantity: 50,
            ipi: 0,
            st: 7.0,
            markup: markupList[3],
            purchase_shipping: 120.0,
        },
    },
    {
        item_basic_data: {
            description: "Fita de vedação PTFE 12mm x 100m",
            internal_code: "FIT-PTFE-12",
            manufacturer_code: "PTFE-TAPE-100",
            ncm: "5911.90.00",
        },
        notes: [
            {
                type: "text",
                content: "Não inflamável. Resistente a temperaturas até 260°C",
            },
        ],
        values: {
            unit_price: 12.0,
            quantity: 30,
            ipi: 0,
            st: 0,
            markup: markupList[4],
            purchase_shipping: 0,
        },
    },
    {
        item_basic_data: {
            description: "Arruela de pressão M8",
            internal_code: "ARR-PRES-M8",
            manufacturer_code: "ISO-6891-M8",
            ncm: "7318.20.00",
        },
        notes: [
            {
                type: "text",
                content: "Aço galvanizado. Acabamento brilhante",
            },
        ],
        values: {
            unit_price: 0.8,
            quantity: 500,
            ipi: 0,
            st: 0,
            markup: markupList[5],
            purchase_shipping: 10.0,
        },
    },
    {
        item_basic_data: {
            description: "Cabo de cobre 10mm² 100m",
            internal_code: "CAB-CU-10",
            manufacturer_code: "IEC-60228-10",
            ncm: "8544.30.00",
        },
        notes: [
            {
                type: "text",
                content: "Isolação em PVC. Temperatura máxima 70°C",
            },
        ],
        values: {
            unit_price: 45.5,
            quantity: 20,
            ipi: 0,
            st: 0,
            markup: markupList[6],
            purchase_shipping: 50.0,
        },
    },
    {
        item_basic_data: {
            description: "Disjuntor termomagnético 20A",
            internal_code: "DIS-20A",
            manufacturer_code: "NBR-60898-20",
            ncm: "8536.30.00",
        },
        notes: [
            {
                type: "link",
                content: "https://www.exemplo.com/disjuntor-20a",
            },
        ],
        values: {
            unit_price: 35.0,
            quantity: 40,
            ipi: 0,
            st: 0,
            markup: markupList[7],
            purchase_shipping: 30.0,
        },
    },
    {
        item_basic_data: {
            description: "Lâmpada LED 10W branca fria",
            internal_code: "LAM-LED-10",
            manufacturer_code: "LED-BR-6500K",
            ncm: "8539.22.00",
        },
        notes: [
            {
                type: "text",
                content: "Ciclos de vida: 25000 horas. 800 lúmens",
            },
        ],
        values: {
            unit_price: 8.5,
            quantity: 150,
            ipi: 0,
            st: 0,
            markup: markupList[8],
            purchase_shipping: 22.0,
        },
    },
    {
        item_basic_data: {
            description: "Conector tipo RJ45 CAT6",
            internal_code: "CON-RJ45-6",
            manufacturer_code: "RJ45-CAT6-8P",
            ncm: "8536.61.00",
        },
        notes: [
            {
                type: "text",
                content: "Blindado. Compatível com CAT5e e CAT6a",
            },
        ],
        values: {
            unit_price: 2.2,
            quantity: 500,
            ipi: 0,
            st: 0,
            markup: markupList[9],
            purchase_shipping: 15.0,
        },
    },
    {
        item_basic_data: {
            description: "Transformador 500VA 110/220V",
            internal_code: "TRANS-500",
            manufacturer_code: "TR-500VA-STD",
            ncm: "8504.40.00",
        },
        notes: [
            {
                type: "link",
                content: "https://exemplo.com/transformador-500",
            },
        ],
        values: {
            unit_price: 125.0,
            quantity: 10,
            ipi: 15.0,
            st: 0,
            markup: markupList[10],
            purchase_shipping: 80.0,
        },
    },
    {
        item_basic_data: {
            description: "Ventilador axial 200mm",
            internal_code: "VENT-200AX",
            manufacturer_code: "FAN-200-AC",
            ncm: "8414.51.00",
        },
        notes: [
            {
                type: "text",
                content: "Tensão: 220V. Rpm: 1100. Ruído: 35dB",
            },
        ],
        values: {
            unit_price: 55.0,
            quantity: 25,
            ipi: 0,
            st: 0,
            markup: markupList[0],
            purchase_shipping: 40.0,
        },
    },
    {
        item_basic_data: {
            description: "Buzzer piezoelétrico 12V",
            internal_code: "BUZ-12V",
            manufacturer_code: "PIEZO-12DC",
            ncm: "8531.20.00",
        },
        notes: [
            {
                type: "text",
                content: "Frequência: 2.5kHz. Nível sonoro: 88dB",
            },
        ],
        values: {
            unit_price: 3.5,
            quantity: 300,
            ipi: 0,
            st: 0,
            markup: markupList[1],
            purchase_shipping: 20.0,
        },
    },
    {
        item_basic_data: {
            description: "Relé eletromecânico 24VDC",
            internal_code: "REL-24DC",
            manufacturer_code: "RLY-24VDC-8P",
            ncm: "8536.50.00",
        },
        notes: [
            {
                type: "link",
                content: "https://datasheet.exemplo.com/rele-24",
            },
        ],
        values: {
            unit_price: 18.0,
            quantity: 80,
            ipi: 0,
            st: 0,
            markup: markupList[2],
            purchase_shipping: 25.0,
        },
    },
    {
        item_basic_data: {
            description: "Capacitor eletrolítico 100µF 450V",
            internal_code: "CAP-100U-450",
            manufacturer_code: "ECAP-100MF450",
            ncm: "8532.24.00",
        },
        notes: [
            {
                type: "text",
                content: "Temperatura: -40°C a 105°C. Tolerância ±20%",
            },
        ],
        values: {
            unit_price: 4.8,
            quantity: 200,
            ipi: 0,
            st: 0,
            markup: markupList[3],
            purchase_shipping: 12.0,
        },
    },
    {
        item_basic_data: {
            description: "Resistor 10kΩ 1/4W 5%",
            internal_code: "RES-10K-1W4",
            manufacturer_code: "RES-1Q-10K",
            ncm: "8533.21.00",
        },
        notes: [
            {
                type: "text",
                content: "Filme de carbono. Potência: 0.25W",
            },
        ],
        values: {
            unit_price: 0.15,
            quantity: 5000,
            ipi: 0,
            st: 0,
            markup: markupList[4],
            purchase_shipping: 8.0,
        },
    },
    {
        item_basic_data: {
            description: "Módulo sensor de temperatura LM35",
            internal_code: "SENS-TEMP-LM35",
            manufacturer_code: "LM35-SENSOR",
            ncm: "9030.83.00",
        },
        notes: [
            {
                type: "link",
                content: "https://exemplo.com/datasheet-lm35",
            },
        ],
        values: {
            unit_price: 12.5,
            quantity: 60,
            ipi: 0,
            st: 0,
            markup: markupList[5],
            purchase_shipping: 18.0,
        },
    },
]