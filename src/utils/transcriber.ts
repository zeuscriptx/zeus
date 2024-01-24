import { readFileSync } from "fs";
import axios from 'axios';
const geoip = require('geoip-lite');

// fuck off typescript
declare global {
    interface String {
        replace_fr(target: string, replacement: string): string;
    }
}

interface Currency {
    code: string;
    currency: {
        symbol: string,
    };
    language: {
        code: string,
    };
}

String.prototype.replace_fr = function (target: string, replacement: string): string {
    const pattern = new RegExp(`\\b${target}\\b(?=(?:(?:[^"]*"){2})*[^"]*$)`, 'g');
    
    return this.replace(pattern, replacement);
}

const currencies = JSON.parse(readFileSync('./src/utils/currencies.json', 'utf-8'))

async function get_currency() {
    const { country } = await get_country();
    const currency = currencies.find((el: Currency) => el.code === country)

    return currency.currency.symbol;
}

async function get_country() {
    const response = await axios.get('https://api64.ipify.org?format=json');
    const ip = response.data.ip;
    const geo = await geoip.lookup(ip);

    return geo;
}

export async function transcribe(code: string) {
    const currency = await get_currency();

    return code
        .replace_fr("nicht ", '!')
        .replace_fr("rn", ';')
        .replace_fr("ist ", '=')
        .replace_fr("lass", 'let')
        .replace_fr("konstante", 'const')
        .replace_fr("print", 'println')
        .replace_fr("wenn", 'if')
        .replace_fr("nichts", 'null')
        .replace_fr("sonst", 'else')
        .replace_fr("ungleich", '!=')
        .replace_fr("vergleichen mit", '==')
        .replace_fr("und", '&&')
        .replace_fr("oder", '|')
        .replace_fr("methode", 'fn')
        .replace_fr("rechne", 'math')
        .replace_fr("für", 'for')
        .replace_fr("kleiner als", '<')
        .replace_fr("größer als", '>')
        .replace_fr("wahr", 'true')
        .replace_fr("falsch", 'false')
        .replace_fr("verscuhe", 'try')
        .replace_fr("rette", 'catch')
        .replace_fr("ausführen", 'exec')
        .replace_fr("name", 'input')
        .replace_fr("minus", "-")
        .replace_fr("plus", "+")
        .replace_fr("minusminus", "--")
        .replace_fr("plusplus", "++")
        .replace_fr("mal", "*")
        .replace_fr("geteilt durch", "/")
        .replace(/\: number/g, '')
        .replace(/\: string/g, '')
        .replace(/\: object/g, '')
        .replace(/\: boolean/g, '')
        .replace(new RegExp(`${currency}{}`), '${}')
}
