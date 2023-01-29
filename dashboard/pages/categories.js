import React from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import Head from 'next/head'
import { Header } from "../components/Header"
import { Sidebar } from "../components/Sidebar"

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
      setFilter(e.target.value || undefined)
      }}
      placeholder={`Buscar em ${count} registros...`}
    />
  )
}

function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
      return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue !== undefined
        ? String(rowValue)
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase())
        : true
      })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters,
  )

  const firstPageRows = rows.slice(0, 20)

  return (
    <>
      <table {...getTableProps()} className="table table-bordered table-light table-striped">
      <thead>
        {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
          <th {...column.getHeaderProps()}>
            {column.render('Header')}
            {/* Render the columns filter UI */}
            <div>{column.canFilter ? column.render('Filter') : null}</div>
          </th>
          ))}
        </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {firstPageRows.map((row, i) => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
          {row.cells.map(cell => {
            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
          })}
          </tr>
        )
        })}
      </tbody>
      </table>
    </>
  )
}

function App({ categories }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Título',
        accessor: 'title',
      },
    ],
    []
  )

  const data = React.useMemo(
    () => categories,
    []
  )

  return (
    <div className="main">
      <Head>
        <title>Categorias</title>
      </Head>
      <div className="container-fluid">
        <Header />
        <div className="row main-content">
          <Sidebar></Sidebar>
          <div className="col-12 col-sm-12 col-md-10 col-lg-9 ps-0">
            <div className="content categories">
              <div className="table-responsive">
                <Table columns={columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default App

export async function getStaticProps(context) {
  try {
    const res = await fetch('https://fakestoreapi.com/products/categories');
    const data = await res.json();

    let categories = [];
    for (var i = 0; i < data.length; i++) {
      categories.push({
        id: i+1,
        title: data[i]
      })
    }

    if (!categories) {
      return {
        notFound: true,
      }
    }

    return {
      props: { categories },
    }
  } catch (e) {
    const categories = [];
    return {
      props: { categories },
    }
  }
}
