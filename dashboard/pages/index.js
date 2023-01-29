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

function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
      display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${parseInt(Math.floor(min))})`}
        style={{
          marginRight: '0.5rem',
        }}
        min={parseInt(Math.floor(min))}
        max={parseInt(Math.round(max))}
        pattern="\d*"
      />
      até
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Máx (${parseInt(Math.round(max))})`}
        style={{
          marginLeft: '0.5rem',
        }}
        min={parseInt(Math.round(min))}
        max={parseInt(Math.round(max))}
        pattern="\d*"
      />
    </div>
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

  const firstPageRows = rows.slice(0, 10)

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

function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

filterGreaterThan.autoRemove = val => typeof val !== 'number'

function App({ products }) {
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
      {
        Header: 'Preço',
        accessor: 'price',
        Filter: NumberRangeColumnFilter,
        filter: 'between',
        Cell: props => <div> R$ {props.value} </div>
      },
    ],
    []
  )

  const data = React.useMemo(
    () => products,
    []
  )

  return (
    <div className="main">
      <Head>
        <title>Produtos</title>
      </Head>
      <div className="container-fluid">
        <Header />
        <div className="row main-content">
          <Sidebar></Sidebar>
          <div className="col-12 col-sm-12 col-md-10 col-lg-9 ps-0">
            <div className="content products">
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
    const res = await fetch('https://fakestoreapi.com/products?limit=10');
    const products = await res.json();

    if (!products) {
      return {
        notFound: true,
      }
    }

    return {
      props: { products },
    }
  } catch (e) {
    const products = [];
    return {
      props: { products },
    }
  }

}
