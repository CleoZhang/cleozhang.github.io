import React from "react";
import styles from "./GeneralLedgerTable.module.scss";
import { Link } from "react-router-dom";
import { axiosCreate, axiosGetAll } from "./axios";
import { IdWithDisplayName } from "./definitions";
import { getNameById } from "./utils";
import { FormikProvider, useFormik } from "formik";
import { AutocompleteInput, DatePickerInput, FormikInput } from "./Input";

type GeneralLedgerEntry = {
  id: number;
  date: string;
  voucher: string;
  payableAmount?: number;
  payableTaxAmount?: number;
  invoiceAmount?: number;
  invoiceTaxRate?: number;
  invoiceTaxAmount?: number;
  paymentAmount?: number;
  BusinessUnitId: number;
  PayableCategoryId: PayableCategory;
};

// type GeneralLedgerEntry = {
//   id: number;
//   date: string;
//   voucher: string;
//   BusinessUnitId: number;
// } & (
//   | {
//       PayableCategoryId: PayableCategory.Payable;
//       payableAmount: number;
//       payableTaxAmount: number;
//     }
//   | {
//       PayableCategoryId: PayableCategory.Invoice;
//       invoiceAmount: number;
//       invoiceTaxRate: number;
//       invoiceTaxAmount: number;
//     }
//   | {
//       PayableCategoryId: PayableCategory.Payment;
//       paymentAmount: number;
//     }
// );

enum PayableCategory {
  Payable = 1,
  Invoice = 2,
  Payment = 3,
}

function GeneralLedgerTable(props: { route: string }) {
  const [entries, setEntries] = React.useState<GeneralLedgerEntry[]>([]);
  const businessUnitOptions = React.useRef<IdWithDisplayName[]>([]);
  const payableCategoryOptions = React.useRef<IdWithDisplayName[]>([]);
  const maxEntryId =
    entries.length === 0 ? 0 : Math.max(...entries.map((p) => p.id));

  React.useEffect(() => {
    axiosGetAll(props.route, setEntries);
    axiosGetAll("businessUnits", (res) => (businessUnitOptions.current = res));
    axiosGetAll(
      "payableCategories",
      (res) => (payableCategoryOptions.current = res)
    );
  }, [props.route]);

  return (
    <>
      <Link to="/">返回主页</Link>
      <br />
      <AddEntryForm
        newEntryId={maxEntryId + 1}
        onSubmit={(entry) => axiosCreate(props.route, entry, setEntries)}
        businessUnitOptions={businessUnitOptions.current}
        payableCategoryOptions={payableCategoryOptions.current}
      />
      <table className={styles.entries}>
        <thead>
          <tr>
            <th>日期</th>
            <th>记账凭证</th>
            <th>单位</th>
            <th>结算类别</th>
            <th>应付金额</th>
            <th>应付税额</th>
            <th>发票金额</th>
            <th>发票税率</th>
            <th>发票税额</th>
            <th>支付金额</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.date}</td>
              <td>{entry.voucher}</td>
              <td>
                {getNameById(businessUnitOptions.current, entry.BusinessUnitId)}
              </td>
              <td>
                {getNameById(
                  payableCategoryOptions.current,
                  entry.PayableCategoryId
                )}
              </td>
              <td>{entry.payableAmount}</td>
              <td>{entry.payableTaxAmount}</td>
              <td>{entry.invoiceAmount}</td>
              <td>{entry.invoiceTaxRate}</td>
              <td>{entry.invoiceTaxAmount}</td>
              <td>{entry.paymentAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default GeneralLedgerTable;

function AddEntryForm(props: {
  onSubmit: (values: GeneralLedgerEntry) => void;
  businessUnitOptions: IdWithDisplayName[];
  payableCategoryOptions: IdWithDisplayName[];
  newEntryId: number;
}) {
  const formik = useFormik<GeneralLedgerEntry>({
    initialValues: {
      id: props.newEntryId,
      date: "",
      voucher: "",
      BusinessUnitId: 1,
      PayableCategoryId: 1,
      payableAmount: undefined,
      payableTaxAmount: undefined,
      invoiceAmount: undefined,
      invoiceTaxRate: undefined,
      invoiceTaxAmount: undefined,
      paymentAmount: undefined,
    },
    onSubmit: (values, actions) => {
      let valuesToSubmit = values;
      switch (values.PayableCategoryId) {
        case PayableCategory.Payable:
          valuesToSubmit = {
            ...valuesToSubmit,
            invoiceAmount: undefined,
            invoiceTaxRate: undefined,
            invoiceTaxAmount: undefined,
            paymentAmount: undefined,
          };
          break;
        case PayableCategory.Invoice:
          valuesToSubmit = {
            ...valuesToSubmit,
            payableAmount: undefined,
            payableTaxAmount: undefined,
            paymentAmount: undefined,
          };
          break;
        case PayableCategory.Payment:
          valuesToSubmit = {
            ...valuesToSubmit,
            payableAmount: undefined,
            payableTaxAmount: undefined,
            invoiceAmount: undefined,
            invoiceTaxRate: undefined,
            invoiceTaxAmount: undefined,
          };
          break;
      }

      props.onSubmit({ ...valuesToSubmit, id: props.newEntryId });
      actions.resetForm();
    },
  });

  const inputId = "entry";
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <FormikProvider value={formik}>
          <DatePickerInput label="日期" name="date" />
          <FormikInput label="记账凭证" inputName="voucher" inputId={inputId} />
          <AutocompleteInput
            label="单位"
            name="BusinessUnitId"
            value={formik.values.BusinessUnitId}
            onChange={formik.setFieldValue}
            options={props.businessUnitOptions}
            placeholder="单位名称"
          />
          <AutocompleteInput
            label="结算类别"
            name="PayableCategoryId"
            value={formik.values.PayableCategoryId}
            onChange={formik.setFieldValue}
            options={props.payableCategoryOptions}
            placeholder="结算类别， e.g.应付款"
          />
          {formik.values.PayableCategoryId === PayableCategory.Payable && (
            <>
              <FormikInput
                label="应付金额"
                inputName="payableAmount"
                inputId={inputId}
              />
              <FormikInput
                label="应付税额"
                inputName="payableTaxAmount"
                inputId={inputId}
              />
            </>
          )}
          {formik.values.PayableCategoryId === PayableCategory.Invoice && (
            <>
              <FormikInput
                label="发票金额"
                inputName="invoiceAmount"
                inputId={inputId}
              />
              <FormikInput
                label="发票税率"
                inputName="invoiceTaxRate"
                inputId={inputId}
              />
              <FormikInput
                label="发票税额"
                inputName="invoiceTaxAmount"
                inputId={inputId}
              />
            </>
          )}
          {formik.values.PayableCategoryId === PayableCategory.Payment && (
            <>
              <FormikInput
                label="支付金额"
                inputName="paymentAmount"
                inputId={inputId}
              />
            </>
          )}

          <button type="submit">添加</button>
        </FormikProvider>
      </form>
    </div>
  );
}
