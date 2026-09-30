import { BOARD_THEMES } from '../../data/boardThemes.js'

// Latar halaman penuh yang mengikuti tema papan aktif. Semua lapisan tema dirender
// sekali; hanya yang `is-active` tampak (crossfade opacity lewat CSS di styles/backdrop.css),
// jadi mengganti tema tidak memasang/membongkar DOM dan tidak memicu layout.
// Elemen dekoratif: tidak menerima klik dan disembunyikan dari pembaca layar.
function ThemeBackdrop({ theme }) {
  return (
    <div className="page-backdrop" aria-hidden="true">
      {BOARD_THEMES.map(({ id, backdrop }) => (
        <div
          key={id}
          className={`page-backdrop__layer page-backdrop__layer--${backdrop}${id === theme ? ' is-active' : ''}`}
          data-backdrop={backdrop}
        />
      ))}
    </div>
  )
}

export default ThemeBackdrop
