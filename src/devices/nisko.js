const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const modernExtend = require('zigbee-herdsman-converters/lib/modernExtend');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require('zigbee-herdsman-converters/lib/tuya');

const definition = {
    // Since a lot of Tuya devices use the same modelID, but use different datapoints
    // it's necessary to provide a fingerprint instead of a zigbeeModel
    fingerprint: [
        {
            modelID: 'TS0601',
            manufacturerName: '_TZE204_apiu8k13',
        },
    ],
    model: '7290117684375',
    vendor: 'Nisko smart',
    description: 'Smart water heater controller',
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tuya.tz.datapoints],
    onEvent: tuya.onEventSetTime, // Add this if you are getting no converter for 'commandMcuSyncTime'
    configure: tuya.configureMagicPacket,
    exposes: [
        e.switch().setAccess('state', ea.STATE_SET),
        e.current(),
        e.power(),
        e.voltage(),
        // tuya.exposes.countdown().withValueMin(0).withValueMax(120).withValueStep(15).withUnit('m').withAccess(ea.STATE)
        tuya.exposes.countdown().withValueMin(0).withValueMax(120).withValueStep(15).withUnit('m').withAccess(ea.STATE_SET)
        // e.numeric('countdown', exposes.access.ALL).withDescription('Countdown timer for the water heater').withUnit('minute').withValueMin(0).withValueMax(120),
    ],
    meta: {
        // All datapoints go in here
        tuyaDatapoints: [
            [1, 'state', tuya.valueConverter.onOff],
            [21, 'current', tuya.valueConverter.divideBy1000],
            [22, 'power', tuya.valueConverter.raw],
            [23, 'voltage', tuya.valueConverter.raw],
            [7, 'countdown', tuya.valueConverter.countdown],
            ],
    },
    extend: [
        // A preferred new way of extending functionality.
    ],
};

module.exports = definition;
