// To parse this data:
//
//   import { Convert, Income } from "./file";
//
//   const income = Convert.toIncome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Income {
    symbol:     string;
    financials: Financial[];
}

export interface Financial {
    date:                               Date;
    Revenue:                            string;
    "Revenue Growth":                   string;
    "Cost of Revenue":                  string;
    "Gross Profit":                     string;
    "R&D Expenses":                     string;
    "SG&A Expense":                     string;
    "Operating Expenses":               string;
    "Operating Income":                 string;
    "Interest Expense":                 string;
    "Earnings before Tax":              string;
    "Income Tax Expense":               string;
    "Net Income - Non-Controlling int": string;
    "Net Income - Discontinued ops":    string;
    "Net Income":                       string;
    "Preferred Dividends":              string;
    "Net Income Com":                   string;
    EPS:                                string;
    "EPS Diluted":                      string;
    "Weighted Average Shs Out":         string;
    "Weighted Average Shs Out (Dil)":   string;
    "Dividend per Share":               string;
    "Gross Margin":                     string;
    "EBITDA Margin":                    string;
    "EBIT Margin":                      string;
    "Profit Margin":                    string;
    "Free Cash Flow margin":            string;
    EBITDA:                             string;
    EBIT:                               string;
    "Consolidated Income":              string;
    "Earnings Before Tax Margin":       string;
    "Net Profit Margin":                string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toIncome(json: string): Income {
        return cast(JSON.parse(json), r("Income"));
    }

    public static incomeToJson(value: Income): string {
        return JSON.stringify(uncast(value, r("Income")), null, 2);
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
    "Income": o([
        { json: "symbol", js: "symbol", typ: "" },
        { json: "financials", js: "financials", typ: a(r("Financial")) },
    ], false),
    "Financial": o([
        { json: "date", js: "date", typ: Date },
        { json: "Revenue", js: "Revenue", typ: "" },
        { json: "Revenue Growth", js: "Revenue Growth", typ: "" },
        { json: "Cost of Revenue", js: "Cost of Revenue", typ: "" },
        { json: "Gross Profit", js: "Gross Profit", typ: "" },
        { json: "R&D Expenses", js: "R&D Expenses", typ: "" },
        { json: "SG&A Expense", js: "SG&A Expense", typ: "" },
        { json: "Operating Expenses", js: "Operating Expenses", typ: "" },
        { json: "Operating Income", js: "Operating Income", typ: "" },
        { json: "Interest Expense", js: "Interest Expense", typ: "" },
        { json: "Earnings before Tax", js: "Earnings before Tax", typ: "" },
        { json: "Income Tax Expense", js: "Income Tax Expense", typ: "" },
        { json: "Net Income - Non-Controlling int", js: "Net Income - Non-Controlling int", typ: "" },
        { json: "Net Income - Discontinued ops", js: "Net Income - Discontinued ops", typ: "" },
        { json: "Net Income", js: "Net Income", typ: "" },
        { json: "Preferred Dividends", js: "Preferred Dividends", typ: "" },
        { json: "Net Income Com", js: "Net Income Com", typ: "" },
        { json: "EPS", js: "EPS", typ: "" },
        { json: "EPS Diluted", js: "EPS Diluted", typ: "" },
        { json: "Weighted Average Shs Out", js: "Weighted Average Shs Out", typ: "" },
        { json: "Weighted Average Shs Out (Dil)", js: "Weighted Average Shs Out (Dil)", typ: "" },
        { json: "Dividend per Share", js: "Dividend per Share", typ: "" },
        { json: "Gross Margin", js: "Gross Margin", typ: "" },
        { json: "EBITDA Margin", js: "EBITDA Margin", typ: "" },
        { json: "EBIT Margin", js: "EBIT Margin", typ: "" },
        { json: "Profit Margin", js: "Profit Margin", typ: "" },
        { json: "Free Cash Flow margin", js: "Free Cash Flow margin", typ: "" },
        { json: "EBITDA", js: "EBITDA", typ: "" },
        { json: "EBIT", js: "EBIT", typ: "" },
        { json: "Consolidated Income", js: "Consolidated Income", typ: "" },
        { json: "Earnings Before Tax Margin", js: "Earnings Before Tax Margin", typ: "" },
        { json: "Net Profit Margin", js: "Net Profit Margin", typ: "" },
    ], false),
};
