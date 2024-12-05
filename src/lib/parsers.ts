const pass = <T>(value: T): T => value;

const parsers = {
  number: {
    parse(value: string | number): number {
      return typeof value === "string" ? parseFloat(value) : value;
    },
  },
  text: {
    parse: pass,
  },
  long_text: {
    parse: pass,
  },
  date: {
    parse(value: string): Date {
      return new Date(value);
    },
  },
  email: {
    parse: pass,
  },
  password: {
    parse(value: true | "true" | null): boolean {
      return !!value;
    },
  },
  created_on: {
    parse(value: string): Date {
      return new Date(value);
    },
  },
  url: {
    parse: pass,
  },
};

export default parsers;
