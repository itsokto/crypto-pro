const { cpSync } = require('fs');

cpSync("../../dist", "./public/dist", { recursive: true });
