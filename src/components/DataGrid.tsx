/**
 * Alppi DataGrid
 * Copyright © 2022 Ruhis. All rights reserved.
 */
import classNames from "classnames";
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
  addToTotal?: boolean;
  excludeFromTotal?: boolean;
  totalRender?: (data: number) => JSX.Element | string;
  totalValueGetter?: (data: any) => number;
  render?: (data: any, index?: number) => JSX.Element | string;
}

interface DataGridProps {
  className?: string;
  containerClassName?: string;
  columns: DataGridColumn[];
  data: any;
  identifier: string;
  uniqueIdentifier?: string;
  search?: boolean;
  searchExcludes?: string[];
  searchPlaceholder?: string;
  sort?: boolean;
  select?: boolean;
  onSelect?: (selected: any, data: any) => void;
}

const searchField = (
  enabled: boolean,
  get: string,
  set: Dispatch<SetStateAction<string>>,
  placeholder: string
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
      labelText={placeholder}
    />
  );
};

const DataGrid: React.FC<DataGridProps> = ({
  identifier,
  className,
  containerClassName,
  columns,
  uniqueIdentifier = "grid",
  data: rawData,
  search = false,
  searchPlaceholder = "Haku",
  searchExcludes = [],
  sort = false,
  select = false,
  onSelect,
}) => {
  const [searchFieldContent, setSearchFieldContent] = useState("");
  const [sortStatus, setSortStatus] = useState<"ASC" | "DESC" | undefined>(
    undefined
  );

  const [sortField, setSortField] = useState("");

  const [selectedRows, setSelectedRows] = useState([] as any[]);

  const excludeProperties = [...searchExcludes, "id", "createdAt", "updatedAt"];

  const filteredData = searchFieldContent
    ? rawData.filter((e: any) => {
        const res = Object.entries(e).map(([key, value]) => {
          if (excludeProperties.includes(key)) return false;
          if (
            typeof value === "boolean" ||
            typeof value === "number" ||
            value === null
          )
            return false;
          return value
            .toString()
            .toLowerCase()
            .startsWith(searchFieldContent.toLowerCase());
        });
        return res.includes(true);
      })
    : rawData;

  let data = filteredData;

  if (sort && sortField !== "") {
    data =
      sortStatus === "ASC"
        ? filteredData.sort(dynamicSort(sortField))
        : filteredData.sort(dynamicSort(sortField)).reverse();
  }

  const totals = {};

  columns.forEach((col) => {
    if (col.addToTotal) {
      const total = data.reduce((acc, curr) => {
        if (col.totalValueGetter) {
          return acc + col.totalValueGetter(curr);
        }
        return acc + curr[col.name];
      }, 0);

      if (Object.keys(totals).includes(col.name)) {
        totals[col.name] += total;
      } else {
        totals[col.name] = total;
      }
    }
  });

  return (
    <>
      {searchField(
        search,
        searchFieldContent,
        setSearchFieldContent,
        searchPlaceholder
      )}
      {onSelect && select && onSelect(selectedRows, data)}
      <div
        className={classNames("datagrid-container", {
          [containerClassName]: !!containerClassName,
        })}
      >
        <table
          className={`table table-sm table-datagrid datagrid ${
            className || ""
          }`}
        >
          <thead className={classNames({ sort })}>
            <tr>
              {select && (
                <th className="datagrid-select">
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedRows(data.map((e) => e[identifier]));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                    checked={
                      selectedRows &&
                      data &&
                      selectedRows.length === data.length
                    }
                  />
                </th>
              )}
              {columns.map((col) => {
                if (!col.width) {
                  col.width = "20%";
                }
                return (
                  <th
                    key={`table-header-${uniqueIdentifier}-${col.name}`}
                    style={{
                      /* width: col.width,
                    minWidth: col.minWidth, */
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
                    <div className="cell">
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
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, index: number) => {
              return (
                <tr key={`table-row-${uniqueIdentifier}-${row[identifier]}`}>
                  {select && (
                    <td className="datagrid-select">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row[identifier])}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedRows([...selectedRows, row[identifier]]);
                          } else {
                            setSelectedRows(
                              selectedRows.filter((e) => e !== row[identifier])
                            );
                          }
                        }}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    if (
                      row[col.name] !== undefined &&
                      col.render === undefined
                    ) {
                      return (
                        <td
                          key={`table-row-${uniqueIdentifier}-${row[identifier]}-${col.name}`}
                          style={{ textAlign: col.align ? col.align : "left" }}
                        >
                          <div className="cell">{row[col.name]}</div>
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
                        key={`table-row-${uniqueIdentifier}-${row[identifier]}-${col.name}`}
                        style={{ textAlign: col.align ? col.align : "left" }}
                      >
                        <div className="cell">{col.render(row, index)}</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td className="feedback-text" colSpan={10}>
                  Ei tuloksia.
                </td>
              </tr>
            )}
          </tbody>
          {columns.filter((col) => col.addToTotal).length > 0 && (
            <tfoot>
              <tr>
                {select && <td />}
                <td>
                  <strong>Yhteensä</strong>
                </td>
                {columns.map((col) => {
                  if (col.addToTotal) {
                    return (
                      <td
                        key={`table-total-row-${uniqueIdentifier}-${col.name}`}
                        style={{ textAlign: col.align ? col.align : "left" }}
                      >
                        {!col.totalRender ? (
                          <div className="cell">{totals[col.name]}</div>
                        ) : (
                          <div className="cell">
                            {col.totalRender(totals[col.name])}
                          </div>
                        )}
                      </td>
                    );
                  }
                  if (col.excludeFromTotal) {
                    return null;
                  }
                  return (
                    <td key={`table-total-row-${uniqueIdentifier}-${col.name}`}>
                      &nbsp;
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </>
  );
};

export default DataGrid;
