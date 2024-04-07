import * as Yup from "yup";


export function yupReqStr(existingNames?: string[]) {
    let yup = Yup.string().required("必填");
    if(existingNames) {
        yup = yup.test(
            "Unique",
            "重名",
            (value) => !existingNames.some((sn) => sn === value)
          )
    }
    return yup;
  }