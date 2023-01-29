import Link from 'next/link'
import { useRef } from 'react'
import styles from './Header.module.scss'

export function Header() {
  return (
    <div>
      <div className="row" id={styles.header}>
        <div className="col-4 col-md-6 col-sm-4">
          <Link href="/" className={styles.logo}>
            <img src="/images/logo.png" alt="Logo" />
          </Link>
        </div>
        <div className="col-8 col-md-6 col-sm-8 text-end">
          <span className={styles.username}>Mary Anne</span>
          <img src="/images/user.png" alt="User" className={styles.avatar} />
          <a className={"dropdown-toggle " + styles.settings} data-bs-toggle="dropdown" aria-expanded="false">
            <img src="/images/settings.png" alt="Configurações" />
          </a>
          <ul className={"dropdown-menu dropdown-menu-end " + styles.dropdownMenu}>
            <li>
              <Link className={"dropdown-item " + styles.dropdownItem} href="/">
                Editar perfil
              </Link>
            </li>
            <li>
              <Link className={"dropdown-item " + styles.dropdownItem} href="/">
                Trocar senha
              </Link>
            </li>
            <li>
              <Link className={"dropdown-item " + styles.dropdownItem} href="/">
                Sair
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
