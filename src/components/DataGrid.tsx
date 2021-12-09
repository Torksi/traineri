/* eslint-disable no-console */
import { Dispatch, SetStateAction, useState } from "react";
import dynamicSort from "../util/dynamicSort";
import InputGroup from "./InputGroup";

interface DataGridColumn {
  name: string;
  label: string;
  width?: string;
  minWidth?: string;
  align?: "left" | "center" | "right";
  preventSort?: boolean;
  render?: (data: any, index?: number) => JSX.Element | string;
}

interface DataGridProps {
  className?: string;
  columns: DataGridColumn[];
  data: any;
  identifier: string;
  search?: boolean;
  primarySearchKey?: string;
  secondarySearchKey?: string;
  sort?: boolean;
}

const searchField = (
  enabled: boolean,
  get: string,
  set: Dispatch<SetStateAction<string>>
) => {
  if (!enabled) {
    return null;
  }

  return (
    <InputGroup
      className="form-group col-md-6"
      type="text"
      setValue={set}
      name="searchField"
      value={get}
      error={null}
      label
      labelText="Hae nimellä tai sähköpostilla"
    />
  );
};

const DataGrid: React.FC<DataGridProps> = ({
  identifier,
  className,
  columns,
  data: rawData,
  search,
  primarySearchKey,
  secondarySearchKey,
  sort,
}) => {
  const [searchFieldContent, setSearchFieldContent] = useState("");
  const [sortStatus, setSortStatus] = useState(undefined);
  const [sortField, setSortField] = useState("");

  const filteredData = searchFieldContent
    ? rawData.filter(
        (e) =>
          e[primarySearchKey]
            .toLowerCase()
            .startsWith(searchFieldContent.toLowerCase()) ||
          e[secondarySearchKey]
            .toLowerCase()
            .startsWith(searchFieldContent.toLowerCase())
      )
    : rawData;

  let data = filteredData;

  if (sort) {
    data =
      sortStatus === "ASC"
        ? filteredData.sort(dynamicSort(sortField))
        : filteredData.sort(dynamicSort(sortField)).reverse();
  }

  return (
    <>
      {searchField(search, searchFieldContent, setSearchFieldContent)}
      <table
        className={`table table-datagrid table-striped table-hover table-bordered table-sm ${
          className || ""
        }`}
      >
        <thead>
          <tr>
            {columns.map((col) => {
              if (!col.width) {
                col.width = "20%";
              }
              return (
                <th
                  key={`table-header-${col.name}`}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                    textAlign: col.align ? col.align : "left",
                  }}
                  scope="col"
                  onClick={() => {
                    if (col.preventSort) return;
                    if (col.name !== sortField) {
                      setSortStatus("ASC");
                    } else {
                      setSortStatus(sortStatus === "ASC" ? "DESC" : "ASC");
                    }
                    setSortField(col.name);
                  }}
                >
                  <span>{col.label}</span>
                  {sort && (
                    <span className="table-sort">
                      {sortField === col.name && sortStatus === "ASC" && (
                        <i className="fas fa-sm fa-caret-up" />
                      )}
                      {sortField === col.name && sortStatus === "DESC" && (
                        <i className="fas fa-sm fa-caret-down" />
                      )}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            return (
              <tr key={`table-row-${row[identifier]}`}>
                {columns.map((col) => {
                  if (row[col.name] !== undefined && col.render === undefined) {
                    return (
                      <td
                        key={`table-row-${row[identifier]}-${col.name}`}
                        style={{ textAlign: col.align ? col.align : "left" }}
                      >
                        {row[col.name]}
                      </td>
                    );
                  }
                  if (!col.render) {
                    console.error(
                      `${col.name} was expected to render, but render function is not provided`
                    );
                    return null;
                  }
                  return (
                    <td
                      key={`table-row-${row[identifier]}-${col.name}`}
                      style={{ textAlign: col.align ? col.align : "left" }}
                    >
                      {col.render(row, index)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default DataGrid;
