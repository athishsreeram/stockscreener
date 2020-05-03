// To parse this data:
//
//   import { Convert, Fsg } from "./file";
//
//   const fsg = Convert.toFsg(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Fsg {
    symbol: string;
    growth: Growth[];
}

export interface Growth {
    date:                                         Date;
    "Gross Profit Growth":                        string;
    "EBIT Growth":                                string;
    "Operating Income Growth":                    string;
    "Net Income Growth":                          string;
    "EPS Growth":                                 string;
    "EPS Diluted Growth":                         string;
    "Weighted Average Shares Growth":             string;
    "Weighted Average Shares Diluted Growth":     string;
    "Dividends per Share Growth":                 string;
    "Operating Cash Flow growth":                 string;
    "Free Cash Flow growth":                      string;
    "10Y Revenue Growth (per Share)":             string;
    "5Y Revenue Growth (per Share)":              string;
    "3Y Revenue Growth (per Share)":              string;
    "10Y Operating CF Growth (per Share)":        string;
    "5Y Operating CF Growth (per Share)":         string;
    "3Y Operating CF Growth (per Share)":         string;
    "10Y Net Income Growth (per Share)":          string;
    "5Y Net Income Growth (per Share)":           string;
    "3Y Net Income Growth (per Share)":           string;
    "10Y Shareholders Equity Growth (per Share)": string;
    "5Y Shareholders Equity Growth (per Share)":  string;
    "3Y Shareholders Equity Growth (per Share)":  string;
    "10Y Dividend per Share Growth (per Share)":  string;
    "5Y Dividend per Share Growth (per Share)":   string;
    "3Y Dividend per Share Growth (per Share)":   string;
    "Receivables growth":                         string;
    "Inventory Growth":                           string;
    "Asset Growth":                               string;
    "Book Value per Share Growth":                string;
    "Debt Growth":                                string;
    "R&D Expense Growth":                         string;
    "SG&A Expenses Growth":                       string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toFsg(json: string): Fsg {
        return cast(JSON.parse(json), r("Fsg"));
    }

    public static fsgToJson(value: Fsg): string {
        return JSON.stringify(uncast(value, r("Fsg")), null, 2);
    }
}

function invalidValue(typ: any, val: any): never {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(typ: any, val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(typ, val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Fsg": o([
        { json: "symbol", js: "symbol", typ: "" },
        { json: "growth", js: "growth", typ: a(r("Growth")) },
    ], false),
    "Growth": o([
        { json: "date", js: "date", typ: Date },
        { json: "Gross Profit Growth", js: "Gross Profit Growth", typ: "" },
        { json: "EBIT Growth", js: "EBIT Growth", typ: "" },
        { json: "Operating Income Growth", js: "Operating Income Growth", typ: "" },
        { json: "Net Income Growth", js: "Net Income Growth", typ: "" },
        { json: "EPS Growth", js: "EPS Growth", typ: "" },
        { json: "EPS Diluted Growth", js: "EPS Diluted Growth", typ: "" },
        { json: "Weighted Average Shares Growth", js: "Weighted Average Shares Growth", typ: "" },
        { json: "Weighted Average Shares Diluted Growth", js: "Weighted Average Shares Diluted Growth", typ: "" },
        { json: "Dividends per Share Growth", js: "Dividends per Share Growth", typ: "" },
        { json: "Operating Cash Flow growth", js: "Operating Cash Flow growth", typ: "" },
        { json: "Free Cash Flow growth", js: "Free Cash Flow growth", typ: "" },
        { json: "10Y Revenue Growth (per Share)", js: "10Y Revenue Growth (per Share)", typ: "" },
        { json: "5Y Revenue Growth (per Share)", js: "5Y Revenue Growth (per Share)", typ: "" },
        { json: "3Y Revenue Growth (per Share)", js: "3Y Revenue Growth (per Share)", typ: "" },
        { json: "10Y Operating CF Growth (per Share)", js: "10Y Operating CF Growth (per Share)", typ: "" },
        { json: "5Y Operating CF Growth (per Share)", js: "5Y Operating CF Growth (per Share)", typ: "" },
        { json: "3Y Operating CF Growth (per Share)", js: "3Y Operating CF Growth (per Share)", typ: "" },
        { json: "10Y Net Income Growth (per Share)", js: "10Y Net Income Growth (per Share)", typ: "" },
        { json: "5Y Net Income Growth (per Share)", js: "5Y Net Income Growth (per Share)", typ: "" },
        { json: "3Y Net Income Growth (per Share)", js: "3Y Net Income Growth (per Share)", typ: "" },
        { json: "10Y Shareholders Equity Growth (per Share)", js: "10Y Shareholders Equity Growth (per Share)", typ: "" },
        { json: "5Y Shareholders Equity Growth (per Share)", js: "5Y Shareholders Equity Growth (per Share)", typ: "" },
        { json: "3Y Shareholders Equity Growth (per Share)", js: "3Y Shareholders Equity Growth (per Share)", typ: "" },
        { json: "10Y Dividend per Share Growth (per Share)", js: "10Y Dividend per Share Growth (per Share)", typ: "" },
        { json: "5Y Dividend per Share Growth (per Share)", js: "5Y Dividend per Share Growth (per Share)", typ: "" },
        { json: "3Y Dividend per Share Growth (per Share)", js: "3Y Dividend per Share Growth (per Share)", typ: "" },
        { json: "Receivables growth", js: "Receivables growth", typ: "" },
        { json: "Inventory Growth", js: "Inventory Growth", typ: "" },
        { json: "Asset Growth", js: "Asset Growth", typ: "" },
        { json: "Book Value per Share Growth", js: "Book Value per Share Growth", typ: "" },
        { json: "Debt Growth", js: "Debt Growth", typ: "" },
        { json: "R&D Expense Growth", js: "R&D Expense Growth", typ: "" },
        { json: "SG&A Expenses Growth", js: "SG&A Expenses Growth", typ: "" },
    ], false),
};
