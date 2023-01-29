import Link from 'next/link'
import { useState } from 'react'
import styles from './Sidebar.module.scss';
import { useRouter } from 'next/router'

export function Sidebar(props) {
  const router = useRouter();

  return (
    <div className="col-1 col-sm-12 col-md-1 col-lg-3 gx-sm-5 menu-wrapper">
      <div id={styles.sidebar}>
        <div className={styles.menu} id="menu">
          <ul>
            <li className={router.pathname == "/" ? styles.active : ""}>
              <Link href="/">
                Produtos
              </Link>
            </li>
            <li className={router.pathname == "/categories" ? styles.active : ""}>
              <Link href="/categories">
                Categorias
              </Link>
            </li>
            <li className={router.pathname == "/customers" ? styles.active : ""}>
              <Link href="/customers">
                Clientes
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
