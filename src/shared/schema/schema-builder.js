import { SchemaError } from "./schema-error";

class BaseSchemaBuilder {
  parse = () => {
    throw new Error("parse method is not implemented");
  };
  type() {
    throw new Error("type method is not implemented");
  }
  _withParse(fn) {
    const parse = this.parse;
    this.parse = (v) => fn(parse(v));
    return this;
  }
}

class ObjectSchemaBuilder extends BaseSchemaBuilder {
  type() {
    return "object";
  }
  /**
   *
   * @param {object} schema
   * @param {{ message?: string }} [options]
   */
  constructor(schema, options) {
    super();
    this.parse = (obj) => {
      if (typeof obj !== "object" || Array.isArray(obj) || obj == null)
        throw new SchemaError(options?.message ?? "입력은 객체여야 합니다.");
      const result = {};
      for (const [key, sb] of Object.entries(schema)) {
        if (!Object.hasOwn(obj, key)) throw new SchemaError(`"${key}" 키가 객체에 없습니다.`);
        result[key] = sb.parse(obj[key]);
      }
      return result;
    };
  }
}

class StringSchemaBuilder extends BaseSchemaBuilder {
  type() {
    return "string";
  }
  /**
   *
   * @param {{ message?: string }} [options]
   */
  constructor(options) {
    super();
    this.parse = (v) => {
      if (typeof v !== "string") throw new SchemaError(options?.message ?? "입력은 문자열이어야 합니다.");
      return v;
    };
  }
  /**
   *
   * @returns {StringSchemaBuilder}
   */
  trim() {
    return this._withParse((v) => v.trim());
  }
  /**
   *
   * @param {RegExp} expression
   * @param {string} message
   * @returns {StringSchemaBuilder}
   */
  regex(expression, message) {
    return this._withParse((v) => {
      if (!expression.test(v)) throw new SchemaError(message ?? "입력은 정규식에 일치해야 합니다.");
      return v;
    });
  }
  /**
   *
   * @param {number} length
   * @param {string} message
   * @returns {StringSchemaBuilder}
   */
  min(length, message) {
    return this._withParse((v) => {
      if (v.length < length) throw new SchemaError(message ?? `최소 ${length} 글자 이상이어야 합니다.`);
      return v;
    });
  }
  /**
   *
   * @param {number} length
   * @param {string} message
   * @returns {StringSchemaBuilder}
   */
  max(length, message) {
    return this._withParse((v) => {
      if (v.length > length) throw new SchemaError(message ?? `최대 ${length} 글자 이하여야 합니다.`);
      return v;
    });
  }
}

class NumberSchemaBuilder extends BaseSchemaBuilder {
  type() {
    return "number";
  }
  /**
   *
   * @param {{ cast?: true, message?: string }} [options]
   */
  constructor(options) {
    super();
    this.parse = (v) => {
      if (options?.cast) v = Number(v);
      if (typeof v !== "number") throw new SchemaError(options?.message ?? "입력은 숫자여야 합니다.");
      return v;
    };
  }
  /**
   *
   * @param {string} message
   * @returns {NumberSchemaBuilder}
   */
  finite(message) {
    return this._withParse((v) => {
      if (!Number.isFinite(v)) throw new SchemaError(message ?? "입력은 유한한 숫자여야 합니다.");
      return v;
    });
  }
  /**
   *
   * @param {string} message
   * @returns {NumberSchemaBuilder}
   */
  integer(message) {
    return this._withParse((v) => {
      if (!Number.isInteger(v)) throw new SchemaError(message ?? "입력은 정수여야 합니다.");
      return v;
    });
  }
  /**
   *
   * @param {number} n
   * @param {string} message
   * @returns {NumberSchemaBuilder}
   */
  min(n, message) {
    return this._withParse((v) => {
      if (v < n) throw new SchemaError(message ?? `입력은 ${n}보다 크거나 같아야 합니다.`);
      return v;
    });
  }
  /**
   *
   * @param {number} n
   * @param {string} message
   * @returns {NumberSchemaBuilder}
   */
  max(n, message) {
    return this._withParse((v) => {
      if (v > n) throw new SchemaError(message ?? `입력은 ${n}보다 작거나 같아야 합니다.`);
      return v;
    });
  }
}

export default {
  string(options) {
    return new StringSchemaBuilder(options);
  },
  object(schema, options) {
    return new ObjectSchemaBuilder(schema, options);
  },
  number(options) {
    return new NumberSchemaBuilder(options);
  },
};
