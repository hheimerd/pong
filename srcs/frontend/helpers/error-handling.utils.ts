// Inspiration:
// https://github.com/dhcode/scrum-tools/blob/cc259dbfd70e02501ea2852821694c58421f6265/scrum-tools-ui/src/app/shared/error-handling.util.ts
export function extractGraphQLError(err: any): {
  code: string;
  message: string;
} {
  if (err && err.graphQLErrors && err.graphQLErrors.length) {
    return (
      err.graphQLErrors[0].extensions?.response || {
        code: "unknownError",
        message: err.graphQLErrors[0].message,
      }
    );
  } else {
    return {
      code: "unknownError",
      message: err.toString(),
    };
  }
}

export class CodedError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export class GraphQLUiError extends CodedError {
  constructor(err: any) {
    const info = extractGraphQLError(err);
    super(info.code, info.message);
  }
}
