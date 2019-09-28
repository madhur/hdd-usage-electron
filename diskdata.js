const si = require("systeminformation");

const getFsData = cb => {
    si.fsSize().then(data => {
        cb(data);
    });
};

const getBlockData = cb => {
    si.blockDevices().then(data => {
        cb(data);
    });
};

module.exports = { getFsData, getBlockData };
