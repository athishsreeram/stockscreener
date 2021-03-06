// To parse this data:
//
//   import { Convert } from "./file";
//
//   const quote = Convert.toQuote(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Quote {
    symbol:               string;
    name:                 string;
    price:                number;
    changesPercentage:    number;
    change:               number;
    dayLow:               number;
    dayHigh:              number;
    yearHigh:             number;
    yearLow:              number;
    marketCap:            number;
    priceAvg50:           number;
    priceAvg200:          number;
    volume:               number;
    avgVolume:            number;
    exhange:              string;
    open:                 number;
    previousClose:        number;
    eps:                  number;
    pe:                   number;
    earningsAnnouncement: string;
    sharesOutstanding:    number;
    timestamp:            number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toQuote(json: string): Quote[] {
        return cast(JSON.parse(json), a(r("Quote")));
    }

    public static quoteToJson(value: Quote[]): string {
        return JSON.stringify(uncast(value, a(r("Quote"))), null, 2);
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
    "Quote": o([
        { json: "symbol", js: "symbol", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "price", js: "price", typ: 3.14 },
        { json: "changesPercentage", js: "changesPercentage", typ: 3.14 },
        { json: "change", js: "change", typ: 3.14 },
        { json: "dayLow", js: "dayLow", typ: 3.14 },
        { json: "dayHigh", js: "dayHigh", typ: 3.14 },
        { json: "yearHigh", js: "yearHigh", typ: 3.14 },
        { json: "yearLow", js: "yearLow", typ: 3.14 },
        { json: "marketCap", js: "marketCap", typ: 3.14 },
        { json: "priceAvg50", js: "priceAvg50", typ: 3.14 },
        { json: "priceAvg200", js: "priceAvg200", typ: 3.14 },
        { json: "volume", js: "volume", typ: 0 },
        { json: "avgVolume", js: "avgVolume", typ: 0 },
        { json: "exhange", js: "exhange", typ: "" },
        { json: "open", js: "open", typ: 3.14 },
        { json: "previousClose", js: "previousClose", typ: 3.14 },
        { json: "eps", js: "eps", typ: 3.14 },
        { json: "pe", js: "pe", typ: 3.14 },
        { json: "earningsAnnouncement", js: "earningsAnnouncement", typ: "" },
        { json: "sharesOutstanding", js: "sharesOutstanding", typ: 0 },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
};
