// eslint-disable-next-line import/prefer-default-export
export const combineFields = (
  data: any,
  field: string,
  a: any,
  b: any,
  format: string
) => {
  data[field] = format.replaceAll("$0", a).replaceAll("$1", b);
  return data;
};

export default combineFields;
