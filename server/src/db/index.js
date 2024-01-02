"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const variables_1 = require("#/utils/variables");
mongoose_1.default
    .connect(variables_1.MONGO_URL)
    .then(() => {
    console.log("db is connected");
})
    .catch((err) => {
    console.error("failed to connect db", err);
});
