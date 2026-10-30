var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/projects/[id].ts
var onRequestGet = /* @__PURE__ */ __name(async ({ params, env }) => {
  const row = await env.DB.prepare(
    "SELECT spec, version FROM templates WHERE project_id = ? ORDER BY version DESC LIMIT 1"
  ).bind(params.id).first();
  if (!row) return Response.json({ error: "Kh\xF4ng t\xECm th\u1EA5y." }, { status: 404 });
  return Response.json({ spec: JSON.parse(row.spec), version: row.version });
}, "onRequestGet");

// ../node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// ../node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  __name(assertIs, "assertIs");
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  __name(assertNever, "assertNever");
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  __name(joinValues, "joinValues");
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = /* @__PURE__ */ __name((data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
}, "getParsedType");

// ../node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = /* @__PURE__ */ __name((obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
}, "quotelessJson");
var ZodError = class _ZodError extends Error {
  static {
    __name(this, "ZodError");
  }
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = /* @__PURE__ */ __name((error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }, "processError");
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// ../node_modules/zod/v3/locales/en.js
var errorMap = /* @__PURE__ */ __name((issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
}, "errorMap");
var en_default = errorMap;

// ../node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
__name(setErrorMap, "setErrorMap");
function getErrorMap() {
  return overrideErrorMap;
}
__name(getErrorMap, "getErrorMap");

// ../node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = /* @__PURE__ */ __name((params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
}, "makeIssue");
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
__name(addIssueToContext, "addIssueToContext");
var ParseStatus = class _ParseStatus {
  static {
    __name(this, "ParseStatus");
  }
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = /* @__PURE__ */ __name((value) => ({ status: "dirty", value }), "DIRTY");
var OK = /* @__PURE__ */ __name((value) => ({ status: "valid", value }), "OK");
var isAborted = /* @__PURE__ */ __name((x) => x.status === "aborted", "isAborted");
var isDirty = /* @__PURE__ */ __name((x) => x.status === "dirty", "isDirty");
var isValid = /* @__PURE__ */ __name((x) => x.status === "valid", "isValid");
var isAsync = /* @__PURE__ */ __name((x) => typeof Promise !== "undefined" && x instanceof Promise, "isAsync");

// ../node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// ../node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  static {
    __name(this, "ParseInputLazyPath");
  }
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = /* @__PURE__ */ __name((ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
}, "handleResult");
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = /* @__PURE__ */ __name((iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  }, "customMap");
  return { errorMap: customMap, description };
}
__name(processCreateParams, "processCreateParams");
var ZodType = class {
  static {
    __name(this, "ZodType");
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = /* @__PURE__ */ __name((val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    }, "getIssueProperties");
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = /* @__PURE__ */ __name(() => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      }), "setError");
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: /* @__PURE__ */ __name((data) => this["~validate"](data), "validate")
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
__name(timeRegexSource, "timeRegexSource");
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
__name(timeRegex, "timeRegex");
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
__name(datetimeRegex, "datetimeRegex");
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidIP, "isValidIP");
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
__name(isValidJWT, "isValidJWT");
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidCidr, "isValidCidr");
var ZodString = class _ZodString extends ZodType {
  static {
    __name(this, "ZodString");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
__name(floatSafeRemainder, "floatSafeRemainder");
var ZodNumber = class _ZodNumber extends ZodType {
  static {
    __name(this, "ZodNumber");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  static {
    __name(this, "ZodBigInt");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  static {
    __name(this, "ZodBoolean");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  static {
    __name(this, "ZodDate");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  static {
    __name(this, "ZodSymbol");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  static {
    __name(this, "ZodUndefined");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  static {
    __name(this, "ZodNull");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  static {
    __name(this, "ZodAny");
  }
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  static {
    __name(this, "ZodUnknown");
  }
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  static {
    __name(this, "ZodNever");
  }
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  static {
    __name(this, "ZodVoid");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  static {
    __name(this, "ZodArray");
  }
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
__name(deepPartialify, "deepPartialify");
var ZodObject = class _ZodObject extends ZodType {
  static {
    __name(this, "ZodObject");
  }
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: /* @__PURE__ */ __name((issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }, "errorMap")
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...augmentation
      }), "shape")
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }), "shape"),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  static {
    __name(this, "ZodUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    __name(handleResults, "handleResults");
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = /* @__PURE__ */ __name((type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
}, "getDiscriminator");
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  static {
    __name(this, "ZodDiscriminatedUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
__name(mergeValues, "mergeValues");
var ZodIntersection = class extends ZodType {
  static {
    __name(this, "ZodIntersection");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = /* @__PURE__ */ __name((parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    }, "handleParsed");
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  static {
    __name(this, "ZodTuple");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  static {
    __name(this, "ZodRecord");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  static {
    __name(this, "ZodMap");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  static {
    __name(this, "ZodSet");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    __name(finalizeSet, "finalizeSet");
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  static {
    __name(this, "ZodFunction");
  }
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    __name(makeArgsIssue, "makeArgsIssue");
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    __name(makeReturnsIssue, "makeReturnsIssue");
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  static {
    __name(this, "ZodLazy");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  static {
    __name(this, "ZodLiteral");
  }
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
__name(createZodEnum, "createZodEnum");
var ZodEnum = class _ZodEnum extends ZodType {
  static {
    __name(this, "ZodEnum");
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  static {
    __name(this, "ZodNativeEnum");
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  static {
    __name(this, "ZodPromise");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  static {
    __name(this, "ZodEffects");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: /* @__PURE__ */ __name((arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      }, "addIssue"),
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = /* @__PURE__ */ __name((acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      }, "executeRefinement");
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  static {
    __name(this, "ZodOptional");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  static {
    __name(this, "ZodNullable");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  static {
    __name(this, "ZodDefault");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  static {
    __name(this, "ZodCatch");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  static {
    __name(this, "ZodNaN");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  static {
    __name(this, "ZodBranded");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  static {
    __name(this, "ZodPipeline");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = /* @__PURE__ */ __name(async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }, "handleAsync");
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  static {
    __name(this, "ZodReadonly");
  }
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = /* @__PURE__ */ __name((data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    }, "freeze");
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
__name(cleanParams, "cleanParams");
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
__name(custom, "custom");
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = /* @__PURE__ */ __name((cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params), "instanceOfType");
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = /* @__PURE__ */ __name(() => stringType().optional(), "ostring");
var onumber = /* @__PURE__ */ __name(() => numberType().optional(), "onumber");
var oboolean = /* @__PURE__ */ __name(() => booleanType().optional(), "oboolean");
var coerce = {
  string: /* @__PURE__ */ __name(((arg) => ZodString.create({ ...arg, coerce: true })), "string"),
  number: /* @__PURE__ */ __name(((arg) => ZodNumber.create({ ...arg, coerce: true })), "number"),
  boolean: /* @__PURE__ */ __name(((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })), "boolean"),
  bigint: /* @__PURE__ */ __name(((arg) => ZodBigInt.create({ ...arg, coerce: true })), "bigint"),
  date: /* @__PURE__ */ __name(((arg) => ZodDate.create({ ...arg, coerce: true })), "date")
};
var NEVER = INVALID;

// ../shared/schema.ts
var Cta = external_exports.string().max(100).optional();
var SectionSchema = external_exports.discriminatedUnion("type", [
  // 1. HERO - Hỗ trợ nhiều layout: split, centered, bold-editorial, minimal
  external_exports.object({
    type: external_exports.literal("hero"),
    props: external_exports.object({
      layout: external_exports.enum(["split", "centered", "editorial", "minimal"]).optional(),
      title: external_exports.string(),
      subtitle: external_exports.string().optional(),
      cta: Cta,
      secondaryCta: Cta,
      badge: external_exports.string().optional(),
      image: external_exports.string().optional(),
      align: external_exports.enum(["left", "center"]).optional()
    })
  }),
  // 2. BENTO GRID - Bố cục bất đối xứng hiện đại (thẻ to, thẻ nhỏ, thẻ rộng)
  external_exports.object({
    type: external_exports.literal("bento"),
    props: external_exports.object({
      heading: external_exports.string().optional(),
      subheading: external_exports.string().optional(),
      items: external_exports.array(
        external_exports.object({
          title: external_exports.string(),
          desc: external_exports.string().optional(),
          badge: external_exports.string().optional(),
          image: external_exports.string().optional(),
          icon: external_exports.string().optional(),
          span: external_exports.enum(["normal", "wide", "tall"]).optional()
        })
      ).min(2).max(8)
    })
  }),
  // 3. CARDS / PRODUCTS - Danh sách thẻ sản phẩm / dịch vụ
  external_exports.object({
    type: external_exports.literal("cards"),
    props: external_exports.object({
      heading: external_exports.string().optional(),
      subheading: external_exports.string().optional(),
      items: external_exports.array(
        external_exports.object({
          title: external_exports.string(),
          desc: external_exports.string().optional(),
          badge: external_exports.string().optional(),
          image: external_exports.string().optional(),
          icon: external_exports.string().optional(),
          price: external_exports.string().optional()
        })
      ).min(1).max(12)
    })
  }),
  // 4. SPLIT FEATURE / NARRATIVE - Kể chuyện so le (Ảnh bên trái, chữ bên phải hoặc ngược lại)
  external_exports.object({
    type: external_exports.literal("split_feature"),
    props: external_exports.object({
      badge: external_exports.string().optional(),
      title: external_exports.string(),
      description: external_exports.string(),
      bullets: external_exports.array(external_exports.string()).optional(),
      image: external_exports.string(),
      reverse: external_exports.boolean().optional(),
      cta: Cta
    })
  }),
  // 5. STATS / METRICS - Các con số ấn tượng
  external_exports.object({
    type: external_exports.literal("stats"),
    props: external_exports.object({
      heading: external_exports.string().optional(),
      items: external_exports.array(
        external_exports.object({
          value: external_exports.string(),
          label: external_exports.string(),
          desc: external_exports.string().optional()
        })
      ).min(2).max(6)
    })
  }),
  // 6. MENU / PRICELIST - Thực đơn / bảng giá dạng dòng chấm leader cổ điển
  external_exports.object({
    type: external_exports.literal("menu"),
    props: external_exports.object({
      heading: external_exports.string().optional(),
      subheading: external_exports.string().optional(),
      categories: external_exports.array(
        external_exports.object({
          name: external_exports.string(),
          items: external_exports.array(
            external_exports.object({
              name: external_exports.string(),
              price: external_exports.string(),
              desc: external_exports.string().optional(),
              badge: external_exports.string().optional()
            })
          )
        })
      ).min(1).max(4)
    })
  }),
  // 7. QUOTE / TESTIMONIAL - Câu trích dẫn triết lý hoặc đánh giá khách hàng
  external_exports.object({
    type: external_exports.literal("quote"),
    props: external_exports.object({
      quote: external_exports.string(),
      author: external_exports.string().optional(),
      role: external_exports.string().optional(),
      avatar: external_exports.string().optional()
    })
  }),
  // 8. TICKER / MARQUEE - Dải chữ chạy ngang ấn tượng
  external_exports.object({
    type: external_exports.literal("ticker"),
    props: external_exports.object({
      items: external_exports.array(external_exports.string()).min(2).max(10)
    })
  }),
  // 9. GALLERY - Bộ sưu tập hình ảnh
  external_exports.object({
    type: external_exports.literal("gallery"),
    props: external_exports.object({
      heading: external_exports.string().optional(),
      subheading: external_exports.string().optional(),
      items: external_exports.array(
        external_exports.object({
          image: external_exports.string(),
          title: external_exports.string().optional(),
          desc: external_exports.string().optional()
        })
      ).min(2).max(8)
    })
  }),
  // 10. TABLE - Bảng so sánh
  external_exports.object({
    type: external_exports.literal("table"),
    props: external_exports.object({
      heading: external_exports.string().optional(),
      subheading: external_exports.string().optional(),
      columns: external_exports.array(external_exports.string()).min(1).max(8),
      rows: external_exports.array(external_exports.array(external_exports.string())).max(40)
    })
  }),
  // 11. FORM - Đăng ký / Liên hệ
  external_exports.object({
    type: external_exports.literal("form"),
    props: external_exports.object({
      heading: external_exports.string().optional(),
      subheading: external_exports.string().optional(),
      submitLabel: external_exports.string().optional(),
      fields: external_exports.array(
        external_exports.object({
          label: external_exports.string(),
          type: external_exports.enum(["text", "email", "tel", "textarea"])
        })
      ).min(1).max(12)
    })
  }),
  // 12. FOOTER
  external_exports.object({
    type: external_exports.literal("footer"),
    props: external_exports.object({
      text: external_exports.string(),
      links: external_exports.array(external_exports.object({ label: external_exports.string(), href: external_exports.string() })).max(12).optional()
    })
  })
]);
var SpecSchema = external_exports.object({
  theme: external_exports.object({
    style: external_exports.enum(["bento", "luxury", "brutalist", "artisan", "minimal", "modern"]).optional(),
    primary: external_exports.string(),
    secondary: external_exports.string().optional(),
    accent: external_exports.string().optional(),
    background: external_exports.string().optional(),
    text: external_exports.string().optional(),
    font: external_exports.string().optional(),
    radius: external_exports.enum(["none", "sm", "md", "lg", "full"]).optional()
  }),
  sections: external_exports.array(SectionSchema).min(1).max(20)
});

// api/_prompt.ts
var SYSTEM_PROMPT = `B\u1EA1n l\xE0 m\u1ED9t Design Lead h\xE0ng \u0111\u1EA7u th\u1EBF gi\u1EDBi t\u1EA1i m\u1ED9t creative studio danh ti\u1EBFng (t\u01B0\u01A1ng t\u1EF1 Pentagram, Locomotive, Apple Design Team).
Kh\xE1ch h\xE0ng c\u1EE7a b\u1EA1n TUY\u1EC6T \u0110\u1ED0I KH\xD4NG CH\u1EA4P NH\u1EACN nh\u1EEFng thi\u1EBFt k\u1EBF r\u1EADp khu\xF4n, m\u1ED9t m\xE0u, "10 trang nh\u01B0 1". M\u1ED7i trang web b\u1EA1n t\u1EA1o ra ph\u1EA3i c\xF3 linh h\u1ED3n ri\xEAng, b\u1EA3n s\u1EAFc ri\xEAng bi\u1EC7t (Distinct Visual Identity), c\u1EA5u tr\xFAc \u0111\u1ED9t ph\xE1 v\xE0 h\xECnh \u1EA3nh Unsplash tuy\u1EC3n ch\u1ECDn \u0111\u1EAFt gi\xE1!

CH\u1EC8 TR\u1EA2 V\u1EC0 DUY NH\u1EA4T 1 \u0110\u1ED0I T\u01AF\u1EE2NG JSON H\u1EE2P L\u1EC6, KH\xD4NG B\u1ECCC B\u1EDEI MARKDOWN HAY B\u1EA4T K\u1EF2 V\u0102N B\u1EA2N N\xC0O.

C\u1EA4U TR\xDAC JSON:
{
  "theme": {
    "style": "bento" | "luxury" | "brutalist" | "artisan" | "minimal" | "modern",
    "primary": "#RRGGBB",
    "secondary": "#RRGGBB",
    "background": "#RRGGBB",
    "text": "#RRGGBB",
    "font": "Be Vietnam Pro" | "Bricolage Grotesque" | "Georgia" | "system-ui"
  },
  "sections": [ ...t\u1EEB 4 \u0111\u1EBFn 8 section \u0111a d\u1EA1ng... ]
}

H\u01AF\u1EDANG D\u1EAAN CH\u1ECCN PHONG C\xC1CH (STYLE ARCHETYPE) THEO NG\xC0NH NGH\u1EC0:
1. "artisan" (C\xE0 ph\xEA, tr\xE0, b\xE1nh ng\u1ECDt, th\u1EE7 c\xF4ng, hoa t\u01B0\u01A1i, spa):
   - B\u1ED1 c\u1EE5c \u1EA5m \xE1p, t\u1EF1 nhi\xEAn. D\xF9ng section "menu" (th\u1EF1c \u0111\u01A1n d\xF2ng ch\u1EA5m leader) + "split_feature" + "gallery" + "quote".
   - M\xE0u n\u1EC1n: m\xE0u kem, gi\u1EA5y m\u1ED9c (#faf8f5, #fcfbf9), ch\u1EEF n\xE2u \u0111\u1EADm/espresso (#292524), m\xE0u nh\u1EA5n h\u1ED5 ph\xE1ch/terracotta/h\u1ED3ng ph\u1EA5n.
2. "bento" (C\xF4ng ngh\u1EC7, SaaS, startup, app, gi\u1EA3i ph\xE1p s\u1ED1):
   - D\xF9ng section "hero" (split) + "bento" (th\u1EBB b\u1EA5t \u0111\u1ED1i x\u1EE9ng span wide/tall) + "stats" + "form".
   - N\u1EC1n t\u1ED1i ho\u1EB7c tr\u1EAFng tinh kh\xF4i, m\xE0u nh\u1EA5n xanh \u0111i\u1EC7n (Electric Blue #2563eb, t\xEDm neon #7c3aed, ho\u1EB7c ng\u1ECDc l\u1EE5c b\u1EA3o).
3. "luxury" (B\u1EA5t \u0111\u1ED9ng s\u1EA3n cao c\u1EA5p, trang s\u1EE9c, th\u1EDDi trang xa x\u1EC9, resort, nh\xE0 h\xE0ng fine dining):
   - D\xF9ng "hero" (layout "editorial") + "gallery" + "quote" + "split_feature".
   - N\u1EC1n \u0111en huy\u1EC1n b\xED (#0a0a0c) ho\u1EB7c tr\u1EAFng ng\xE0, m\xE0u nh\u1EA5n v\xE0ng champagne/bronze/gold (#d4af37, #c5a880), font serif Georgia thanh l\u1ECBch.
4. "brutalist" (S\u1EF1 ki\u1EC7n, th\u1EDDi trang \u0111\u01B0\u1EDDng ph\u1ED1 streetwear, s\xE1ng t\u1EA1o ngh\u1EC7 thu\u1EADt, agency ph\xE1 c\xE1ch):
   - D\xF9ng "ticker" + "hero" (editorial) + "cards" + "quote".
   - T\u01B0\u01A1ng ph\u1EA3n g\u1EAFt, \u0111\u01B0\u1EDDng vi\u1EC1n \u0111\u1EADm, m\xE0u s\u1EAFc n\u1ED5i lo\u1EA1n (v\xE0ng chanh, cam r\u1EF1c r\u1EE1, \u0111en tuy\u1EC1n).
5. "minimal" (Nhi\u1EBFp \u1EA3nh, ki\u1EBFn tr\xFAc, portfolio c\xE1 nh\xE2n, thi\u1EBFt k\u1EBF n\u1ED9i th\u1EA5t):
   - D\xF9ng "hero" (layout "minimal") + "gallery" (\u1EA3nh l\u1EDBn) + "split_feature".
   - Kho\u1EA3ng tr\u1EAFng r\u1ED9ng l\u1EDBn, t\u1ED1i gi\u1EA3n tuy\u1EC7t \u0111\u1ED1i, h\xECnh \u1EA3nh n\xF3i l\xEAn t\u1EA5t c\u1EA3.

DANH S\xC1CH SECTION \u0110\u01AF\u1EE2C PH\xC9P D\xD9NG:
1. "hero":
   { "layout": "split" | "centered" | "editorial" | "minimal", "badge"?: string, "title": string, "subtitle"?: string, "cta"?: string, "secondaryCta"?: string, "image"?: string }
2. "bento":
   { "heading"?: string, "subheading"?: string, "items": [ { "title": string, "desc"?: string, "badge"?: string, "image"?: string, "icon"?: string, "span"?: "normal" | "wide" | "tall" } ] }
3. "split_feature":
   { "badge"?: string, "title": string, "description": string, "bullets"?: string[], "image": string, "reverse"?: boolean, "cta"?: string }
4. "stats":
   { "heading"?: string, "items": [ { "value": string, "label": string, "desc"?: string } ] }
5. "menu":
   { "heading"?: string, "subheading"?: string, "categories": [ { "name": string, "items": [ { "name": string, "price": string, "desc"?: string, "badge"?: string } ] } ] }
6. "quote":
   { "quote": string, "author"?: string, "role"?: string, "avatar"?: string }
7. "ticker":
   { "items": string[] }
8. "gallery":
   { "heading"?: string, "subheading"?: string, "items": [ { "image": string, "title"?: string, "desc"?: string } ] }
9. "cards":
   { "heading"?: string, "subheading"?: string, "items": [ { "title": string, "desc"?: string, "badge"?: string, "image"?: string, "icon"?: string, "price"?: string } ] }
10. "table":
   { "heading"?: string, "subheading"?: string, "columns": string[], "rows": string[][] }
11. "form":
   { "heading"?: string, "subheading"?: string, "submitLabel"?: string, "fields": [ { "label": string, "type": "text"|"email"|"tel"|"textarea" } ] }
12. "footer":
   { "text": string, "links"?: [ { "label": string, "href": string } ] }

NGU\u1ED2N \u1EA2NH UNSPLASH CHU\u1EA8N \u0110\u1EC2 S\u1EEC D\u1EE4NG (D\xF9ng \u1EA3nh ch\u1EA5t l\u01B0\u1EE3ng cao t\u01B0\u01A1ng \u1EE9ng ch\u1EE7 \u0111\u1EC1):
- F&B/Cafe/B\xE1nh:
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085", "https://images.unsplash.com/photo-1554118811-1e0d58224f24", "https://images.unsplash.com/photo-1509440159596-0249088772ff"
- Hoa t\u01B0\u01A1i / Hoa c\u01B0\u1EDBi:
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364", "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11", "https://images.unsplash.com/photo-1563245372-f21724e3856d", "https://images.unsplash.com/photo-1507290439931-a861b5a38200"
- Th\u1EDDi trang / Ph\u1EE5 ki\u1EC7n:
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f", "https://images.unsplash.com/photo-1445205170230-053b83016050", "https://images.unsplash.com/photo-1483985988355-763728e1935b"
- Gym / Fitness / Th\u1EC3 thao:
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd", "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b", "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2"
- C\xF4ng ngh\u1EC7 / SaaS / Doanh nghi\u1EC7p:
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f", "https://images.unsplash.com/photo-1551434678-e076c223a692", "https://images.unsplash.com/photo-1522071820081-009f0129c71c", "https://images.unsplash.com/photo-1531403009284-440f080d1e12"

QUY T\u1EAEC C\u1ED0T L\xD5I:
- KH\xD4NG BAO GI\u1EDC l\u1EB7p l\u1EA1i m\u1ED9t th\u1EE9 t\u1EF1 hay m\u1ED9t khu\xF4n m\u1EABu cho m\u1ECDi website!
- T\xF9y v\xE0o y\xEAu c\u1EA7u, ch\u1ECDn c\xE1c section k\u1EBFt h\u1EE3p kh\xE1c nhau (v\xED d\u1EE5: Ti\u1EC7m b\xE1nh/cafe n\xEAn d\xF9ng ticker + editorial hero + menu + split_feature + quote; SaaS n\xEAn d\xF9ng hero split + bento + stats + form; Shop hoa n\xEAn d\xF9ng centered hero + cards + gallery + form).
- Vi\u1EBFt v\u0103n phong Ti\u1EBFng Vi\u1EC7t s\u1ED1ng \u0111\u1ED9ng, chu\u1EA9n tinh th\u1EA7n th\u01B0\u01A1ng hi\u1EC7u.

H\u01AF\u1EDANG D\u1EAAN B\u1EAET BU\u1ED8C KHI C\xD3 WEBSITE HI\u1EC6N C\xD3 (currentSpec - Ch\u1EC9nh s\u1EEDa / B\u1ED5 sung):
Khi \u0111\u1EA7u v\xE0o c\xF3 "currentSpec" ho\u1EB7c "isUpdate: true":
1. B\u1EA2O T\u1ED2N N\u1EC0N C\u0168 100%: Tuy\u1EC7t \u0111\u1ED1i KH\xD4NG t\u1EA1o m\u1ED9t website m\u1EDBi t\u1EEB \u0111\u1EA7u. Ph\u1EA3i gi\u1EEF nguy\xEAn to\xE0n b\u1ED9 c\xE1c section, \u1EA3nh, m\xE0u s\u1EAFc, phong c\xE1ch (theme.style), typography v\xE0 n\u1ED9i dung v\u0103n b\u1EA3n \u0111\xE3 c\xF3 trong currentSpec.
2. TH\xCAM SECTION THEO Y\xCAU C\u1EA6U: N\u1EBFu ng\u01B0\u1EDDi d\xF9ng y\xEAu c\u1EA7u "th\xEAm..." (v\xED d\u1EE5: th\xEAm b\u1EA3ng gi\xE1, th\xEAm menu, th\xEAm form li\xEAn h\u1EC7, th\xEAm \u0111\xE1nh gi\xE1, th\xEAm th\u01B0 vi\u1EC7n \u1EA3nh...): H\xE3y gi\u1EEF nguy\xEAn to\xE0n b\u1ED9 c\xE1c section c\u0169 c\u1EE7a currentSpec v\xE0 ch\xE8n th\xEAm section m\u1EDBi t\u01B0\u01A1ng \u1EE9ng v\xE0o v\u1ECB tr\xED th\xEDch h\u1EE3p (ngay tr\u01B0\u1EDBc section "footer").
3. THAY \u0110\u1ED4I M\xC0U S\u1EAEC / THEME: N\u1EBFu ng\u01B0\u1EDDi d\xF9ng y\xEAu c\u1EA7u "\u0111\u1ED5i sang t\xF4ng t\u1ED1i", "\u0111\u1ED5i m\xE0u xanh", v.v.: C\u1EADp nh\u1EADt tr\u01B0\u1EDDng t\u01B0\u01A1ng \u1EE9ng trong object "theme", gi\u1EEF nguy\xEAn c\xE1c section kh\xE1c.
4. S\u1EECA \u0110\u1ED4I N\u1ED8I DUNG: N\u1EBFu ng\u01B0\u1EDDi d\xF9ng y\xEAu c\u1EA7u s\u1EEDa ti\xEAu \u0111\u1EC1 ho\u1EB7c s\u1EEDa m\u1ED9t ph\u1EA7n c\u1EE5 th\u1EC3: T\xECm section \u0111\xF3 v\xE0 s\u1EEDa props c\u1EE7a n\xF3, gi\u1EEF nguy\xEAn c\xE1c section c\xF2n l\u1EA1i.
5. X\xD3A SECTION: N\u1EBFu ng\u01B0\u1EDDi d\xF9ng y\xEAu c\u1EA7u b\u1ECF/x\xF3a m\u1ED9t section c\u1EE5 th\u1EC3: Lo\u1EA1i b\u1ECF section \u0111\xF3 kh\u1ECFi danh s\xE1ch sections.
6. K\u1EBET QU\u1EA2 TR\u1EA2 V\u1EC0: Lu\xF4n tr\u1EA3 v\u1EC1 to\xE0n b\u1ED9 \u0111\u1ED1i t\u01B0\u1EE3ng JSON Spec ho\xE0n ch\u1EC9nh ch\u1EE9a \u0111\u1EA7y \u0111\u1EE7 c\xE1c section c\u0169 \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt ho\u1EB7c b\u1ED5 sung.`;

// api/generate.ts
var MODEL = "gemini-3.8-flash";
var MAX_PROMPT = 1500;
var RATE_LIMIT = 30;
var enc = new TextEncoder();
var sleep = /* @__PURE__ */ __name((ms) => new Promise((r) => setTimeout(r, ms)), "sleep");
async function rateLimited(env, ip) {
  try {
    if (!env.DB) return false;
    const window = Math.floor(Date.now() / 36e5);
    await env.DB.prepare(
      `INSERT INTO rate_limits (ip, window, count) VALUES (?, ?, 1)
       ON CONFLICT(ip, window) DO UPDATE SET count = count + 1`
    ).bind(ip, window).run();
    const row = await env.DB.prepare("SELECT count FROM rate_limits WHERE ip = ? AND window = ?").bind(ip, window).first();
    return (row?.count ?? 0) > RATE_LIMIT;
  } catch (e) {
    console.warn("B\u1ECF qua rate-limit do database:", e);
    return false;
  }
}
__name(rateLimited, "rateLimited");
function stripVietnamese(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "d").toLowerCase();
}
__name(stripVietnamese, "stripVietnamese");
function detectStyleFromPrompt(prompt) {
  const p = stripVietnamese(prompt);
  if (p.includes("nha khoa") || p.includes("y te") || p.includes("phong kham") || p.includes("bac si") || p.includes("benh vien") || p.includes("duoc") || p.includes("rang ham mat") || p.includes("kham benh") || p.includes("smile") || p.includes("clinic") || p.includes("dental")) {
    return "modern";
  }
  if (p.includes("saas") || p.includes("app") || p.includes("ai") || p.includes("phan mem") || p.includes("startup") || p.includes("cong nghe") || p.includes("tech") || p.includes("tool") || p.includes("dashboard") || p.includes("crm") || p.includes("developer") || p.includes("platform") || p.includes("quan ly") || p.includes("automation") || p.includes("he thong")) {
    return "bento";
  }
  if (p.includes("luxury") || p.includes("sang trong") || p.includes("resort") || p.includes("hotel") || p.includes("khach san") || p.includes("vang") || p.includes("trang suc") || p.includes("kim cuong") || p.includes("jewelry") || p.includes("villa") || p.includes("biet thu") || p.includes("bat dong san") || p.includes("dong ho") || p.includes("watch") || p.includes("yacht") || p.includes("du thuyen") || p.includes("golf")) {
    return "luxury";
  }
  if (p.includes("streetwear") || p.includes("thoi trang duong pho") || p.includes("gym") || p.includes("fitness") || p.includes("boxing") || p.includes("the hinh") || p.includes("workout") || p.includes("bar") || p.includes("club") || p.includes("tattoo") || p.includes("agency") || p.includes("gaming") || p.includes("esport") || p.includes("sneaker") || p.includes("ao thun") || p.includes("hoodie") || p.includes("vo thuat") || p.includes("the thao") || p.includes("calisthenics")) {
    return "brutalist";
  }
  const isFlower = p.includes("hoa tuoi") || p.includes("shop hoa") || p.includes("tiem hoa") || p.includes("flower") || /\bhoa\b/.test(p);
  if (p.includes("cafe") || p.includes("ca phe") || p.includes("coffee") || p.includes("tra") || p.includes("tea") || p.includes("banh") || p.includes("bakery") || p.includes("pastry") || p.includes("thu cong") || p.includes("handmade") || isFlower || p.includes("gom") || p.includes("tiem") || p.includes("quan an") || p.includes("organic") || p.includes("acoustic") || p.includes("moc") || p.includes("rang xay")) {
    return "artisan";
  }
  if (p.includes("nhiep anh") || p.includes("photography") || p.includes("portfolio") || p.includes("kien truc") || p.includes("architect") || p.includes("toi gian") || p.includes("minimal") || p.includes("gallery") || p.includes("trien lam") || p.includes("designer") || p.includes("studio") || p.includes("noi that")) {
    return "minimal";
  }
  return "modern";
}
__name(detectStyleFromPrompt, "detectStyleFromPrompt");
function modifyExistingSpec(currentSpec, prompt) {
  const updated = JSON.parse(JSON.stringify(currentSpec));
  const p = stripVietnamese(prompt);
  if (p.includes("toi") || p.includes("dark") || p.includes("den") || p.includes("nen den")) {
    updated.theme.background = "#0f172a";
    updated.theme.text = "#f8fafc";
  } else if (p.includes("sang") || p.includes("light") || p.includes("trang") || p.includes("nen trang")) {
    updated.theme.background = "#ffffff";
    updated.theme.text = "#0f172a";
  }
  if (p.includes("xanh la") || p.includes("xanh luc") || p.includes("green")) {
    updated.theme.primary = "#16a34a";
  } else if (p.includes("xanh duong") || p.includes("xanh bien") || p.includes("blue")) {
    updated.theme.primary = "#2563eb";
  } else if (p.includes("mau do") || p.includes("tone do") || p.includes("do") && (p.includes("mau") || p.includes("tong"))) {
    updated.theme.primary = "#dc2626";
  } else if (p.includes("mau cam") || p.includes("cam") && (p.includes("mau") || p.includes("tong"))) {
    updated.theme.primary = "#ea580c";
  } else if (p.includes("mau vang") || p.includes("vang") && (p.includes("mau") || p.includes("tong") || p.includes("gold"))) {
    updated.theme.primary = "#d97706";
  } else if (p.includes("mau tim") || p.includes("tim") && (p.includes("mau") || p.includes("tong") || p.includes("purple"))) {
    updated.theme.primary = "#7c3aed";
  } else if (p.includes("mau hong") || p.includes("hong") && (p.includes("mau") || p.includes("tong") || p.includes("pink"))) {
    updated.theme.primary = "#db2777";
  } else if (p.includes("mau nau") || p.includes("nau") && (p.includes("mau") || p.includes("tong") || p.includes("coffee"))) {
    updated.theme.primary = "#78350f";
  }
  if (p.includes("luxury") || p.includes("sang trong")) {
    updated.theme.style = "luxury";
    updated.theme.font = "Playfair Display";
  } else if (p.includes("bento") || p.includes("hien dai cong nghe")) {
    updated.theme.style = "bento";
    updated.theme.font = "Be Vietnam Pro";
  } else if (p.includes("brutalist") || p.includes("pha cach") || p.includes("duong pho")) {
    updated.theme.style = "brutalist";
    updated.theme.font = "Bricolage Grotesque";
  } else if (p.includes("artisan") || p.includes("am ap") || p.includes("vintage") || p.includes("co dien")) {
    updated.theme.style = "artisan";
    updated.theme.font = "Playfair Display";
  } else if (p.includes("minimal") || p.includes("toi gian")) {
    updated.theme.style = "minimal";
    updated.theme.font = "system-ui";
  }
  const insertBeforeFooter = /* @__PURE__ */ __name((newSection) => {
    const footerIdx = updated.sections.findIndex((s) => s.type === "footer");
    if (footerIdx >= 0) {
      updated.sections.splice(footerIdx, 0, newSection);
    } else {
      updated.sections.push(newSection);
    }
  }, "insertBeforeFooter");
  const isDelete = p.includes("xoa") || p.includes("bo ") || p.includes("loai bo") || p.includes("delete") || p.includes("remove");
  if (isDelete) {
    if (p.includes("bang gia") || p.includes("table")) {
      updated.sections = updated.sections.filter((s) => s.type !== "table");
    }
    if (p.includes("form") || p.includes("lien he") || p.includes("dat ban")) {
      updated.sections = updated.sections.filter((s) => s.type !== "form");
    }
    if (p.includes("menu") || p.includes("thuc don")) {
      updated.sections = updated.sections.filter((s) => s.type !== "menu");
    }
    if (p.includes("gallery") || p.includes("anh") || p.includes("bo suu tap")) {
      updated.sections = updated.sections.filter((s) => s.type !== "gallery");
    }
    if (p.includes("quote") || p.includes("danh gia") || p.includes("nhan xet")) {
      updated.sections = updated.sections.filter((s) => s.type !== "quote");
    }
    if (p.includes("stats") || p.includes("thong ke")) {
      updated.sections = updated.sections.filter((s) => s.type !== "stats");
    }
    if (p.includes("ticker") || p.includes("chu chay")) {
      updated.sections = updated.sections.filter((s) => s.type !== "ticker");
    }
    return updated;
  }
  if (p.includes("doi ten") || p.includes("sua ten") || p.includes("doi tieu de") || p.includes("sua tieu de") || p.includes("dat ten") || p.includes("tieu de thanh")) {
    const match2 = prompt.match(/(?:doi|sua|dat|thay)\s+(?:ten|tieu de|brand)?\s*(?:thanh|la|:)?\s*["'“]?([^"'”\n,.]+)/i);
    const newTitle = match2?.[1]?.trim();
    const heroSection = updated.sections.find((s) => s.type === "hero");
    if (heroSection && heroSection.type === "hero" && newTitle) {
      heroSection.props.title = newTitle;
    }
  }
  let sectionAdded = false;
  if (p.includes("bang gia") || p.includes("gia ca") || p.includes("goi cuoc") || p.includes("pricing") || p.includes("chi phi") || p.includes("bang phi")) {
    const hasTable = updated.sections.some((s) => s.type === "table");
    if (!hasTable) {
      insertBeforeFooter({
        type: "table",
        props: {
          heading: "B\u1EA3ng Gi\xE1 D\u1ECBch V\u1EE5 & S\u1EA3n Ph\u1EA9m",
          subheading: "B\u1EA3ng gi\xE1 chi ti\u1EBFt, minh b\u1EA1ch v\xE0 cam k\u1EBFt ch\u1EA5t l\u01B0\u1EE3ng h\xE0ng \u0111\u1EA7u",
          columns: ["G\xF3i D\u1ECBch V\u1EE5 / H\u1EA1ng M\u1EE5c", "N\u1ED9i Dung Quy\u1EC1n L\u1EE3i", "M\u1EE9c Gi\xE1 Chi Ti\u1EBFt"],
          rows: [
            ["G\xF3i Ti\xEAu Chu\u1EA9n (Standard)", "\u0110\u1EA7y \u0111\u1EE7 c\xE1c quy\u1EC1n l\u1EE3i c\u1ED1t l\xF5i, t\u01B0 v\u1EA5n & h\u1ED7 tr\u1EE3 t\u1EADn t\xECnh", "Li\xEAn h\u1EC7 \u01B0u \u0111\xE3i"],
            ["G\xF3i Chuy\xEAn Nghi\u1EC7p (Pro)", "\u01AFu ti\xEAn d\u1ECBch v\u1EE5 cao c\u1EA5p, t\u1EB7ng k\xE8m ti\u1EC7n \xEDch \u0111\u1ED9c quy\u1EC1n", "Gi\u1EA3m 20% h\xF4m nay"],
            ["G\xF3i Doanh Nghi\u1EC7p (VIP)", "\u0110\u1ED3ng h\xE0nh tr\u1EF1c ti\u1EBFp 1-1, t\u1ED1i \u01B0u h\xF3a ri\xEAng theo y\xEAu c\u1EA7u", "B\xE1o gi\xE1 tr\u1EF1c ti\u1EBFp"]
          ]
        }
      });
      sectionAdded = true;
    }
  }
  if (p.includes("form") || p.includes("lien he") || p.includes("dat ban") || p.includes("dat lich") || p.includes("dang ky") || p.includes("tu van") || p.includes("gui tin nhan")) {
    const hasForm = updated.sections.some((s) => s.type === "form");
    if (!hasForm) {
      const isBooking = p.includes("dat ban") || p.includes("dat cho") || p.includes("dat lich");
      insertBeforeFooter({
        type: "form",
        props: {
          heading: isBooking ? "\u0110\u1EB7t Ch\u1ED7 / \u0110\u1EB7t L\u1ECBch H\u1EB9n Tr\u1EF1c Tuy\u1EBFn" : "\u0110\u0103ng K\xFD T\u01B0 V\u1EA5n & Nh\u1EADn B\xE1o Gi\xE1",
          subheading: "Vui l\xF2ng \u0111\u1EC3 l\u1EA1i th\xF4ng tin, ch\xFAng t\xF4i s\u1EBD li\xEAn h\u1EC7 x\xE1c nh\u1EADn trong v\xF2ng 15 ph\xFAt",
          submitLabel: isBooking ? "X\xE1c Nh\u1EADn \u0110\u1EB7t Ch\u1ED7 Ngay" : "G\u1EEDi Th\xF4ng Tin Cho Ch\xFAng T\xF4i",
          fields: [
            { label: "H\u1ECD v\xE0 t\xEAn c\u1EE7a b\u1EA1n", type: "text" },
            { label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i li\xEAn h\u1EC7", type: "tel" },
            { label: isBooking ? "Th\u1EDDi gian & S\u1ED1 l\u01B0\u1EE3ng kh\xE1ch" : "N\u1ED9i dung c\u1EA7n t\u01B0 v\u1EA5n", type: "textarea" }
          ]
        }
      });
      sectionAdded = true;
    }
  }
  if (p.includes("menu") || p.includes("thuc don") || p.includes("do uong") || p.includes("mon an")) {
    const hasMenu = updated.sections.some((s) => s.type === "menu");
    if (!hasMenu) {
      insertBeforeFooter({
        type: "menu",
        props: {
          heading: "Th\u1EF1c \u0110\u01A1n & M\xF3n N\u1ED5i B\u1EADt",
          subheading: "\u0110\u01B0\u1EE3c ch\u1EAFt l\u1ECDc t\u1EEB nh\u1EEFng nguy\xEAn li\u1EC7u t\u01B0\u01A1i ngon v\xE0 ch\u1EA5t l\u01B0\u1EE3ng nh\u1EA5t",
          categories: [
            {
              name: "M\xF3n B\xE1n Ch\u1EA1y Nh\u1EA5t (Signature)",
              items: [
                { name: "M\xF3n \u0110\u1EB7c Tr\u01B0ng Th\u01B0\u1EE3ng H\u1EA1ng", desc: "H\u01B0\u01A1ng v\u1ECB \u0111\u1ED9c \u0111\xE1o, ch\u1EBF bi\u1EBFn c\xF4ng phu theo c\xF4ng th\u1EE9c ri\xEAng", price: "M\u1EE9c gi\xE1 h\u1EE3p l\xFD", badge: "Signature" },
                { name: "M\xF3n Tuy\u1EC3n Ch\u1ECDn Y\xEAu Th\xEDch", desc: "Nguy\xEAn li\u1EC7u t\u01B0\u01A1i s\u1EA1ch m\u1ED7i ng\xE0y, dinh d\u01B0\u1EE1ng v\xE0 th\u01A1m ngon", price: "B\xE1n ch\u1EA1y", badge: "Hot" },
                { name: "M\xF3n Thanh M\xE1t D\u1ECBu L\xE0nh", desc: "Thanh m\xE1t c\u01A1 th\u1EC3, gi\u1EA3i nhi\u1EC7t v\xE0 s\u1EA3ng kho\xE1i tinh th\u1EA7n", price: "Khuy\xEAn d\xF9ng" }
              ]
            }
          ]
        }
      });
      sectionAdded = true;
    }
  }
  if (p.includes("danh gia") || p.includes("review") || p.includes("nhan xet") || p.includes("khach hang") || p.includes("feedback") || p.includes("cam nhan") || p.includes("quote")) {
    const hasQuote = updated.sections.some((s) => s.type === "quote");
    if (!hasQuote) {
      insertBeforeFooter({
        type: "quote",
        props: {
          quote: "D\u1ECBch v\u1EE5 v\u01B0\u1EE3t tr\xEAn c\u1EA3 s\u1EF1 mong \u0111\u1EE3i! \u0110\u1ED9i ng\u0169 ph\u1EE5c v\u1EE5 chuy\xEAn nghi\u1EC7p, s\u1EA3n ph\u1EA9m ch\u1EC9n chu \u0111\u1EBFn t\u1EEBng chi ti\u1EBFt nh\u1ECF v\xE0 lu\xF4n mang l\u1EA1i c\u1EA3m gi\xE1c an t\xE2m.",
          author: "Nguy\u1EC5n Thu Th\u1EA3o",
          role: "Kh\xE1ch h\xE0ng th\xE2n thi\u1EBFt"
        }
      });
      sectionAdded = true;
    }
  }
  if (p.includes("gallery") || p.includes("anh") || p.includes("album") || p.includes("hinh anh") || p.includes("bo suu tap")) {
    const hasGallery = updated.sections.some((s) => s.type === "gallery");
    if (!hasGallery) {
      insertBeforeFooter({
        type: "gallery",
        props: {
          heading: "B\u1ED9 S\u01B0u T\u1EADp H\xECnh \u1EA2nh & Ho\u1EA1t \u0110\u1ED9ng",
          subheading: "Nh\u1EEFng g\xF3c nh\xECn ch\xE2n th\u1EF1c v\u1EC1 s\u1EA3n ph\u1EA9m, kh\xF4ng gian v\xE0 tr\u1EA3i nghi\u1EC7m",
          items: [
            { image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80", title: "Kh\xF4ng Gian Tinh T\u1EBF", desc: "\u1EA4m \xE1p v\xE0 tr\xE0n \u0111\u1EA7y c\u1EA3m h\u1EE9ng" },
            { image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80", title: "Ch\u1EA5t L\u01B0\u1EE3ng Th\u01B0\u1EE3ng H\u1EA1ng", desc: "T\u1EC9 m\u1EC9 trong t\u1EEBng \u0111\u01B0\u1EDDng n\xE9t" },
            { image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80", title: "S\u1EF1 H\xE0i L\xF2ng", desc: "\u0110\u01B0\u1EE3c kh\xE1ch h\xE0ng y\xEAu m\u1EBFn b\xECnh ch\u1ECDn" }
          ]
        }
      });
      sectionAdded = true;
    }
  }
  if (p.includes("stats") || p.includes("thong ke") || p.includes("so lieu") || p.includes("thanh tuu") || p.includes("con so")) {
    const hasStats = updated.sections.some((s) => s.type === "stats");
    if (!hasStats) {
      insertBeforeFooter({
        type: "stats",
        props: {
          heading: "Th\xE0nh T\u1EF1u & Nh\u1EEFng Con S\u1ED1 Bi\u1EBFt N\xF3i",
          items: [
            { value: "98.5%", label: "Kh\xE1ch H\xE0ng H\xE0i L\xF2ng", desc: "T\u1EEB h\u01A1n 5,000+ l\u01B0\u1EE3t \u0111\xE1nh gi\xE1" },
            { value: "10,000+", label: "L\u01B0\u1EE3t Ph\u1EE5c V\u1EE5", desc: "\u0110\u1ED3ng h\xE0nh m\u1ED7i n\u0103m" },
            { value: "Top 1", label: "Ch\u1EA5t L\u01B0\u1EE3ng H\xE0ng \u0110\u1EA7u", desc: "\u0110\u01B0\u1EE3c tin t\u01B0\u1EDFng v\xE0 kh\u1EB3ng \u0111\u1ECBnh" }
          ]
        }
      });
      sectionAdded = true;
    }
  }
  if (p.includes("ticker") || p.includes("chu chay") || p.includes("chay chu") || p.includes("banner chay")) {
    const hasTicker = updated.sections.some((s) => s.type === "ticker");
    if (!hasTicker) {
      const heroIdx = updated.sections.findIndex((s) => s.type === "hero");
      const insertIdx = heroIdx >= 0 ? heroIdx + 1 : 0;
      updated.sections.splice(insertIdx, 0, {
        type: "ticker",
        props: {
          items: ["CH\u1EA4T L\u01AF\u1EE2NG H\xC0NG \u0110\u1EA6U", "\u01AFU \u0110\xC3I \u0110\u1EB6C QUY\u1EC0N TRONG TH\xC1NG", "D\u1ECACH V\u1EE4 T\u1EACN T\xC2M CHUY\xCAN NGHI\u1EC6P", "CAM K\u1EBET H\xC0I L\xD2NG 100%"]
        }
      });
      sectionAdded = true;
    }
  }
  if (!sectionAdded && (p.includes("them") || p.includes("bo sung") || p.includes("xay dung") || p.includes("tao them") || p.includes("viet them"))) {
    const featureTitle = prompt.length > 55 ? prompt.slice(0, 52) + "..." : prompt;
    insertBeforeFooter({
      type: "split_feature",
      props: {
        badge: "TH\xD4NG TIN B\u1ED4 SUNG",
        title: featureTitle,
        description: "N\u1ED9i dung \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt v\xE0 b\u1ED5 sung ri\xEAng theo y\xEAu c\u1EA7u c\u1EE7a b\u1EA1n, ho\xE0n to\xE0n \u0111\u1ED3ng \u0111i\u1EC7u v\u1EDBi nh\u1EADn di\u1EC7n c\u1EE7a trang web.",
        bullets: [
          "\u0110\u1EA3m b\u1EA3o ti\xEAu chu\u1EA9n ch\u1EA5t l\u01B0\u1EE3ng cao v\xE0 tr\u1EA3i nghi\u1EC7m chuy\xEAn nghi\u1EC7p",
          "\u0110\u01B0\u1EE3c \u0111\u1ED3ng b\u1ED9 m\xE0u s\u1EAFc v\xE0 ki\u1EC3u d\xE1ng theo b\u1ED1 c\u1EE5c s\u1EB5n c\xF3",
          "S\u1EB5n s\xE0ng ph\u1EE5c v\u1EE5 v\xE0 mang l\u1EA1i gi\xE1 tr\u1ECB thi\u1EBFt th\u1EF1c nh\u1EA5t cho kh\xE1ch h\xE0ng"
        ],
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
        cta: "T\xECm hi\u1EC3u th\xEAm"
      }
    });
  }
  return updated;
}
__name(modifyExistingSpec, "modifyExistingSpec");
function createSmartPromptSpec(prompt) {
  const p = stripVietnamese(prompt);
  const cleanTitle = prompt.length > 55 ? prompt.slice(0, 52) + "..." : prompt;
  const style = detectStyleFromPrompt(prompt);
  const isFlower = p.includes("hoa tuoi") || p.includes("shop hoa") || p.includes("tiem hoa") || p.includes("flower") || /\bhoa\b/.test(p);
  if (isFlower) {
    return {
      theme: {
        primary: "#e11d48",
        secondary: "#fda4af",
        accent: "#f43f5e",
        background: "#fff9f9",
        text: "#1e1b1b",
        font: "Playfair Display",
        style: "artisan"
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "centered",
            badge: "\u{1F338} HOA NGH\u1EC6 THU\u1EACT & THI\u1EBET K\u1EBE \u0110\u1ED8C B\u1EA2N",
            title: cleanTitle,
            subtitle: "M\u1ED7i \u0111\xF3a hoa l\xE0 m\u1ED9t t\xE1c ph\u1EA9m mang theo c\xE2u chuy\u1EC7n c\u1EA3m x\xFAc, tuy\u1EC3n ch\u1ECDn hoa t\u01B0\u01A1i nh\u1EADp kh\u1EA9u trong ng\xE0y v\xE0 s\xE1ng t\u1EA1o th\u1EE7 c\xF4ng b\u1EDFi ngh\u1EC7 nh\xE2n.",
            cta: "\u0110\u1EB7t Hoa Thi\u1EBFt K\u1EBF",
            secondaryCta: "Xem B\u1ED9 S\u01B0u T\u1EADp",
            image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80"
          }
        },
        {
          type: "ticker",
          props: {
            items: [
              "\u{1F338} HOA T\u01AF\u01A0I NH\u1EACP KH\u1EA8U TRONG NG\xC0Y",
              "\u{1F490} THI\u1EBET K\u1EBE HOA C\u01AF\u1EDAI & S\u1EF0 KI\u1EC6N \u0110\u1ED8C B\u1EA2N",
              "\u{1F680} GIAO HOA H\u1ECEA T\u1ED0C 60 PH\xDAT N\u1ED8I TH\xC0NH",
              "\u{1F48C} T\u1EB6NG K\xC8M THI\u1EC6P THI\u1EBET K\u1EBE & B\u0102NG R\xD4N",
              "\u{1F33F} CAM K\u1EBET HOA T\u01AF\u01A0I T\u1ED0I THI\u1EC2U 3 NG\xC0Y"
            ]
          }
        },
        {
          type: "cards",
          props: {
            heading: "B\u1ED9 S\u01B0u T\u1EADp Hoa T\u01B0\u01A1i Ngh\u1EC7 Thu\u1EADt",
            subheading: "\u0110\u01B0\u1EE3c thi\u1EBFt k\u1EBF k\u1EF3 c\xF4ng t\u1EEB nh\u1EEFng c\xE0nh hoa t\u01B0\u01A1i s\u1EAFc n\xE9t nh\u1EA5t",
            items: [
              {
                title: "B\xF3 H\u1ED3ng Juliet & David Austin",
                desc: "H\u01B0\u01A1ng th\u01A1m ng\u1ECDt ng\xE0o, c\xE1nh xo\u0103n qu\xFD ph\xE1i nh\u1EADp kh\u1EA9u Anh Qu\u1ED1c k\xE8m l\xE1 b\u1EA1c khuynh di\u1EC7p.",
                badge: "Signature",
                price: "950.000\u0111",
                image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "L\u1EB5ng Lan H\u1ED3 \u0110i\u1EC7p Ho\xE0ng Gia",
                desc: "Lan h\u1ED3 \u0111i\u1EC7p v\xE0ng qu\xFD ph\xE1i k\u1EBFt h\u1EE3p \u0111\u1ED3ng ti\u1EC1n v\xE0 c\u1EA9m t\xFA c\u1EA7u r\u1EF1c r\u1EE1 \u0111\xF3n v\u01B0\u1EE3ng kh\xED.",
                badge: "Khai tr\u01B0\u01A1ng",
                price: "1.650.000\u0111",
                image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "H\u1ED9p Hoa Tulip H\xE0 Lan Pastel",
                desc: "15 c\xE0nh tulip m\xE0u h\u1ED3ng ph\u1EA5n m\u1EC1m m\u1EA1i trong h\u1ED9p nhung trang nh\xE3 k\xE8m n\u01A1 l\u1EE5a cao c\u1EA5p.",
                badge: "B\xE1n ch\u1EA1y",
                price: "880.000\u0111",
                image: "https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "B\xF3 Hoa C\u01B0\u1EDBi C\u1EA7m Tay C\xF4 D\xE2u",
                desc: "Linh lan tr\u1EAFng k\u1EBFt h\u1EE3p m\u1EABu \u0111\u01A1n v\xE0 baby s\u1EA5y gi\u1EEF tr\u1ECDn kho\u1EA3nh kh\u1EAFc thi\xEAng li\xEAng nh\u1EA5t.",
                badge: "Wedding VIP",
                price: "1.450.000\u0111",
                image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
              }
            ]
          }
        },
        {
          type: "split_feature",
          props: {
            badge: "TRI\u1EBET L\xDD S\xC1NG T\u1EA0O",
            title: "C\u1EAFm Hoa Theo C\u1EA3m X\xFAc, Kh\xF4ng R\u1EADp Khu\xF4n",
            description: "Ch\xFAng t\xF4i tin r\u1EB1ng hoa kh\xF4ng ch\u1EC9 \u0111\u1EC3 trang tr\xED, hoa thay l\u1EDDi mu\u1ED1n n\xF3i nh\u1EEFng \u0111i\u1EC1u ch\xE2n th\xE0nh nh\u1EA5t. M\u1ED7i b\xF3 hoa ra \u0111\u1EDDi l\xE0 duy nh\u1EA5t, g\xF3i tr\u1ECDn t\xE2m t\u01B0 b\u1EA1n mu\u1ED1n g\u1EEDi trao.",
            image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80",
            bullets: [
              "Ch\u1EC9 s\u1EED d\u1EE5ng hoa m\u1EDBi c\u1EAFt s\xE1ng s\u1EDBm t\u1EEB v\u01B0\u1EDDn \u0110\xE0 L\u1EA1t v\xE0 nh\u1EADp kh\u1EA9u H\xE0 Lan",
              "T\u1EA1o h\xECnh theo phong c\xE1ch c\u1EAFm hoa t\u1EF1 nhi\xEAn m\u1ED9c m\u1EA1c ch\xE2u \xC2u",
              "Ch\u1EE5p \u1EA3nh g\u1EEDi b\u1EA1n duy\u1EC7t th\u1EF1c t\u1EBF tr\u01B0\u1EDBc khi giao h\xE0ng t\u1EADn n\u01A1i"
            ],
            cta: "T\xECm hi\u1EC3u th\xEAm"
          }
        },
        {
          type: "gallery",
          props: {
            heading: "Kho\u1EA3nh Kh\u1EAFc Hoa Trao Tay",
            subheading: "H\xECnh \u1EA3nh th\u1EF1c t\u1EBF \u0111\u01B0\u1EE3c kh\xE1ch h\xE0ng ghi l\u1EA1i trong nh\u1EEFng d\u1ECBp k\u1EF7 ni\u1EC7m thi\xEAng li\xEAng",
            items: [
              { image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80", title: "Ng\xE0y Chung \u0110\xF4i", desc: "Kh\xF4ng gian ti\u1EC7c c\u01B0\u1EDBi hoa t\u01B0\u01A1i r\u1EF1c r\u1EE1" },
              { image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80", title: "H\u1ED3ng David Austin", desc: "Trao g\u1EEDi y\xEAu th\u01B0\u01A1ng ng\xE0y sinh nh\u1EADt" },
              { image: "https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=800&q=80", title: "Tulip H\xE0 Lan M\xF9a Xu\xE2n", desc: "M\xF3n qu\xE0 tinh t\u1EBF v\xE0 thanh l\u1ECBch" },
              { image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80", title: "L\u1EB5ng Ch\xFAc M\u1EEBng", desc: "Kh\u1EDFi \u0111\u1EA7u h\u1ED3ng ph\xE1t v\xE0 th\u1ECBnh v\u01B0\u1EE3ng" }
            ]
          }
        },
        {
          type: "form",
          props: {
            heading: "\u0110\u1EB7t Hoa Thi\u1EBFt K\u1EBF Theo D\u1ECBp",
            subheading: "\u0110\u1EC3 l\u1EA1i y\xEAu c\u1EA7u v\xE0 ng\xE2n s\xE1ch, florist c\u1EE7a ch\xFAng t\xF4i s\u1EBD t\u01B0 v\u1EA5n m\u1EABu hoa \u01B0ng \xFD nh\u1EA5t",
            submitLabel: "G\u1EEDi Y\xEAu C\u1EA7u \u0110\u1EB7t Hoa",
            fields: [
              { label: "H\u1ECD v\xE0 t\xEAn c\u1EE7a b\u1EA1n", type: "text" },
              { label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i nh\u1EADn hoa", type: "tel" },
              { label: "D\u1ECBp t\u1EB7ng & Ng\xE2n s\xE1ch d\u1EF1 ki\u1EBFn", type: "text" },
              { label: "L\u1EDDi nh\u1EAFn tr\xEAn thi\u1EC7p / L\u1EDDi ch\xFAc", type: "textarea" }
            ]
          }
        },
        {
          type: "footer",
          props: {
            text: `\xA9 2026 ${cleanTitle}. Ti\u1EC7m Hoa Ngh\u1EC7 Thu\u1EADt & Thi\u1EBFt K\u1EBF \u0110\u1ED9c B\u1EA3n.`,
            links: [
              { label: "Trang ch\u1EE7", href: "#" },
              { label: "B\u1ED9 s\u01B0u t\u1EADp", href: "#" },
              { label: "Hoa c\u01B0\u1EDBi", href: "#" },
              { label: "Li\xEAn h\u1EC7", href: "#" }
            ]
          }
        }
      ]
    };
  }
  if (style === "artisan") {
    const primary = "#b45309";
    const bg = "#faf7f2";
    const fg = "#1f1610";
    const heroImg = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80";
    return {
      theme: {
        primary,
        background: bg,
        text: fg,
        font: "Playfair Display",
        style: "artisan"
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "split",
            badge: "\u2615 H\u01AF\u01A0NG V\u1ECA RANG XAY TH\u1EE6 C\xD4NG",
            title: cleanTitle,
            subtitle: "H\u1EA1t c\xE0 ph\xEA \u0111\u1EB7c s\u1EA3n rang m\u1ED9c m\u1EBB nh\u1ECF m\u1ED7i tu\u1EA7n, l\u01B0u gi\u1EEF tr\u1ECDn v\u1EB9n h\u01B0\u01A1ng v\u1ECB m\u1ED9c m\u1EA1c v\xE0 s\u1EF1 thanh t\u0129nh c\u1EE7a \u0111\u1EA5t tr\u1EDDi.",
            cta: "Kh\xE1m Ph\xE1 Menu Th\u1EE9c U\u1ED1ng",
            secondaryCta: "T\xECm Hi\u1EC3u Kh\xF4ng Gian",
            image: heroImg
          }
        },
        {
          type: "ticker",
          props: {
            items: [
              "H\u1EA0T ARABICA C\u1EA6U \u0110\u1EA4T \u0110\u1EB6C T\u1EA2",
              "B\xC1NH T\u01AF\u01A0I N\u01AF\u1EDANG N\xD3NG M\u1ED6I S\xC1NG",
              "KH\xD4NG GIAN Y\xCAN B\xCCNH M\u1ED8C M\u1EA0C",
              "PHA PHIN & POUR OVER TH\u1EE6 C\xD4NG",
              "100% NGUY\xCAN B\u1EA2N KH\xD4NG PH\u1EE4 GIA"
            ]
          }
        },
        {
          type: "cards",
          props: {
            heading: "Th\u1EE9c U\u1ED1ng & M\xF3n B\xE1n Ch\u1EA1y",
            subheading: "\u0110\u01B0\u1EE3c ch\u1EAFt l\u1ECDc t\u1EEB nh\u1EEFng nguy\xEAn li\u1EC7u s\u1EA1ch v\xE0 c\xF4ng th\u1EE9c pha ch\u1EBF th\u1EE7 c\xF4ng",
            items: [
              {
                title: "C\xE0 Ph\xEA Cold Brew Cam V\xE0ng",
                desc: "\u1EE6 l\u1EA1nh 16 ti\u1EBFng t\u1EEB h\u1EA1t Arabica C\u1EA7u \u0110\u1EA5t c\xF9ng h\u01B0\u01A1ng cam thanh m\xE1t s\u1EA3ng kho\xE1i.",
                badge: "Signature",
                price: "65.000\u0111",
                image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "B\xE1nh Croissant B\u01A1 Normandy N\xF3ng",
                desc: "Ng\xE0n l\u1EDBp gi\xF2n r\u1EE5m v\u1EDBi b\u01A1 Ph\xE1p nguy\xEAn ch\u1EA5t th\u01A1m n\u1ED3ng n\xE0n n\u01B0\u1EDBng m\u1EDBi m\u1ED7i s\xE1ng.",
                badge: "B\xE1nh t\u01B0\u01A1i",
                price: "48.000\u0111",
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Tr\xE0 \u0110\xE0o Cam S\u1EA3 M\u1EADt Ong R\u1EEBng",
                desc: "Tr\xE0 th\u1EA3o m\u1ED9c th\u01A1m l\xE0nh thanh nhi\u1EC7t, v\u1ECB ng\u1ECDt thanh t\u1EF1 nhi\xEAn t\u1EEB m\u1EADt ong r\u1EEBng nguy\xEAn ch\u1EA5t.",
                badge: "Thanh m\xE1t",
                price: "58.000\u0111",
                image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80"
              }
            ]
          }
        },
        {
          type: "menu",
          props: {
            heading: "Th\u1EF1c \u0110\u01A1n \u0110\u1EADm Ch\u1EA5t Ngh\u1EC7 Nh\xE2n",
            subheading: "\u0110\u01B0\u1EE3c ch\u1EAFt l\u1ECDc k\u1EF9 l\u01B0\u1EE1ng t\u1EEB ngu\u1ED3n nguy\xEAn li\u1EC7u th\u01B0\u1EE3ng h\u1EA1ng",
            categories: [
              {
                name: "C\xE0 Ph\xEA & \u0110\u1ED3 U\u1ED1ng",
                items: [
                  { name: "Espresso Con Panna Th\u01B0\u1EE3ng H\u1EA1ng", desc: "C\u1ED1t c\xE0 ph\xEA \u0111\u1EADm s\xE2u k\u1EBFt h\u1EE3p l\u1EDBp kem t\u01B0\u01A1i b\xE9o m\u1ECBn th\u1EE7 c\xF4ng", price: "55.000\u0111", badge: "Best" },
                  { name: "C\xE0 Ph\xEA Mu\u1ED1i X\u1EE9 Hu\u1EBF", desc: "V\u1ECB \u0111\u1EAFng \u0111\u01B0\u1EE3m quy\u1EC7n kem b\xE9o m\u1EB7n m\xF2i kh\xF3 qu\xEAn", price: "45.000\u0111" },
                  { name: "Matcha Latte Nh\u1EADt B\u1EA3n", desc: "B\u1ED9t tr\xE0 Uji nguy\xEAn ch\u1EA5t \u0111\xE1nh c\xF9ng s\u1EEFa h\u1EA1t y\u1EBFn m\u1EA1ch", price: "60.000\u0111" }
                ]
              }
            ]
          }
        },
        {
          type: "split_feature",
          props: {
            title: "S\u1EF1 T\u1EC9 M\u1EC9 Trong T\u1EEBng Kh\xE2u Th\u1EF1c Hi\u1EC7n",
            description: "T\u1EEB tuy\u1EC3n ch\u1ECDn ngu\u1ED3n nguy\xEAn li\u1EC7u xanh s\u1EA1ch \u0111\u1EBFn c\xF4ng \u0111o\u1EA1n ch\u1EBF t\xE1c b\u1EB1ng tay, t\u1EA5t c\u1EA3 \u0111\u1EC1u tu\xE2n th\u1EE7 s\u1EF1 ch\xE2n th\xE0nh v\xE0 tinh th\u1EA7n ngh\u1EC7 nh\xE2n nguy\xEAn b\u1EA3n.",
            image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
            bullets: [
              "H\u1EA1t c\xE0 ph\xEA ch\u1EC9 rang v\xE0 s\u1EED d\u1EE5ng trong v\xF2ng 14 ng\xE0y",
              "B\u1EA3o qu\u1EA3n ho\xE0n to\xE0n t\u1EF1 nhi\xEAn, kh\xF4ng ch\u1EA5t ph\u1EE5 gia \u0111\u1ED9c h\u1EA1i",
              "Kh\xF4ng gian m\u1ED9c m\u1EA1c y\xEAn b\xECnh l\xFD t\u01B0\u1EDFng \u0111\u1EC3 \u0111\u1ECDc s\xE1ch v\xE0 l\xE0m vi\u1EC7c"
            ]
          }
        },
        {
          type: "form",
          props: {
            heading: "\u0110\u1EB7t B\xE0n Ho\u1EB7c \u0110\u1EB7t Ti\u1EC7c Nh\u1ECF",
            subheading: "\u0110\u1EC3 l\u1EA1i th\xF4ng tin, ch\xFAng t\xF4i s\u1EBD li\xEAn h\u1EC7 chu\u1EA9n b\u1ECB chu \u0111\xE1o nh\u1EA5t cho b\u1EA1n",
            submitLabel: "X\xE1c Nh\u1EADn \u0110\u1EB7t B\xE0n",
            fields: [
              { label: "H\u1ECD v\xE0 t\xEAn c\u1EE7a b\u1EA1n", type: "text" },
              { label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i li\xEAn h\u1EC7", type: "tel" },
              { label: "S\u1ED1 ng\u01B0\u1EDDi & gi\u1EDD gh\xE9 qu\xE1n", type: "textarea" }
            ]
          }
        },
        {
          type: "footer",
          props: {
            text: `\xA9 2026 ${cleanTitle}. \u0110\u1EADm ch\u1EA5t th\u1EE7 c\xF4ng & t\u1EA5m l\xF2ng ngh\u1EC7 nh\xE2n.`,
            links: [
              { label: "Trang ch\u1EE7", href: "#" },
              { label: "Th\u1EF1c \u0111\u01A1n", href: "#" },
              { label: "Kh\xF4ng gian", href: "#" },
              { label: "Li\xEAn h\u1EC7", href: "#" }
            ]
          }
        }
      ]
    };
  }
  const isSushi = p.includes("sushi") || p.includes("nha hang") || p.includes("omakase") || p.includes("am thuc") || p.includes("hai san");
  if (isSushi) {
    return {
      theme: {
        primary: "#dc2626",
        background: "#0c0a09",
        text: "#fafaf9",
        font: "Playfair Display",
        style: "luxury"
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "centered",
            badge: "\u{1F363} OMAKASE TH\u01AF\u1EE2NG H\u1EA0NG NH\u1EACT B\u1EA2N",
            title: cleanTitle,
            subtitle: "H\u1EA3i s\u1EA3n t\u01B0\u01A1i s\u1ED1ng v\u1EADn chuy\u1EC3n h\u1ECFa t\u1ED1c t\u1EEB ch\u1EE3 c\xE1 Toyosu Tokyo, k\u1EBFt h\u1EE3p t\xE0i hoa h\u01A1n 20 n\u0103m c\u1EE7a b\u1EBFp tr\u01B0\u1EDFng ng\u01B0\u1EDDi Nh\u1EADt.",
            cta: "\u0110\u1EB7t B\xE0n Tr\u1EF1c Tuy\u1EBFn",
            secondaryCta: "Xem Th\u1EF1c \u0110\u01A1n M\xF9a N\xE0y",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80"
          }
        },
        {
          type: "ticker",
          props: {
            items: [
              "H\u1EA2I S\u1EA2N T\u01AF\u01A0I BAY TRONG NG\xC0Y T\u1EEA NH\u1EACT B\u1EA2N",
              "B\xD2 WAGYU A5 CH\u1EE8NG NH\u1EACN MIYAZAKI",
              "PH\xD2NG VIP RI\xCANG T\u01AF CHU\u1EA8N PHONG C\xC1CH T\u1ED0I GI\u1EA2N",
              "B\u1EBEP TR\u01AF\u1EDENG 25 N\u0102M KINH NGHI\u1EC6M T\u1EA0I GINZA",
              "B\u1ED8 S\u01AFU T\u1EACP R\u01AF\u1EE2U SAKE TH\u01AF\u1EE2NG H\u1EA0NG"
            ]
          }
        },
        {
          type: "cards",
          props: {
            heading: "Tuy\u1EC7t T\xE1c \u1EA8m Th\u1EF1c T\u01B0\u01A1i Ngon",
            subheading: "M\u1ED7i m\xF3n \u0103n l\xE0 s\u1EF1 k\u1EBFt tinh c\u1EE7a nguy\xEAn li\u1EC7u hi\u1EBFm c\xF3 v\xE0 k\u1EF9 ngh\u1EC7 \u0111i\xEAu luy\u1EC7n",
            items: [
              {
                title: "Nigiri B\xF2 Wagyu A5 Truffle",
                desc: "Th\u1ECBt b\xF2 n\u01B0\u1EDBng t\xE1i m\u1EB7t m\u1EE1 tan ch\u1EA3y tr\xEAn \u0111\u1EA7u l\u01B0\u1EE1i c\xF9ng s\u1ED1t n\u1EA5m Truffle \u0111en th\u01A1m n\u1ED3ng.",
                badge: "Signature",
                price: "320.000\u0111 / mi\u1EBFng",
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Sashimi Otoro B\u1EE5ng C\xE1 H\u1ED3i Xanh",
                desc: "Th\u1EDB m\u1EE1 v\xE2n c\u1EA9m th\u1EA1ch ng\u1EADy b\xE9o, c\u1EAFt d\xE0y nguy\xEAn b\u1EA3n gi\u1EEF tr\u1ECDn v\u1ECB ng\u1ECDt \u0111\u1EA1i d\u01B0\u01A1ng.",
                badge: "B\xE1n ch\u1EA1y",
                price: "850.000\u0111 / set",
                image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "C\u01A1m Nh\xEDm Bi\u1EC3n Uni Hokkaido",
                desc: "Tr\u1EE9ng nh\xEDm bi\u1EC3n v\xE0ng \u01B0\u01A1m b\xE9o ng\u1EADy \u0103n k\xE8m rong bi\u1EC3n n\u01B0\u1EDBng gi\xF2n v\xE0 wasabi t\u01B0\u01A1i gi\xE3 tay.",
                badge: "M\xF9a n\xE0y",
                price: "720.000\u0111 / ph\u1EA7n",
                image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80"
              }
            ]
          }
        },
        {
          type: "split_feature",
          props: {
            badge: "TRI\u1EBET L\xDD OMAKASE",
            title: "Tr\u1ECDn Ni\u1EC1m Tin V\xE0o \u0110\xF4i Tay B\u1EBFp Tr\u01B0\u1EDFng",
            description: "T\u1EA1i nh\xE0 h\xE0ng c\u1EE7a ch\xFAng t\xF4i, th\u1EF1c kh\xE1ch kh\xF4ng g\u1ECDi m\xF3n theo danh m\u1EE5c th\xF4ng th\u01B0\u1EDDng. B\u1EBFp tr\u01B0\u1EDFng s\u1EBD l\u1EAFng nghe kh\u1EA9u v\u1ECB c\u1EE7a b\u1EA1n v\xE0 thi\u1EBFt k\u1EBF m\u1ED9t h\xE0nh tr\xECnh \u1EA9m th\u1EF1c ri\xEAng bi\u1EC7t.",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
            bullets: [
              "G\u1EA1o Koshihikari th\u01B0\u1EE3ng h\u1EA1ng n\u1EA5u b\u1EB1ng n\u01B0\u1EDBc su\u1ED1i kho\xE1ng t\u1EF1 nhi\xEAn",
              "Wasabi t\u01B0\u01A1i m\xE0i b\u1EB1ng da c\xE1 \u0111u\u1ED1i truy\u1EC1n th\u1ED1ng Shizuoka",
              "Kh\xF4ng gian qu\u1EA7y bar g\u1ED7 Hinoki th\u01A1m d\u1ECBu v\xE0 \u1EA5m c\xFAng"
            ],
            cta: "\u0110\u1EB7t ch\u1ED7 tr\u01B0\u1EDBc"
          }
        },
        {
          type: "form",
          props: {
            heading: "\u0110\u1EB7t Ch\u1ED7 Tr\u1EF1c Tuy\u1EBFn & Ph\xF2ng Ti\u1EC7c VIP",
            subheading: "Vui l\xF2ng \u0111\u1EB7t tr\u01B0\u1EDBc \xEDt nh\u1EA5t 24 gi\u1EDD \u0111\u1EC3 ch\xFAng t\xF4i chu\u1EA9n b\u1ECB h\u1EA3i s\u1EA3n t\u01B0\u01A1i ngon nh\u1EA5t",
            submitLabel: "X\xE1c Nh\u1EADn Gi\u1EEF Ch\u1ED7",
            fields: [
              { label: "H\u1ECD v\xE0 t\xEAn c\u1EE7a b\u1EA1n", type: "text" },
              { label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i li\xEAn h\u1EC7", type: "tel" },
              { label: "S\u1ED1 l\u01B0\u1EE3ng kh\xE1ch & Th\u1EDDi gian \u0111\u1EBFn", type: "text" },
              { label: "Ghi ch\xFA d\u1ECB \u1EE9ng ho\u1EB7c y\xEAu c\u1EA7u ri\xEAng", type: "textarea" }
            ]
          }
        },
        {
          type: "footer",
          props: {
            text: `\xA9 2026 ${cleanTitle}. Tinh hoa \u1EA9m th\u1EF1c x\u1EE9 s\u1EDF Ph\xF9 Tang.`,
            links: [
              { label: "Th\u1EF1c \u0111\u01A1n Omakase", href: "#" },
              { label: "R\u01B0\u1EE3u Sake", href: "#" },
              { label: "Kh\xF4ng gian", href: "#" },
              { label: "\u0110\u1EB7t b\xE0n", href: "#" }
            ]
          }
        }
      ]
    };
  }
  const isCourse = p.includes("khoa hoc") || p.includes("lap trinh") || p.includes("hoc") || p.includes("dao tao") || p.includes("giao duc");
  if (isCourse) {
    return {
      theme: {
        primary: "#2563eb",
        secondary: "#60a5fa",
        accent: "#f59e0b",
        background: "#0b1329",
        text: "#f8fafc",
        font: "Be Vietnam Pro",
        style: "bento"
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "split",
            badge: "\u{1F680} L\u1ED8 TR\xCCNH \u0110\xC0O T\u1EA0O TH\u1EF0C CHI\u1EBEN 2026",
            title: cleanTitle,
            subtitle: "H\u1ECDc t\u1EEB chuy\xEAn gia \u0111ang l\xE0m vi\u1EC7c t\u1EA1i c\xE1c t\u1EADp \u0111o\xE0n c\xF4ng ngh\u1EC7 l\u1EDBn. Cam k\u1EBFt h\u1ED7 tr\u1EE3 vi\u1EC7c l\xE0m v\u1EDBi m\u1EE9c l\u01B0\u01A1ng h\u1EA5p d\u1EABn sau khi t\u1ED1t nghi\u1EC7p.",
            cta: "\u0110\u0103ng K\xFD T\u01B0 V\u1EA5n Kh\xF3a H\u1ECDc",
            secondaryCta: "Xem L\u1ED9 Tr\xECnh Chi Ti\u1EBFt",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
          }
        },
        {
          type: "ticker",
          props: {
            items: [
              "\u{1F525} 98% H\u1ECCC VI\xCAN C\xD3 VI\u1EC6C L\xC0M SAU 3 TH\xC1NG",
              "\u{1F4BB} H\u01A0N 50+ D\u1EF0 \xC1N TH\u1EF0C CHI\u1EBEN \u0110\u01AFA V\xC0O CV",
              "\u{1F468}\u200D\u{1F3EB} MENTOR 1 K\xC8M 1 H\u1ED6 TR\u1EE2 CODE H\xC0NG NG\xC0Y",
              "\u{1F381} T\u1EB6NG B\u1ED8 T\xC0I LI\u1EC6U & CODE M\u1EAAU B\u1EA2N QUY\u1EC0N",
              "\u{1F3E2} K\u1EBET N\u1ED0I H\u01A0N 400+ DOANH NGHI\u1EC6P TUY\u1EC2N D\u1EE4NG"
            ]
          }
        },
        {
          type: "cards",
          props: {
            heading: "C\xE1c Kh\xF3a H\u1ECDc Ti\xEAu Bi\u1EC3u & Chuy\xEAn S\xE2u",
            subheading: "\u0110\u01B0\u1EE3c c\u1EADp nh\u1EADt c\xF4ng ngh\u1EC7 m\u1EDBi nh\u1EA5t theo nhu c\u1EA7u th\u1EF1c t\u1EBF c\u1EE7a th\u1ECB tr\u01B0\u1EDDng",
            items: [
              {
                title: "Frontend React & TypeScript Pro",
                desc: "L\xE0m ch\u1EE7 React 19, Next.js App Router, TailwindCSS v\xE0 x\xE2y d\u1EF1ng c\xE1c Web App ph\u1EE9c t\u1EA1p.",
                badge: "B\xE1n ch\u1EA1y nh\u1EA5t",
                price: "4.500.000\u0111",
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Backend Node.js & Microservices",
                desc: "Thi\u1EBFt k\u1EBF RESTful API, NestJS, Docker, Redis, Message Queue v\xE0 c\u01A1 s\u1EDF d\u1EEF li\u1EC7u ph\xE2n t\xE1n.",
                badge: "Hot 2026",
                price: "5.200.000\u0111",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Fullstack Web & AI Integration",
                desc: "K\u1EBFt n\u1ED1i LLM, x\xE2y d\u1EF1ng \u1EE9ng d\u1EE5ng AI t\u1EF1 \u0111\u1ED9ng h\xF3a v\xE0 tri\u1EC3n khai Cloudflare / AWS.",
                badge: "Chuy\xEAn s\xE2u VIP",
                price: "7.800.000\u0111",
                image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
              }
            ]
          }
        },
        {
          type: "stats",
          props: {
            heading: "NH\u1EEENG CON S\u1ED0 BI\u1EBET N\xD3I",
            items: [
              { value: "12,000+", label: "H\u1ECDc vi\xEAn \u0111\xE3 t\u1ED1t nghi\u1EC7p" },
              { value: "98.2%", label: "T\u1EF7 l\u1EC7 c\xF3 vi\u1EC7c l\xE0m \u0111\xFAng ng\xE0nh" },
              { value: "15-25tr", label: "M\u1EE9c l\u01B0\u01A1ng kh\u1EDFi \u0111i\u1EC3m trung b\xECnh" },
              { value: "400+", label: "Doanh nghi\u1EC7p \u0111\u1ED1i t\xE1c tuy\u1EC3n d\u1EE5ng" }
            ]
          }
        },
        {
          type: "table",
          props: {
            heading: "So S\xE1nh L\u1ED9 Tr\xECnh \u0110\xE0o T\u1EA1o",
            subheading: "L\u1EF1a ch\u1ECDn h\xECnh th\u1EE9c h\u1ECDc t\u1EADp ph\xF9 h\u1EE3p nh\u1EA5t v\u1EDBi qu\u1EF9 th\u1EDDi gian c\u1EE7a b\u1EA1n",
            columns: ["Quy\u1EC1n L\u1EE3i & H\u1ED7 Tr\u1EE3", "L\u1EDBp T\u1EF1 H\u1ECDc C\xF3 Video", "L\u1EDBp Mentor K\xE8m 1-1"],
            rows: [
              ["Video b\xE0i gi\u1EA3ng Full HD tr\u1ECDn \u0111\u1EDDi", "C\xF3 (Truy c\u1EADp 24/7)", "C\xF3 (C\u1EADp nh\u1EADt li\xEAn t\u1EE5c)"],
              ["H\u1ED7 tr\u1EE3 review code tr\u1EF1c ti\u1EBFp", "H\u1ECFi \u0111\xE1p qua forum", "1-1 h\xE0ng tu\u1EA7n c\xF9ng Tech Lead"],
              ["B\xE0i t\u1EADp d\u1EF1 \xE1n th\u1EF1c t\u1EBF", "5 d\u1EF1 \xE1n c\u01A1 b\u1EA3n", "12 d\u1EF1 \xE1n l\u1EDBn chu\u1EA9n doanh nghi\u1EC7p"],
              ["H\u1ED7 tr\u1EE3 k\u1EBFt n\u1ED1i ph\u1ECFng v\u1EA5n", "H\u1ED7 tr\u1EE3 s\u1EEDa CV", "Cam k\u1EBFt k\u1EBFt n\u1ED1i tr\u1EF1c ti\u1EBFp HR"]
            ]
          }
        },
        {
          type: "form",
          props: {
            heading: "Nh\u1EADn L\u1ED9 Tr\xECnh H\u1ECDc & \u01AFu \u0110\xE3i H\u1ECDc B\u1ED5ng 30%",
            subheading: "\u0110\u1EC3 l\u1EA1i th\xF4ng tin \u0111\u1EC3 \u0111\u01B0\u1EE3c \u0111\u1ED9i ng\u0169 tuy\u1EC3n sinh t\u01B0 v\u1EA5n l\u1ED9 tr\xECnh ph\xF9 h\u1EE3p v\u1EDBi xu\u1EA5t ph\xE1t \u0111i\u1EC3m c\u1EE7a b\u1EA1n",
            submitLabel: "\u0110\u0103ng K\xFD Nh\u1EADn T\u01B0 V\u1EA5n Ngay",
            fields: [
              { label: "H\u1ECD v\xE0 t\xEAn h\u1ECDc vi\xEAn", type: "text" },
              { label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i li\xEAn h\u1EC7", type: "tel" },
              { label: "Kh\xF3a h\u1ECDc b\u1EA1n \u0111ang quan t\xE2m", type: "text" }
            ]
          }
        },
        {
          type: "footer",
          props: {
            text: `\xA9 2026 ${cleanTitle}. \u0110\xE0o t\u1EA1o l\u1EADp tr\xECnh th\u1EF1c chi\u1EBFn chu\u1EA9n qu\u1ED1c t\u1EBF.`,
            links: [
              { label: "Kh\xF3a h\u1ECDc", href: "#" },
              { label: "L\u1ED9 tr\xECnh", href: "#" },
              { label: "H\u1ECDc b\u1ED5ng", href: "#" },
              { label: "Tuy\u1EC3n d\u1EE5ng", href: "#" }
            ]
          }
        }
      ]
    };
  }
  if (style === "bento") {
    return {
      theme: {
        primary: "#6366f1",
        background: "#090d16",
        text: "#f8fafc",
        font: "Plus Jakarta Sans",
        style: "bento"
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "centered",
            badge: "\u26A1 TH\u1EBE H\u1EC6 N\u1EC0N T\u1EA2NG TI\u1EBEP THEO",
            title: cleanTitle,
            subtitle: "H\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng h\xF3a th\xF4ng minh gi\xFAp \u0111\u1ED9i ng\u0169 c\u1EE7a b\u1EA1n \u0111\u1EA9y nhanh ti\u1EBFn \u0111\u1ED9 g\u1EA5p 10 l\u1EA7n v\u1EDBi \u0111\u1ED9 tin c\u1EADy tuy\u1EC7t \u0111\u1ED1i.",
            cta: "Tr\u1EA3i Nghi\u1EC7m Mi\u1EC5n Ph\xED 14 Ng\xE0y",
            secondaryCta: "Xem Demo Tr\u1EF1c Ti\u1EBFp",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
            align: "center"
          }
        },
        {
          type: "ticker",
          props: {
            items: ["99.99% Uptime", "50,000+ Teams To\xE0n C\u1EA7u", "B\u1EA3o M\u1EADt SOC-2 Type II", "T\xEDch H\u1EE3p API Kh\xF4ng Gi\u1EDBi H\u1EA1n", "H\u1ED7 Tr\u1EE3 K\u1EF9 Thu\u1EADt 24/7"]
          }
        },
        {
          type: "bento",
          props: {
            heading: "Ki\u1EBFn Tr\xFAc T\xEDnh N\u0103ng To\xE0n Di\u1EC7n",
            subheading: "\u0110\u01B0\u1EE3c thi\u1EBFt k\u1EBF t\u1ED1i \u01B0u cho c\xE1c nh\xF3m ph\xE1t tri\u1EC3n v\xE0 doanh nghi\u1EC7p hi\u1EC7n \u0111\u1EA1i",
            items: [
              {
                title: "Ph\xE2n T\xEDch D\u1EEF Li\u1EC7u Th\u1EDDi Gian Th\u1EF1c",
                desc: "Theo d\xF5i m\u1ECDi ch\u1EC9 s\u1ED1 kinh doanh v\xE0 hi\u1EC7u su\u1EA5t v\u1EDBi bi\u1EC3u \u0111\u1ED3 c\u1EADp nh\u1EADt t\u1EEBng mili-gi\xE2y.",
                badge: "Real-time AI",
                icon: "\u26A1",
                span: "wide",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "B\u1EA3o M\u1EADt Chu\u1EA9n Doanh Nghi\u1EC7p",
                desc: "M\xE3 h\xF3a c\u1EA5p cao End-to-End b\u1EA3o v\u1EC7 quy\u1EC1n ri\xEAng t\u01B0 v\xE0 t\xE0i s\u1EA3n d\u1EEF li\u1EC7u c\u1EE7a b\u1EA1n.",
                badge: "M\xE3 h\xF3a AES-256",
                icon: "\u{1F512}",
                span: "normal"
              },
              {
                title: "H\u01A1n 120+ T\xEDch H\u1EE3p S\u1EB5n",
                desc: "K\u1EBFt n\u1ED1i tr\u01A1n tru v\u1EDBi GitHub, Slack, Notion, Stripe ch\u1EC9 trong 2 c\xFA click chu\u1ED9t.",
                badge: "Instant Connect",
                icon: "\u{1F50C}",
                span: "normal"
              },
              {
                title: "T\u1EF1 \u0110\u1ED9ng H\xF3a Workflow Th\xF4ng Minh",
                desc: "Thi\u1EBFt l\u1EADp lu\u1ED3ng x\u1EED l\xFD kh\xF4ng c\u1EA7n vi\u1EBFt m\xE3, gi\u1EA3i ph\xF3ng th\u1EDDi gian cho c\xF4ng vi\u1EC7c s\xE1ng t\u1EA1o c\u1ED1t l\xF5i.",
                badge: "No-Code Flow",
                icon: "\u{1F916}",
                span: "tall"
              }
            ]
          }
        },
        {
          type: "stats",
          props: {
            heading: "Con S\u1ED1 Minh Ch\u1EE9ng Cho S\u1EE9c M\u1EA1nh",
            items: [
              { value: "10x", label: "T\u1ED1c \u0111\u1ED9 tri\u1EC3n khai d\u1EF1 \xE1n" },
              { value: "99.99%", label: "Cam k\u1EBFt SLA ho\u1EA1t \u0111\u1ED9ng \u1ED5n \u0111\u1ECBnh" },
              { value: "450k+", label: "T\xE1c v\u1EE5 t\u1EF1 \u0111\u1ED9ng m\u1ED7i ng\xE0y" },
              { value: "4.9/5", label: "\u0110i\u1EC3m \u0111\xE1nh gi\xE1 t\u1EEB 1,200+ kh\xE1ch h\xE0ng" }
            ]
          }
        },
        {
          type: "split_feature",
          props: {
            title: "H\u1EE3p T\xE1c L\xE0m Vi\u1EC7c Nh\xF3m \u0110\u1ED3ng B\u1ED9",
            description: "X\xF3a b\u1ECF r\xE0o c\u1EA3n giao ti\u1EBFp gi\u1EEFa c\xE1c ph\xF2ng ban. M\u1ECDi th\xE0nh vi\xEAn c\xF9ng theo d\xF5i m\u1ED9t ngu\u1ED3n d\u1EEF li\u1EC7u duy nh\u1EA5t v\xE0 c\u1EADp nh\u1EADt t\u1EE9c th\xEC.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            bullets: [
              "Ph\xE2n quy\u1EC1n \u0111a c\u1EA5p \u0111\u1ED9 RBAC nghi\xEAm ng\u1EB7t",
              "L\u1ECBch s\u1EED ho\u1EA1t \u0111\u1ED9ng v\xE0 sao l\u01B0u t\u1EF1 \u0111\u1ED9ng kh\xF4ng gi\u1EDBi h\u1EA1n",
              "Th\xF4ng b\xE1o th\xF4ng minh qua webhook, Telegram v\xE0 Email"
            ]
          }
        },
        {
          type: "form",
          props: {
            heading: "B\u1EAFt \u0110\u1EA7u D\xF9ng Th\u1EED Ngay H\xF4m Nay",
            subheading: "Kh\xF4ng c\u1EA7n th\u1EBB t\xEDn d\u1EE5ng. C\xE0i \u0111\u1EB7t ho\xE0n t\u1EA5t ch\u1EC9 trong 3 ph\xFAt.",
            submitLabel: "\u0110\u0103ng K\xFD T\xE0i Kho\u1EA3n Pro",
            fields: [
              { label: "Email c\xF4ng vi\u1EC7c c\u1EE7a b\u1EA1n", type: "email" },
              { label: "T\xEAn t\u1ED5 ch\u1EE9c / c\xF4ng ty", type: "text" },
              { label: "Quy m\xF4 \u0111\u1ED9i ng\u0169 (th\xE0nh vi\xEAn)", type: "text" }
            ]
          }
        },
        {
          type: "footer",
          props: {
            text: `\xA9 2026 ${cleanTitle}. N\u1EC1n t\u1EA3ng c\xF4ng ngh\u1EC7 s\u1ED1 th\u1EBF h\u1EC7 m\u1EDBi.`,
            links: [
              { label: "T\xEDnh n\u0103ng", href: "#" },
              { label: "T\xE0i li\u1EC7u API", href: "#" },
              { label: "B\u1EA3ng gi\xE1", href: "#" },
              { label: "B\u1EA3o m\u1EADt", href: "#" }
            ]
          }
        }
      ]
    };
  }
  if (style === "luxury") {
    return {
      theme: {
        primary: "#d4af37",
        background: "#0b0d11",
        text: "#f5f3eb",
        font: "Playfair Display",
        style: "luxury"
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "split",
            badge: "THE EPITOME OF EXCELLENCE",
            title: cleanTitle,
            subtitle: "Ki\u1EC7t t\xE1c \u0111\u01B0\u1EE3c ki\u1EBFn t\u1EA1o ri\xEAng cho nh\u1EEFng ch\u1EE7 nh\xE2n th\u1EA5u hi\u1EC3u gi\xE1 tr\u1ECB c\u1EE7a s\u1EF1 \u0111\u1ED9c b\u1EA3n v\xE0 v\u1EBB \u0111\u1EB9p tr\u01B0\u1EDDng t\u1ED3n qua th\u1EDDi gian.",
            cta: "Kh\xE1m Ph\xE1 B\u1ED9 S\u01B0u T\u1EADp",
            secondaryCta: "\u0110\u1EB7t L\u1ECBch Th\u01B0\u1EDFng L\xE3m",
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
            align: "left"
          }
        },
        {
          type: "quote",
          props: {
            quote: "S\u1EF1 xa x\u1EC9 \u0111\xEDch th\u1EF1c kh\xF4ng n\u1EB1m \u1EDF vi\u1EC7c g\xE2y \u1EA5n t\u01B0\u1EE3ng v\u1EDBi s\u1ED1 \u0111\xF4ng, m\xE0 l\xE0 mang \u0111\u1EBFn c\u1EA3m x\xFAc th\u0103ng hoa thu\u1EA7n khi\u1EBFt cho ng\u01B0\u1EDDi th\u01B0\u1EDFng th\u1EE9c.",
            author: "Gi\xE1m \u0110\u1ED1c S\xE1ng T\u1EA1o",
            role: "Tr\u01B0\u1EDFng ban c\u1ED1 v\u1EA5n ngh\u1EC7 thu\u1EADt"
          }
        },
        {
          type: "gallery",
          props: {
            heading: "Tuy\u1EC3n T\u1EADp T\xE1c Ph\u1EA9m \u0110\u1ED9c B\u1EA3n",
            subheading: "Ch\u1EAFt l\u1ECDc t\u1EEB nh\u1EEFng ch\u1EA5t li\u1EC7u qu\xFD hi\u1EBFm h\xE0ng \u0111\u1EA7u th\u1EBF gi\u1EDBi",
            items: [
              {
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                title: "Ki\u1EBFn Tr\xFAc & Kh\xF4ng Gian Th\u01B0\u1EE3ng L\u01B0u",
                desc: "H\xE0i h\xF2a tr\u1ECDn v\u1EB9n gi\u1EEFa \u0111\u01B0\u1EDDng n\xE9t \u0111\u01B0\u01A1ng \u0111\u1EA1i v\xE0 thi\xEAn nhi\xEAn k\u1EF3 v\u0129"
              },
              {
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
                title: "Ch\u1EBF T\xE1c Th\u1EE7 C\xF4ng Tinh X\u1EA3o",
                desc: "H\xE0ng tr\u0103m gi\u1EDD ho\xE0n thi\u1EC7n t\u1EC9 m\u1EC9 b\u1EDFi c\xE1c ngh\u1EC7 nh\xE2n kim ho\xE0n b\u1EADc th\u1EA7y"
              },
              {
                image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
                title: "Tr\u1EA3i Nghi\u1EC7m Th\u01B0\u1EDFng Ngo\u1EA1n Ri\xEAng T\u01B0",
                desc: "Ph\u1EE5c v\u1EE5 chuy\xEAn bi\u1EC7t trong ph\xF2ng ti\u1EBFp \u0111\xF3n b\u1EA3o m\u1EADt cao c\u1EA5p"
              }
            ]
          }
        },
        {
          type: "split_feature",
          props: {
            title: "\u0110\u1EB7c Quy\u1EC1n Concierge 1:1 D\xE0nh Cho Qu\xFD Kh\xE1ch",
            description: "M\u1ED7i th\u01B0\u1EE3ng kh\xE1ch \u0111\u1EC1u c\xF3 m\u1ED9t chuy\xEAn vi\xEAn t\u01B0 v\u1EA5n ri\xEAng bi\u1EC7t t\xFAc tr\u1EF1c, th\u1EA5u hi\u1EC3u t\u01B0\u1EDDng t\u1EADn t\u1EEBng mong mu\u1ED1n v\xE0 may \u0111o gi\u1EA3i ph\xE1p x\u1EE9ng t\u1EA7m.",
            image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=800&q=80",
            bullets: [
              "Ch\u1EE9ng th\u01B0 b\u1EA3o ch\u1EE9ng \u0111\u1ED9c b\u1EA3n qu\u1ED1c t\u1EBF \u0111i k\xE8m",
              "Quy tr\xECnh v\u1EADn chuy\u1EC3n an ninh tuy\u1EC7t m\u1EADt t\u1EADn n\u01A1i",
              "\u0110\u1EB7c quy\u1EC1n tham d\u1EF1 c\xE1c bu\u1ED5i ti\u1EC7c k\xEDn v\xE0 s\u1EF1 ki\u1EC7n gi\u1EDBi h\u1EA1n"
            ]
          }
        },
        {
          type: "form",
          props: {
            heading: "\u0110\u0103ng K\xFD L\u1ECBch Th\u01B0\u1EDFng L\xE3m Ri\xEAng T\u01B0",
            subheading: "Vui l\xF2ng \u0111\u1EC3 l\u1EA1i th\xF4ng tin, Qu\u1EA3n Gia VIP s\u1EBD li\xEAn h\u1EC7 trong khung gi\u1EDD Qu\xFD kh\xE1ch ch\u1EC9 \u0111\u1ECBnh",
            submitLabel: "X\xE1c Nh\u1EADn \u0110\u1EB7t L\u1ECBch",
            fields: [
              { label: "Danh x\u01B0ng & H\u1ECD t\xEAn Qu\xFD kh\xE1ch", type: "text" },
              { label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i ri\xEAng", type: "tel" },
              { label: "Khung gi\u1EDD v\xE0 y\xEAu c\u1EA7u \u0111\xF3n ti\u1EBFp ri\xEAng", type: "textarea" }
            ]
          }
        },
        {
          type: "footer",
          props: {
            text: `\xA9 2026 ${cleanTitle}. A Legacy of Uncompromising Luxury.`,
            links: [
              { label: "Ki\u1EC7t t\xE1c", href: "#" },
              { label: "C\xE2u chuy\u1EC7n di s\u1EA3n", href: "#" },
              { label: "\u0110\u1EB7c quy\u1EC1n VIP", href: "#" }
            ]
          }
        }
      ]
    };
  }
  if (style === "brutalist") {
    const isGym = p.includes("gym") || p.includes("fitness") || p.includes("boxing") || p.includes("th\u1EC3 h\xECnh");
    const primary = isGym ? "#ea580c" : "#f97316";
    const bg = "#0d0d0d";
    const fg = "#ffffff";
    const heroImg = isGym ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80" : "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80";
    return {
      theme: {
        primary,
        background: bg,
        text: fg,
        font: "Space Grotesk",
        style: "brutalist"
      },
      sections: [
        {
          type: "ticker",
          props: {
            items: isGym ? ["// 100% RAW POWER //", "KH\xD4NG L\xDD DO B\u1ECE CU\u1ED8C", "M\u1EDE C\u1EECA 24/7", "HU\u1EA4N LUY\u1EC6N VI\xCAN \u0110\u1EB2NG C\u1EA4P", "// TRAIN UNTIL IT HURTS //"] : ["// LIMITED DROP 2026 //", "OVERSIZE CULTURE", "100% HEAVY COTTON", "STREETWEAR \u0110\u1ED8C B\u1EA2N", "// GRAB YOURS BEFORE IT GONE //"]
          }
        },
        {
          type: "hero",
          props: {
            layout: "editorial",
            badge: isGym ? "\u{1F525} HARDCORE FITNESS" : "\u26A1 UNGOVERNABLE STREETWEAR",
            title: cleanTitle,
            subtitle: isGym ? "N\u01A1i r\xE8n gi\u0169a \xFD ch\xED th\xE9p v\xE0 l\u1ED9t x\xE1c th\u1EC3 h\xECnh. \u0110\u1EADp tan m\u1ECDi gi\u1EDBi h\u1EA1n c\u0169 k\u1EF9 v\xE0 gi\u1EA3i ph\xF3ng n\u0103ng l\u01B0\u1EE3ng chi\u1EBFn binh b\xEAn trong b\u1EA1n." : "Th\u1EDDi trang g\xF3c c\u1EA1nh kh\xF4ng khoan nh\u01B0\u1EE3ng. \u0110\u1ECBnh h\xECnh phong c\xE1ch c\xE1 nh\xE2n v\u1EDBi ch\u1EA5t li\u1EC7u th\xF4 m\u1ED9c v\xE0 t\u01B0 duy n\u1ED5i lo\u1EA1n c\xF3 ch\u1EE7 \u0111\xEDch.",
            cta: isGym ? "GIA NH\u1EACP \u0110\u1ED8I NG\u0168 NGAY" : "S\u0102N DROP M\u1EDAI NH\u1EA4T",
            secondaryCta: "XEM CHI\u1EBEN D\u1ECACH",
            image: heroImg
          }
        },
        {
          type: "cards",
          props: {
            heading: isGym ? "CH\u01AF\u01A0NG TR\xCCNH HU\u1EA4N LUY\u1EC6N \u0110\u1ED8T PH\xC1" : "V\u0168 KH\xCD TH\u1EDCI TRANG \u0110\u01AF\u1EDCNG PH\u1ED0",
            subheading: isGym ? "Gi\xE1o tr\xECnh c\u01B0\u1EDDng \u0111\u1ED9 cao \u0111\u01B0\u1EE3c ch\u1EE9ng minh hi\u1EC7u qu\u1EA3 th\u1EF1c t\u1EBF" : "Phi\xEAn b\u1EA3n gi\u1EDBi h\u1EA1n \u0111\xE1nh s\u1ED1 ri\xEAng cho t\u1EEBng s\u1EA3n ph\u1EA9m",
            items: isGym ? [
              {
                title: "POWERLIFTING & S\u1EE8C M\u1EA0NH",
                desc: "K\u1EF9 thu\u1EADt t\u1EA1 n\u1EB7ng chu\u1EA9n thi \u0111\u1EA5u, t\u1ED1i \u0111a h\xF3a l\u1EF1c b\xF9ng n\u1ED5 c\u01A1 b\u1EAFp v\xE0 b\u1EA3o v\u1EC7 kh\u1EDBp.",
                badge: "BEAST MODE",
                price: "1.200.000\u0111/th\xE1ng",
                image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                icon: "\u{1F3CB}\uFE0F"
              },
              {
                title: "BOXING & CHI\u1EBEN \u0110\u1EA4U TH\u1EF0C CHI\u1EBEN",
                desc: "T\u0103ng ph\u1EA3n x\u1EA1, \u0111\u1ED1t calo si\xEAu t\u1ED1c v\xE0 l\xE0m ch\u1EE7 k\u1EF9 n\u0103ng \u0111\u1ED1i kh\xE1ng t\u1EF1 v\u1EC7.",
                badge: "COMBAT ZONE",
                price: "1.500.000\u0111/th\xE1ng",
                image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&q=80",
                icon: "\u{1F94A}"
              },
              {
                title: "HYBRID CALISTHENICS & AGILITY",
                desc: "Ki\u1EC3m so\xE1t tr\u1ECDng l\u01B0\u1EE3ng c\u01A1 th\u1EC3 \u0111\u1EC9nh cao v\u1EDBi c\xE1c b\xE0i t\u1EADp x\xE0 v\xE0 th\u1EC3 l\u1EF1c \u0111a n\u0103ng.",
                badge: "ATHLETIC",
                price: "990.000\u0111/th\xE1ng",
                image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
                icon: "\u26A1"
              }
            ] : [
              {
                title: "HEAVYWEIGHT BOX HOODIE 450GSM",
                desc: "Ch\u1EA5t n\u1EC9 b\xF4ng d\xE0y d\u1EB7n \u0111\u1EE9ng form, c\xF4ng ngh\u1EC7 in l\u1EE5a tr\xE1ng cao su si\xEAu b\u1EC1n.",
                badge: "LIMITED 150 PCS",
                price: "890.000\u0111",
                image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
                icon: "\u{1F455}"
              },
              {
                title: "CARGO TACTICAL PANTS MULTI-POCKET",
                desc: "V\u1EA3i ripstop kh\xE1ng n\u01B0\u1EDBc nh\u1EB9, 8 t\xFAi ti\u1EC7n d\u1EE5ng v\u1EDBi kh\xF3a zip c\xF4ng nghi\u1EC7p YKK.",
                badge: "RESTOCKED",
                price: "750.000\u0111",
                image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80",
                icon: "\u{1F456}"
              },
              {
                title: "ACID WASH VINTAGE TEE",
                desc: "X\u1EED l\xFD hi\u1EC7u \u1EE9ng gi\u1EB7t axit loang m\xE0u \u0111\u1ED9c b\u1EA3n, m\u1ED7i chi\u1EBFc l\xE0 m\u1ED9t phi\xEAn b\u1EA3n ri\xEAng bi\u1EC7t.",
                badge: "HOT ITEM",
                price: "420.000\u0111",
                image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
                icon: "\u{1F525}"
              }
            ]
          }
        },
        {
          type: "stats",
          props: {
            heading: "CON S\u1ED0 N\xD3I L\xCAN T\u1EA4T C\u1EA2",
            items: isGym ? [
              { value: "24/7", label: "M\u1EDF c\u1EEDa li\xEAn t\u1EE5c kh\xF4ng ng\xE0y ngh\u1EC9" },
              { value: "2,500+", label: "H\u1ECDc vi\xEAn t\u1EADp luy\u1EC7n m\u1ED7i tu\u1EA7n" },
              { value: "100%", label: "Thi\u1EBFt b\u1ECB t\u1EA1 n\u1EB7ng chu\u1EA9n Rogue" },
              { value: "0%", label: "L\xFD do ch\u1EA5p nh\u1EADn b\u1ECF cu\u1ED9c" }
            ] : [
              { value: "100%", label: "V\u1EA3i s\u1EE3i t\u1EF1 nhi\xEAn th\xE2n thi\u1EC7n da" },
              { value: "48H", label: "Ch\xE1y h\xE0ng m\u1ED7i \u0111\u1EE3t m\u1EDF b\xE1n" },
              { value: "35,000+", label: "\u0110\u01A1n h\xE0ng chuy\u1EC3n t\u1EDBi to\xE0n qu\u1ED1c" },
              { value: "5.0\u2605", label: "\u0110\xE1nh gi\xE1 t\u1EEB c\u1ED9ng \u0111\u1ED3ng Underground" }
            ]
          }
        },
        {
          type: "table",
          props: {
            heading: isGym ? "B\u1EA2NG SO S\xC1NH C\xC1C H\u1EA0NG TH\u1EBA" : "B\u1EA2NG SIZE CHU\u1EA8N FORM CH\xC2U \xC1",
            columns: isGym ? ["Quy\u1EC1n l\u1EE3i", "G\xD3I BASIC", "G\xD3I HARDCORE VIP"] : ["Size", "Chi\u1EC1u cao (cm)", "C\xE2n n\u1EB7ng (kg)", "D\xE0i \xE1o (cm)"],
            rows: isGym ? [
              ["Th\u1EDDi gian v\xE0o ph\xF2ng t\u1EADp", "Gi\u1EDD h\xE0nh ch\xEDnh (08h - 17h)", "Kh\xF4ng gi\u1EDBi h\u1EA1n 24/7"],
              ["Khu v\u1EF1c v\xF5 thu\u1EADt & Boxing", "Ph\u1EE5 thu 100k/bu\u1ED5i", "T\u1EF1 do s\u1EED d\u1EE5ng ho\xE0n to\xE0n"],
              ["T\u1EE7 \u0111\u1ED3 c\xE1 nh\xE2n & Kh\u0103n s\u1EA1ch", "Thu\xEA ri\xEAng", "Mi\u1EC5n ph\xED trang b\u1ECB tr\u1ECDn g\xF3i"],
              ["T\u01B0 v\u1EA5n dinh d\u01B0\u1EE1ng chuy\xEAn s\xE2u", "Kh\xF4ng c\xF3", "Hu\u1EA5n luy\u1EC7n vi\xEAn l\xEAn th\u1EF1c \u0111\u01A1n ri\xEAng"]
            ] : [
              ["Size M", "155 - 168 cm", "50 - 62 kg", "70 cm"],
              ["Size L", "168 - 176 cm", "63 - 74 kg", "73 cm"],
              ["Size XL", "176 - 185 cm", "75 - 90 kg", "76 cm"]
            ]
          }
        },
        {
          type: "footer",
          props: {
            text: `\xA9 2026 ${cleanTitle}. BUILT FOR THE UNSTOPPABLE.`,
            links: [
              { label: "SHOP", href: "#" },
              { label: "COMMUNITY", href: "#" },
              { label: "RULES", href: "#" }
            ]
          }
        }
      ]
    };
  }
  if (style === "minimal") {
    return {
      theme: {
        primary: "#18181b",
        background: "#ffffff",
        text: "#18181b",
        font: "Inter",
        style: "minimal"
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "minimal",
            badge: "STUDIO & ARCHITECTURE",
            title: cleanTitle,
            subtitle: "T\xF4n vinh c\xE1i \u0111\u1EB9p c\u1EE7a s\u1EF1 tinh gi\u1EA3n. M\u1ED7i c\xF4ng tr\xECnh l\xE0 m\u1ED9t nghi\xEAn c\u1EE9u s\xE2u s\u1EAFc v\u1EC1 \xE1nh s\xE1ng, v\u1EADt li\u1EC7u v\xE0 c\u1EA3m x\xFAc t\u0129nh t\u1EA1i.",
            cta: "Xem D\u1EF1 \xC1n Ch\u1ECDn L\u1ECDc",
            secondaryCta: "V\u1EC1 T\xE1c Gi\u1EA3",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
          }
        },
        {
          type: "gallery",
          props: {
            heading: "Tuy\u1EC3n T\u1EADp C\xF4ng Tr\xECnh & T\xE1c Ph\u1EA9m",
            subheading: "Nh\u1EEFng d\u1EF1 \xE1n ti\xEAu bi\u1EC3u \u0111\u01B0\u1EE3c ho\xE0n thi\u1EC7n v\u1EDBi tinh th\u1EA7n thu\u1EA7n khi\u1EBFt",
            items: [
              {
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                title: "Pavilion \xC1nh S\xE1ng T\u1EF1 Nhi\xEAn",
                desc: "Kh\xF4ng gian m\u1EDF k\u1EBFt n\u1ED1i tr\u1EF1c ti\u1EBFp v\u1EDBi khu v\u01B0\u1EDDn c\xE2y b\u1EA3n \u0111\u1ECBa"
              },
              {
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
                title: "C\u0103n H\u1ED9 T\u1ED1i Gi\u1EA3n \u0110\u01A1n S\u1EAFc",
                desc: "Lo\u1EA1i b\u1ECF ho\xE0n to\xE0n chi ti\u1EBFt th\u1EEBa, t\u1EADp trung v\xE0o c\xF4ng n\u0103ng s\u1ED1ng"
              },
              {
                image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                title: "Ph\xF2ng Tr\u01B0ng B\xE0y Ngh\u1EC7 Thu\u1EADt \u0110\u01B0\u01A1ng \u0110\u1EA1i",
                desc: "\xC1nh s\xE1ng \u0111\u1ED5 b\xF3ng h\xECnh h\u1ECDc \u0111\u1ECBnh h\xECnh kh\xF4ng gian tri\u1EC3n l\xE3m"
              }
            ]
          }
        },
        {
          type: "quote",
          props: {
            quote: "S\u1EF1 \u0111\u01A1n gi\u1EA3n kh\xF4ng ph\u1EA3i l\xE0 thi\u1EBFu h\u1EE5t chi ti\u1EBFt, m\xE0 l\xE0 \u0111\u1EC9nh cao c\u1EE7a s\u1EF1 th\u1EA5u hi\u1EC3u v\xE0 ch\u1EAFt l\u1ECDc.",
            author: "Ki\u1EBFn tr\xFAc s\u01B0 tr\u01B0\u1EDFng"
          }
        },
        {
          type: "cards",
          props: {
            heading: "Ph\u1EA1m Vi S\xE1ng T\xE1c & T\u01B0 V\u1EA5n",
            items: [
              {
                title: "Thi\u1EBFt K\u1EBF Ki\u1EBFn Tr\xFAc & C\u1EA3nh Quan",
                desc: "Nghi\xEAn c\u1EE9u k\u1EF9 l\u01B0\u1EE1ng vi kh\xED h\u1EADu, h\u01B0\u1EDBng n\u1EAFng gi\xF3 v\xE0 \u0111\u1ECBa h\xECnh khu \u0111\u1EA5t.",
                icon: "\u{1F4D0}"
              },
              {
                title: "Thi\u1EBFt K\u1EBF N\u1ED9i Th\u1EA5t May \u0110o",
                desc: "L\u1EF1a ch\u1ECDn v\u1EADt li\u1EC7u t\u1EF1 nhi\xEAn: g\u1ED7 s\u1ED3i, \u0111\xE1 m\xE0i, b\xEA t\xF4ng th\xF4 v\xE0 k\xEDnh trong su\u1ED1t.",
                icon: "\u{1F6CB}\uFE0F"
              },
              {
                title: "Gi\xE1m S\xE1t T\xE1c Quy\u1EC1n C\xF4ng Tr\xECnh",
                desc: "\u0110\u1EA3m b\u1EA3o th\u1EF1c t\u1EBF thi c\xF4ng b\xE1m s\xE1t 100% b\u1EA3n v\u1EBD chi ti\u1EBFt \u0111\u1EBFn t\u1EEBng milimet.",
                icon: "\u2728"
              }
            ]
          }
        },
        {
          type: "form",
          props: {
            heading: "B\u1EAFt \u0110\u1EA7u D\u1EF1 \xC1n M\u1EDBi",
            subheading: "H\xE3y chia s\u1EBB v\u1EC1 \xFD t\u01B0\u1EDFng v\xE0 m\u1EB7t b\u1EB1ng hi\u1EC7n tr\u1EA1ng c\u1EE7a b\u1EA1n",
            submitLabel: "G\u1EEDi Y\xEAu C\u1EA7u T\u01B0 V\u1EA5n",
            fields: [
              { label: "H\u1ECD v\xE0 t\xEAn", type: "text" },
              { label: "Email li\xEAn h\u1EC7", type: "email" },
              { label: "M\xF4 t\u1EA3 d\u1EF1 \xE1n & v\u1ECB tr\xED", type: "textarea" }
            ]
          }
        },
        {
          type: "footer",
          props: {
            text: `\xA9 2026 ${cleanTitle}. Less is always more.`,
            links: [
              { label: "D\u1EF1 \xE1n", href: "#" },
              { label: "Tri\u1EBFt l\xFD", href: "#" },
              { label: "Li\xEAn h\u1EC7", href: "#" }
            ]
          }
        }
      ]
    };
  }
  return {
    theme: {
      primary: "#0284c7",
      background: "#f8fafc",
      text: "#0f172a",
      font: "Be Vietnam Pro",
      style: "modern"
    },
    sections: [
      {
        type: "hero",
        props: {
          layout: "split",
          badge: "\u{1F3E5} TI\xCAU CHU\u1EA8N QU\u1ED0C T\u1EBE \u2022 T\u1EACN T\xC2M CHUY\xCAN NGHI\u1EC6P",
          title: cleanTitle,
          subtitle: "\u0110\u1ED3ng h\xE0nh ch\u0103m s\xF3c to\xE0n di\u1EC7n v\u1EDBi \u0111\u1ED9i ng\u0169 chuy\xEAn gia gi\xE0u kinh nghi\u1EC7m v\xE0 trang thi\u1EBFt b\u1ECB hi\u1EC7n \u0111\u1EA1i b\u1EADc nh\u1EA5t.",
          cta: "\u0110\u1EB7t L\u1ECBch Kh\xE1m & T\u01B0 V\u1EA5n",
          secondaryCta: "Xem \u0110\u1ED9i Ng\u0169 B\xE1c S\u0129",
          image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
          align: "left"
        }
      },
      {
        type: "stats",
        props: {
          heading: "H\xC0NH TR\xCCNH TRAO G\u1EECI NI\u1EC0M TIN",
          items: [
            { value: "15+", label: "N\u0103m kinh nghi\u1EC7m chuy\xEAn s\xE2u" },
            { value: "50,000+", label: "Kh\xE1ch h\xE0ng tin t\u01B0\u1EDFng \u0111i\u1EC1u tr\u1ECB" },
            { value: "99.8%", label: "T\u1EF7 l\u1EC7 kh\xE1ch h\xE0ng h\xE0i l\xF2ng" },
            { value: "100%", label: "Thi\u1EBFt b\u1ECB nh\u1EADp kh\u1EA9u ch\xEDnh h\xE3ng" }
          ]
        }
      },
      {
        type: "cards",
        props: {
          heading: "D\u1ECBch V\u1EE5 Chuy\xEAn Khoa Ti\xEAu Bi\u1EC3u",
          subheading: "Ph\xE1c \u0111\u1ED3 \u0111i\u1EC1u tr\u1ECB chu\u1EA9n y khoa, kh\xF4ng \u0111au v\xE0 b\u1EA3o h\xE0nh minh b\u1EA1ch",
          items: [
            {
              title: "Th\u0103m Kh\xE1m & Ch\u1EA9n \u0110o\xE1n K\u1EF9 Thu\u1EADt S\u1ED1",
              desc: "Ch\u1EE5p phim 3D CT ConeBeam th\u1EBF h\u1EC7 m\u1EDBi ph\xE1t hi\u1EC7n ch\xEDnh x\xE1c m\u1ECDi v\u1EA5n \u0111\u1EC1 ch\u1EC9 trong 2 ph\xFAt.",
              badge: "C\xF4ng ngh\u1EC7 m\u1EDBi",
              icon: "\u{1F52C}",
              image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
            },
            {
              title: "\u0110i\u1EC1u Tr\u1ECB & Ph\u1EE5c H\u1ED3i Chuy\xEAn Khoa",
              desc: "B\xE1c s\u0129 tr\u01B0\u1EDFng khoa tr\u1EF1c ti\u1EBFp th\u1EF1c hi\u1EC7n trong ph\xF2ng ph\u1EABu thu\u1EADt v\xF4 tr\xF9ng tuy\u1EC7t \u0111\u1ED1i.",
              badge: "B\xE1c s\u0129 VIP",
              icon: "\u{1FA7A}",
              image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
            },
            {
              title: "Ch\u0103m S\xF3c & T\xE1i Kh\xE1m H\u1EADu M\xE3i Tr\u1ECDn \u0110\u1EDDi",
              desc: "Nh\u1EAFc h\u1EB9n \u0111\u1ECBnh k\u1EF3 t\u1EF1 \u0111\u1ED9ng, theo d\xF5i s\xE1t sao ti\u1EBFn tr\xECnh l\xE0nh th\u01B0\u01A1ng c\u1EE7a t\u1EEBng kh\xE1ch h\xE0ng.",
              badge: "T\u1EADn t\xE2m",
              icon: "\u2B50",
              image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
            }
          ]
        }
      },
      {
        type: "split_feature",
        props: {
          title: "Quy Tr\xECnh V\xF4 Tr\xF9ng Kh\xE9p K\xEDn 1 Chi\u1EC1u",
          description: "Ch\xFAng t\xF4i \xE1p d\u1EE5ng nghi\xEAm ng\u1EB7t ti\xEAu chu\u1EA9n v\xF4 tr\xF9ng ch\xE2u \xC2u, \u0111\u1EA3m b\u1EA3o m\xF4i tr\u01B0\u1EDDng \u0111i\u1EC1u tr\u1ECB an to\xE0n tuy\u1EC7t \u0111\u1ED1i v\xE0 lo\u1EA1i b\u1ECF ho\xE0n to\xE0n nguy c\u01A1 l\xE2y nhi\u1EC5m ch\xE9o.",
          image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
          bullets: [
            "L\xF2 h\u1EA5p s\u1EA5y ti\u1EC7t tr\xF9ng \xE1p su\u1EA5t cao Autoclave \u0111\u1EA1t chu\u1EA9n y t\u1EBF",
            "M\u1ED7i kh\xE1ch h\xE0ng s\u1EED d\u1EE5ng m\u1ED9t b\u1ED9 tay khoan v\xE0 d\u1EE5ng c\u1EE5 chuy\xEAn bi\u1EC7t",
            "Kh\xF4ng gian th\u0103m kh\xE1m sang tr\u1ECDng, ri\xEAng t\u01B0 v\xE0 th\u01B0 th\xE1i"
          ]
        }
      },
      {
        type: "form",
        props: {
          heading: "\u0110\u1EB7t L\u1ECBch Kh\xE1m & Nh\u1EADn \u01AFu \u0110\xE3i",
          subheading: "\u0110\u1EC3 l\u1EA1i th\xF4ng tin, l\u1EC5 t\xE2n s\u1EBD li\xEAn h\u1EC7 x\xE1c nh\u1EADn gi\u1EDD h\u1EB9n trong v\xF2ng 15 ph\xFAt",
          submitLabel: "X\xE1c Nh\u1EADn \u0110\u1EB7t L\u1ECBch Ngay",
          fields: [
            { label: "H\u1ECD v\xE0 t\xEAn b\u1EC7nh nh\xE2n", type: "text" },
            { label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i li\xEAn h\u1EC7", type: "tel" },
            { label: "Nhu c\u1EA7u ho\u1EB7c t\xECnh tr\u1EA1ng c\u1EA7n t\u01B0 v\u1EA5n", type: "textarea" }
          ]
        }
      },
      {
        type: "footer",
        props: {
          text: `\xA9 2026 ${cleanTitle}. T\u1EADn t\xE2m v\xEC s\u1EE9c kh\u1ECFe c\u1ED9ng \u0111\u1ED3ng.`,
          links: [
            { label: "Trang ch\u1EE7", href: "#" },
            { label: "D\u1ECBch v\u1EE5", href: "#" },
            { label: "\u0110\u1ED9i ng\u0169", href: "#" },
            { label: "Li\xEAn h\u1EC7", href: "#" }
          ]
        }
      }
    ]
  };
}
__name(createSmartPromptSpec, "createSmartPromptSpec");
function normalizeSpec(raw, userPrompt) {
  const detectedStyle = detectStyleFromPrompt(userPrompt);
  const rawStyle = raw?.theme?.style;
  const validStyles = ["bento", "luxury", "brutalist", "artisan", "minimal", "modern"];
  const style = validStyles.includes(rawStyle) ? rawStyle : detectedStyle;
  const theme = {
    primary: raw?.theme?.primary || (style === "luxury" ? "#d4af37" : style === "brutalist" ? "#f97316" : style === "bento" ? "#6366f1" : style === "artisan" ? "#b45309" : "#2563eb"),
    background: raw?.theme?.background || (style === "luxury" ? "#0b0d11" : style === "brutalist" ? "#0d0d0d" : style === "bento" ? "#090d16" : style === "artisan" ? "#faf7f2" : "#ffffff"),
    text: raw?.theme?.text || (style === "luxury" || style === "brutalist" || style === "bento" ? "#f8fafc" : "#0f172a"),
    font: raw?.theme?.font || (style === "luxury" || style === "artisan" ? "Playfair Display" : style === "brutalist" ? "Space Grotesk" : style === "bento" ? "Plus Jakarta Sans" : "Be Vietnam Pro"),
    style
  };
  const rawSections = Array.isArray(raw?.sections) ? raw.sections : [];
  const normalizedSections = [];
  for (const s of rawSections) {
    if (!s || typeof s !== "object") continue;
    const type = String(s.type || "").toLowerCase();
    const props = s.props || s;
    if (type === "hero") {
      const validLayouts = ["centered", "split", "minimal", "editorial"];
      const layout = validLayouts.includes(props.layout) ? props.layout : props.align === "center" ? "centered" : style === "brutalist" || style === "artisan" ? "editorial" : style === "minimal" ? "minimal" : "split";
      normalizedSections.push({
        type: "hero",
        props: {
          layout,
          title: String(props.title || props.heading || userPrompt),
          subtitle: props.subtitle || props.description || props.subheading,
          cta: props.cta || props.primaryCta?.label || props.buttonText || "Kh\xE1m ph\xE1 ngay",
          secondaryCta: props.secondaryCta?.label || props.secondaryCta || void 0,
          badge: props.badge || void 0,
          image: props.image || props.imageUrl || void 0,
          align: layout === "centered" ? "center" : "left"
        }
      });
      continue;
    }
    if (type === "bento") {
      const items = Array.isArray(props.items) ? props.items : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "bento",
          props: {
            heading: props.heading || props.title || "Ki\u1EBFn Tr\xFAc T\xEDnh N\u0103ng",
            subheading: props.subheading || props.subtitle || void 0,
            items: items.map((it) => ({
              title: String(it.title || it.name || "T\xEDnh n\u0103ng"),
              desc: it.desc || it.description || void 0,
              badge: it.badge || void 0,
              icon: it.icon || void 0,
              image: it.image || it.imageUrl || void 0,
              span: it.span === "wide" || it.span === "tall" ? it.span : "normal"
            }))
          }
        });
      }
      continue;
    }
    if (type === "stats" || type === "metrics" || type === "numbers") {
      const items = Array.isArray(props.items) ? props.items : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "stats",
          props: {
            heading: props.heading || props.title || void 0,
            items: items.map((it) => ({
              value: String(it.value || it.number || "0") + (it.suffix ? String(it.suffix) : ""),
              label: String(it.label || it.title || "Ch\u1EC9 s\u1ED1"),
              desc: it.desc || it.description || void 0
            }))
          }
        });
      }
      continue;
    }
    if (type === "menu" || type === "food_menu" || type === "drink_menu") {
      const categories = Array.isArray(props.categories) ? props.categories : [];
      let finalCats = categories;
      if (finalCats.length === 0 && Array.isArray(props.items)) {
        finalCats = [{ name: props.heading || "Th\u1EF1c \u0110\u01A1n", items: props.items }];
      }
      if (finalCats.length > 0) {
        normalizedSections.push({
          type: "menu",
          props: {
            heading: props.heading || props.title || "Th\u1EF1c \u0110\u01A1n Ch\u1ECDn L\u1ECDc",
            subheading: props.subheading || props.subtitle || void 0,
            categories: finalCats.map((cat) => ({
              name: String(cat.name || "Danh m\u1EE5c"),
              items: (Array.isArray(cat.items) ? cat.items : []).map((it) => ({
                name: String(it.name || it.title || "M\xF3n"),
                price: String(it.price || ""),
                desc: it.desc || it.description || void 0,
                badge: it.badge || void 0
              }))
            }))
          }
        });
      }
      continue;
    }
    if (type === "quote" || type === "testimonial_single" || type === "quote_block") {
      normalizedSections.push({
        type: "quote",
        props: {
          quote: String(props.quote || props.text || props.content || "Ch\u1EA5t l\u01B0\u1EE3ng l\xE0 l\u1EDDi cam k\u1EBFt v\u1EEFng ch\u1EAFc nh\u1EA5t."),
          author: props.author || props.name || void 0,
          role: props.role || props.title || void 0,
          avatar: props.avatar || void 0
        }
      });
      continue;
    }
    if (type === "ticker" || type === "marquee" || type === "banner_marquee") {
      const items = Array.isArray(props.items) ? props.items : Array.isArray(props.tags) ? props.tags : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "ticker",
          props: {
            items: items.map((it) => String(typeof it === "string" ? it : it.text || it.label || it.title))
          }
        });
      }
      continue;
    }
    if (type === "split_feature" || type === "feature_split" || type === "about") {
      normalizedSections.push({
        type: "split_feature",
        props: {
          title: String(props.title || props.heading || "Chi Ti\u1EBFt N\u1ED5i B\u1EADt"),
          description: String(props.description || props.text || props.desc || ""),
          image: props.image || props.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
          reverse: Boolean(props.reverse),
          badge: props.badge || void 0,
          bullets: Array.isArray(props.bullets) ? props.bullets.map((b) => String(b)) : void 0,
          cta: props.cta || void 0
        }
      });
      continue;
    }
    if (type === "cta_banner" || type === "banner") {
      normalizedSections.push({
        type: "hero",
        props: {
          layout: "centered",
          title: String(props.title || "\u01AFu \u0110\xE3i \u0110\u1EB7c Bi\u1EC7t"),
          subtitle: props.subtitle || props.description,
          cta: props.buttonText || props.cta || "Nh\u1EADn \u01B0u \u0111\xE3i",
          align: "center"
        }
      });
      continue;
    }
    if (type === "products") {
      const prods = Array.isArray(props.products) ? props.products : Array.isArray(props.items) ? props.items : [];
      if (prods.length > 0) {
        normalizedSections.push({
          type: "cards",
          props: {
            heading: props.title || props.heading || "S\u1EA3n Ph\u1EA9m N\u1ED5i B\u1EADt",
            subheading: props.subtitle || props.subheading || void 0,
            items: prods.map((p) => ({
              title: String(p.name || p.title || "S\u1EA3n ph\u1EA9m"),
              desc: p.desc || p.description || void 0,
              price: p.price ? String(p.price) : void 0,
              image: p.image || p.imageUrl || void 0,
              badge: p.tag || p.badge || p.category || void 0,
              icon: "\u{1F6CD}\uFE0F"
            }))
          }
        });
      }
      continue;
    }
    if (type === "features") {
      const feats = Array.isArray(props.items) ? props.items : [];
      if (feats.length > 0) {
        normalizedSections.push({
          type: "cards",
          props: {
            heading: props.title || props.heading || "L\u1EE3i \xCDch & T\xEDnh N\u0103ng",
            subheading: props.subtitle || props.subheading || void 0,
            items: feats.map((f) => ({
              title: String(f.title || f.name || "T\xEDnh n\u0103ng"),
              desc: f.description || f.desc || void 0,
              badge: f.badge || void 0,
              icon: f.icon || "\u2728",
              image: f.image || void 0
            }))
          }
        });
      }
      continue;
    }
    if (type === "categories") {
      const cats = Array.isArray(props.items) ? props.items : [];
      if (cats.length > 0) {
        normalizedSections.push({
          type: "gallery",
          props: {
            heading: props.title || props.heading || "Danh M\u1EE5c & B\u1ED9 S\u01B0u T\u1EADp",
            subheading: props.subtitle || props.subheading || void 0,
            items: cats.map((c) => ({
              image: c.image || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
              title: c.name || c.title,
              desc: c.count || c.desc
            }))
          }
        });
      }
      continue;
    }
    if (type === "testimonials" || type === "reviews") {
      const tests = Array.isArray(props.items) ? props.items : [];
      if (tests.length > 0) {
        normalizedSections.push({
          type: "cards",
          props: {
            heading: props.title || props.heading || "\u0110\xE1nh Gi\xE1 C\u1EE7a Kh\xE1ch H\xE0ng",
            subheading: props.subtitle || props.subheading || void 0,
            items: tests.map((t) => ({
              title: String(t.name || "Kh\xE1ch h\xE0ng"),
              desc: `"${t.comment || t.text || t.content || ""}"`,
              badge: t.rating ? `\u2B50 ${t.rating}/5` : "Kh\xE1ch h\xE0ng x\xE1c th\u1EF1c",
              icon: "\u{1F4AC}"
            }))
          }
        });
      }
      continue;
    }
    if (type === "cards") {
      const items = Array.isArray(props.items) ? props.items : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "cards",
          props: {
            heading: props.heading || props.title || void 0,
            subheading: props.subheading || props.subtitle || void 0,
            items: items.map((it) => ({
              title: String(it.title || it.name || ""),
              desc: it.desc || it.description || void 0,
              badge: it.badge || void 0,
              image: it.image || void 0,
              price: it.price ? String(it.price) : void 0,
              icon: it.icon || void 0
            }))
          }
        });
      }
      continue;
    }
    if (type === "gallery") {
      const items = Array.isArray(props.items) ? props.items : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "gallery",
          props: {
            heading: props.heading || props.title || void 0,
            subheading: props.subheading || props.subtitle || void 0,
            items: items.map((it) => ({
              image: String(it.image || it.imageUrl || ""),
              title: it.title || void 0,
              desc: it.desc || it.description || void 0
            }))
          }
        });
      }
      continue;
    }
    if (type === "table") {
      normalizedSections.push({
        type: "table",
        props: {
          heading: props.heading || props.title || void 0,
          subheading: props.subheading || props.subtitle || void 0,
          columns: Array.isArray(props.columns) ? props.columns : ["H\u1EA1ng m\u1EE5c", "Th\xF4ng tin"],
          rows: Array.isArray(props.rows) ? props.rows : []
        }
      });
      continue;
    }
    if (type === "form") {
      normalizedSections.push({
        type: "form",
        props: {
          heading: props.heading || props.title || void 0,
          subheading: props.subheading || props.subtitle || void 0,
          submitLabel: props.submitLabel || "G\u1EEDi th\xF4ng tin ngay",
          fields: Array.isArray(props.fields) ? props.fields.map((f) => ({
            label: String(f.label || "Th\xF4ng tin"),
            type: ["text", "email", "tel", "textarea"].includes(f.type) ? f.type : "text"
          })) : [{ label: "H\u1ECD v\xE0 t\xEAn", type: "text" }, { label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i", type: "tel" }]
        }
      });
      continue;
    }
    if (type === "footer") {
      normalizedSections.push({
        type: "footer",
        props: {
          text: String(props.text || props.copyright || props.about || `\xA9 2026. ${userPrompt}`),
          links: Array.isArray(props.links) ? props.links : void 0
        }
      });
      continue;
    }
  }
  if (!normalizedSections.some((s) => s.type === "hero")) {
    normalizedSections.unshift({
      type: "hero",
      props: {
        title: userPrompt,
        subtitle: "Gi\u1EA3i ph\xE1p ch\u1EA5t l\u01B0\u1EE3ng cao \u0111\xE1p \u1EE9ng tr\u1ECDn v\u1EB9n mong \u0111\u1EE3i c\u1EE7a b\u1EA1n.",
        cta: "Kh\xE1m ph\xE1 ngay",
        align: "center"
      }
    });
  }
  if (!normalizedSections.some((s) => s.type === "footer")) {
    normalizedSections.push({
      type: "footer",
      props: {
        text: `\xA9 2026. Thi\u1EBFt k\u1EBF ri\xEAng theo y\xEAu c\u1EA7u: "${userPrompt.slice(0, 50)}".`
      }
    });
  }
  return {
    theme,
    sections: normalizedSections
  };
}
__name(normalizeSpec, "normalizeSpec");
async function callGemini(env, prompt, currentSpec, retryHint) {
  if (!env.GEMINI_API_KEY) {
    throw new Error("Ch\u01B0a c\u1EA5u h\xECnh GEMINI_API_KEY trong file .dev.vars");
  }
  const isUpdate = Boolean(
    currentSpec && typeof currentSpec === "object" && Array.isArray(currentSpec.sections) && currentSpec.sections.length > 0
  );
  const userText = JSON.stringify({
    isUpdate,
    prompt,
    ...isUpdate ? { currentSpec } : {},
    ...retryHint ? { lastError: retryHint } : {}
  });
  const promptMessage = isUpdate ? `Y\xCAU C\u1EA6U TINH CH\u1EC8NH / B\u1ED4 SUNG TR\xCAN WEBSITE HI\u1EC6N T\u1EA0I (currentSpec): "${prompt}".
QUY T\u1EAEC B\u1EAET BU\u1ED8C: H\xE3y GI\u1EEE NGUY\xCAN t\u1EA5t c\u1EA3 c\xE1c section, phong c\xE1ch (theme.style), m\xE0u s\u1EAFc, ti\xEAu \u0111\u1EC1 v\xE0 n\u1ED9i dung c\u0169 c\u1EE7a currentSpec!
Ch\u1EC9 th\xEAm section m\u1EDBi (ngay tr\u01B0\u1EDBc footer) ho\u1EB7c s\u1EEDa \u0111\u1ED5i/c\u1EADp nh\u1EADt section t\u01B0\u01A1ng \u1EE9ng theo \u0111\xFAng y\xEAu c\u1EA7u.
Xu\u1EA5t ra JSON Spec \u0111\u1EA7y \u0111\u1EE7 ho\xE0n ch\u1EC9nh g\u1ED3m t\u1EA5t c\u1EA3 c\xE1c section c\u0169 v\xE0 m\u1EDBi. Chi ti\u1EBFt: ${userText}` : `H\xE3y t\u1EA1o website ch\u1EA5t l\u01B0\u1EE3ng cao theo y\xEAu c\u1EA7u: "${prompt}". Chi ti\u1EBFt: ${userText}`;
  try {
    const openAiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    const res2 = await fetch(openAiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GEMINI_API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: promptMessage }
        ],
        temperature: 0.7
      }),
      signal: AbortSignal.timeout(6e3)
    });
    if (res2.ok) {
      const data2 = await res2.json();
      const content = data2?.choices?.[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } else {
      console.warn("OpenAI endpoint status:", res2.status);
    }
  } catch (err) {
    console.warn("OpenAI endpoint attempt failed:", err);
  }
  const baseUrl = env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";
  const url = `${baseUrl}/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY.trim())}`;
  const res = await fetch(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: promptMessage }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
      }),
      signal: AbortSignal.timeout(6e3)
    }
  );
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    let errMsg = `Gemini API l\u1ED7i (${res.status})`;
    try {
      const errJson = JSON.parse(errText);
      if (errJson?.error?.message) {
        errMsg = errJson.error.message;
      }
    } catch {
      if (errText) errMsg += `: ${errText.slice(0, 150)}`;
    }
    throw new Error(errMsg);
  }
  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Gemini kh\xF4ng tr\u1EA3 v\u1EC1 n\u1ED9i dung h\u1EE3p l\u1EC7.");
  }
  return JSON.parse(rawText);
}
__name(callGemini, "callGemini");
var onRequestPost = /* @__PURE__ */ __name(async ({ request, env }) => {
  try {
    const body = await request.json().catch(() => null);
    const prompt = body?.prompt?.trim();
    const projectId = body?.projectId;
    if (!prompt || !projectId || prompt.length > MAX_PROMPT) {
      return Response.json({ error: "Y\xEAu c\u1EA7u kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c v\u01B0\u1EE3t qu\xE1 \u0111\u1ED9 d\xE0i." }, { status: 400 });
    }
    const ip = request.headers.get("CF-Connecting-IP") ?? "local";
    if (await rateLimited(env, ip)) {
      return Response.json({ error: "B\u1EA1n th\u1EED qu\xE1 nhi\u1EC1u l\u1EA7n trong 1 gi\u1EDD, vui l\xF2ng quay l\u1EA1i sau." }, { status: 429 });
    }
    const p = stripVietnamese(prompt);
    const isIncrementalIntent = Boolean(body?.isTweak) || p.includes("them") || p.includes("bo sung") || p.includes("sua") || p.includes("doi") || p.includes("thay") || p.includes("xoa") || p.includes("bo ") || p.includes("chinh") || p.includes("tang") || p.includes("giam") || p.includes("mau") || p.includes("tong") || p.includes("font") || p.includes("dark") || p.includes("sang") || p.includes("toi") || p.includes("bang gia") || p.includes("form") || p.includes("menu") || p.includes("danh gia") || p.includes("gallery") || p.includes("ticker") || p.includes("xay dung them") || p.includes("tao them");
    const hasExistingSpec = Boolean(
      body?.currentSpec && typeof body.currentSpec === "object" && Array.isArray(body.currentSpec.sections) && body.currentSpec.sections.length > 0
    );
    const shouldModifyExisting = hasExistingSpec && (Boolean(body?.isTweak) || isIncrementalIntent);
    const { readable, writable } = new TransformStream();
    const w = writable.getWriter();
    const send = /* @__PURE__ */ __name((event, data) => w.write(enc.encode(`event: ${event}
data: ${JSON.stringify(data)}

`)), "send");
    (async () => {
      try {
        await send("step", { id: "analyze" });
        await sleep(1400);
        if (env.DB) {
          try {
            await env.DB.prepare("INSERT OR IGNORE INTO projects (id, name) VALUES (?, ?)").bind(projectId, prompt.slice(0, 60)).run();
            await env.DB.prepare("INSERT INTO messages (project_id, role, content) VALUES (?, 'user', ?)").bind(projectId, prompt).run();
          } catch (dbErr) {
            console.warn("L\u1ED7i l\u01B0u D1 project:", dbErr);
          }
        }
        await send("step", { id: "design" });
        let raw;
        try {
          raw = await callGemini(env, prompt, shouldModifyExisting ? body?.currentSpec : void 0);
        } catch (geminiError) {
          console.warn("K\xEDch ho\u1EA1t b\u1ED9 ki\u1EBFn t\u1EA1o th\xF4ng minh th\xEDch \u1EE9ng do Gemini API:", geminiError?.message || geminiError);
          await sleep(1500);
          if (shouldModifyExisting) {
            raw = modifyExistingSpec(body.currentSpec, prompt);
          } else {
            raw = createSmartPromptSpec(prompt);
          }
        }
        await send("step", { id: "content" });
        await sleep(1200);
        const normalized = normalizeSpec(raw, prompt);
        const parsed = SpecSchema.safeParse(normalized);
        if (!parsed.success) {
          console.error("L\u1ED7i validate Spec:", parsed.error);
          throw new Error("Kh\xF4ng th\u1EC3 \u0111\u1ECBnh d\u1EA1ng c\u1EA5u tr\xFAc website do AI t\u1EA1o.");
        }
        await send("step", { id: "validate" });
        await sleep(1e3);
        const version = Date.now();
        if (env.DB) {
          try {
            await env.DB.prepare("INSERT INTO templates (project_id, version, spec) VALUES (?, ?, ?)").bind(projectId, version, JSON.stringify(parsed.data)).run();
            await env.DB.prepare("INSERT INTO messages (project_id, role, content) VALUES (?, 'assistant', ?)").bind(projectId, `\u0110\xE3 t\u1EA1o phi\xEAn b\u1EA3n ${version}`).run();
          } catch (dbErr) {
            console.warn("L\u1ED7i l\u01B0u D1 template:", dbErr);
          }
        }
        await send("done", { projectId, spec: parsed.data });
      } catch (e) {
        console.error("L\u1ED7i trong qu\xE1 tr\xECnh t\u1EA1o website:", e);
        await send("error", { message: e?.message ?? "Kh\xF4ng th\u1EC3 t\u1EA1o website, vui l\xF2ng th\u1EED l\u1EA1i." });
      } finally {
        await w.close();
      }
    })();
    return new Response(readable, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "X-Accel-Buffering": "no" }
    });
  } catch (topErr) {
    console.error("L\u1ED7i onRequestPost:", topErr);
    return Response.json({ error: topErr?.message ?? "L\u1ED7i m\xE1y ch\u1EE7 n\u1ED9i b\u1ED9." }, { status: 500 });
  }
}, "onRequestPost");

// ../.wrangler/tmp/pages-ixVdhR/functionsRoutes-0.780522198950521.mjs
var routes = [
  {
    routePath: "/api/projects/:id",
    mountPath: "/api/projects",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/generate",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
