// To parse this data:
//
//   import { Convert, Finratio } from "./file";
//
//   const finratio = Convert.toFinratio(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Finratio {
    symbol: string;
    ratios: Ratio[];
}

export interface Ratio {
    date:                         Date;
    investmentValuationRatios:    InvestmentValuationRatios;
    profitabilityIndicatorRatios: ProfitabilityIndicatorRatios;
    operatingPerformanceRatios:   OperatingPerformanceRatios;
    liquidityMeasurementRatios:   LiquidityMeasurementRatios;
    debtRatios:                   DebtRatios;
    cashFlowIndicatorRatios:      CashFlowIndicatorRatios;
}

export interface CashFlowIndicatorRatios {
    date:                            Date;
    operatingCashFlowPerShare:          string;
    freeCashFlowPerShare:               string;
    cashPerShare:                       string;
    payoutRatio:                        string;
    receivablesTurnover:                string;
    operatingCashFlowSalesRatio:        string;
    freeCashFlowOperatingCashFlowRatio: string;
    cashFlowCoverageRatios:             string;
    shortTermCoverageRatios:            string;
    capitalExpenditureCoverageRatios:   string;
    dividendpaidAndCapexCoverageRatios: string;
    dividendPayoutRatio:                string;
}

export interface DebtRatios {
    date:                            Date;
    debtRatio:                    string;
    debtEquityRatio:              string;
    longtermDebtToCapitalization: string;
    totalDebtToCapitalization:    string;
    interestCoverage:             string;
    cashFlowToDebtRatio:          string;
    companyEquityMultiplier:      string;
}

export interface InvestmentValuationRatios {
    date:                            Date;
    priceBookValueRatio:            string;
    priceToBookRatio:               string;
    priceToSalesRatio:              string;
    priceEarningsRatio:             string;
    receivablesTurnover:            string;
    priceToFreeCashFlowsRatio:      string;
    priceToOperatingCashFlowsRatio: string;
    priceCashFlowRatio:             string;
    priceEarningsToGrowthRatio:     string;
    priceSalesRatio:                string;
    dividendYield:                  string;
    enterpriseValueMultiple:        string;
    priceFairValue:                 string;
}

export interface LiquidityMeasurementRatios {
    date:                            Date;
    currentRatio:               string;
    quickRatio:                 string;
    cashRatio:                  string;
    daysOfSalesOutstanding:     string;
    daysOfInventoryOutstanding: string;
    operatingCycle:             string;
    daysOfPayablesOutstanding:  string;
    cashConversionCycle:        string;
}

export interface OperatingPerformanceRatios {
    date:                            Date;
    receivablesTurnover: string;
    payablesTurnover:    string;
    inventoryTurnover:   string;
    fixedAssetTurnover:  string;
    assetTurnover:       string;
}

export interface ProfitabilityIndicatorRatios {
    date:                            Date;
    ebitperRevenue:          string;
    niperEBT:                string;
    ebtperEBIT:              string;
    grossProfitMargin:       string;
    operatingProfitMargin:   string;
    pretaxProfitMargin:      string;
    netProfitMargin:         string;
    effectiveTaxRate:        string;
    returnOnAssets:          string;
    returnOnEquity:          string;
    returnOnCapitalEmployed: string;
    nIperEBT:                string;
    eBTperEBIT:              string;
    eBITperRevenue:          string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toFinratio(json: string): Finratio {
        return cast(JSON.parse(json), r("Finratio"));
    }

    public static finratioToJson(value: Finratio): string {
        return JSON.stringify(uncast(value, r("Finratio")), null, 2);
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
    "Finratio": o([
        { json: "symbol", js: "symbol", typ: "" },
        { json: "ratios", js: "ratios", typ: a(r("Ratio")) },
    ], false),
    "Ratio": o([
        { json: "date", js: "date", typ: Date },
        { json: "investmentValuationRatios", js: "investmentValuationRatios", typ: r("InvestmentValuationRatios") },
        { json: "profitabilityIndicatorRatios", js: "profitabilityIndicatorRatios", typ: r("ProfitabilityIndicatorRatios") },
        { json: "operatingPerformanceRatios", js: "operatingPerformanceRatios", typ: r("OperatingPerformanceRatios") },
        { json: "liquidityMeasurementRatios", js: "liquidityMeasurementRatios", typ: r("LiquidityMeasurementRatios") },
        { json: "debtRatios", js: "debtRatios", typ: r("DebtRatios") },
        { json: "cashFlowIndicatorRatios", js: "cashFlowIndicatorRatios", typ: r("CashFlowIndicatorRatios") },
    ], false),
    "CashFlowIndicatorRatios": o([
        { json: "operatingCashFlowPerShare", js: "operatingCashFlowPerShare", typ: "" },
        { json: "freeCashFlowPerShare", js: "freeCashFlowPerShare", typ: "" },
        { json: "cashPerShare", js: "cashPerShare", typ: "" },
        { json: "payoutRatio", js: "payoutRatio", typ: "" },
        { json: "receivablesTurnover", js: "receivablesTurnover", typ: "" },
        { json: "operatingCashFlowSalesRatio", js: "operatingCashFlowSalesRatio", typ: "" },
        { json: "freeCashFlowOperatingCashFlowRatio", js: "freeCashFlowOperatingCashFlowRatio", typ: "" },
        { json: "cashFlowCoverageRatios", js: "cashFlowCoverageRatios", typ: "" },
        { json: "shortTermCoverageRatios", js: "shortTermCoverageRatios", typ: "" },
        { json: "capitalExpenditureCoverageRatios", js: "capitalExpenditureCoverageRatios", typ: "" },
        { json: "dividendpaidAndCapexCoverageRatios", js: "dividendpaidAndCapexCoverageRatios", typ: "" },
        { json: "dividendPayoutRatio", js: "dividendPayoutRatio", typ: "" },
    ], false),
    "DebtRatios": o([
        { json: "debtRatio", js: "debtRatio", typ: "" },
        { json: "debtEquityRatio", js: "debtEquityRatio", typ: "" },
        { json: "longtermDebtToCapitalization", js: "longtermDebtToCapitalization", typ: "" },
        { json: "totalDebtToCapitalization", js: "totalDebtToCapitalization", typ: "" },
        { json: "interestCoverage", js: "interestCoverage", typ: "" },
        { json: "cashFlowToDebtRatio", js: "cashFlowToDebtRatio", typ: "" },
        { json: "companyEquityMultiplier", js: "companyEquityMultiplier", typ: "" },
    ], false),
    "InvestmentValuationRatios": o([
        { json: "priceBookValueRatio", js: "priceBookValueRatio", typ: "" },
        { json: "priceToBookRatio", js: "priceToBookRatio", typ: "" },
        { json: "priceToSalesRatio", js: "priceToSalesRatio", typ: "" },
        { json: "priceEarningsRatio", js: "priceEarningsRatio", typ: "" },
        { json: "receivablesTurnover", js: "receivablesTurnover", typ: "" },
        { json: "priceToFreeCashFlowsRatio", js: "priceToFreeCashFlowsRatio", typ: "" },
        { json: "priceToOperatingCashFlowsRatio", js: "priceToOperatingCashFlowsRatio", typ: "" },
        { json: "priceCashFlowRatio", js: "priceCashFlowRatio", typ: "" },
        { json: "priceEarningsToGrowthRatio", js: "priceEarningsToGrowthRatio", typ: "" },
        { json: "priceSalesRatio", js: "priceSalesRatio", typ: "" },
        { json: "dividendYield", js: "dividendYield", typ: "" },
        { json: "enterpriseValueMultiple", js: "enterpriseValueMultiple", typ: "" },
        { json: "priceFairValue", js: "priceFairValue", typ: "" },
    ], false),
    "LiquidityMeasurementRatios": o([
        { json: "currentRatio", js: "currentRatio", typ: "" },
        { json: "quickRatio", js: "quickRatio", typ: "" },
        { json: "cashRatio", js: "cashRatio", typ: "" },
        { json: "daysOfSalesOutstanding", js: "daysOfSalesOutstanding", typ: "" },
        { json: "daysOfInventoryOutstanding", js: "daysOfInventoryOutstanding", typ: "" },
        { json: "operatingCycle", js: "operatingCycle", typ: "" },
        { json: "daysOfPayablesOutstanding", js: "daysOfPayablesOutstanding", typ: "" },
        { json: "cashConversionCycle", js: "cashConversionCycle", typ: "" },
    ], false),
    "OperatingPerformanceRatios": o([
        { json: "receivablesTurnover", js: "receivablesTurnover", typ: "" },
        { json: "payablesTurnover", js: "payablesTurnover", typ: "" },
        { json: "inventoryTurnover", js: "inventoryTurnover", typ: "" },
        { json: "fixedAssetTurnover", js: "fixedAssetTurnover", typ: "" },
        { json: "assetTurnover", js: "assetTurnover", typ: "" },
    ], false),
    "ProfitabilityIndicatorRatios": o([
        { json: "ebitperRevenue", js: "ebitperRevenue", typ: "" },
        { json: "niperEBT", js: "niperEBT", typ: "" },
        { json: "ebtperEBIT", js: "ebtperEBIT", typ: "" },
        { json: "grossProfitMargin", js: "grossProfitMargin", typ: "" },
        { json: "operatingProfitMargin", js: "operatingProfitMargin", typ: "" },
        { json: "pretaxProfitMargin", js: "pretaxProfitMargin", typ: "" },
        { json: "netProfitMargin", js: "netProfitMargin", typ: "" },
        { json: "effectiveTaxRate", js: "effectiveTaxRate", typ: "" },
        { json: "returnOnAssets", js: "returnOnAssets", typ: "" },
        { json: "returnOnEquity", js: "returnOnEquity", typ: "" },
        { json: "returnOnCapitalEmployed", js: "returnOnCapitalEmployed", typ: "" },
        { json: "nIperEBT", js: "nIperEBT", typ: "" },
        { json: "eBTperEBIT", js: "eBTperEBIT", typ: "" },
        { json: "eBITperRevenue", js: "eBITperRevenue", typ: "" },
    ], false),
};
