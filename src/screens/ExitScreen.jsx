import { useEffect } from 'react'
import ScreenShell from '../components/screens/ScreenShell.jsx'

// Aplikasi web tidak bisa menutup tab secara paksa; window.close() hanya
// berhasil untuk jendela yang dibuka lewat script. Karena itu layar ini
// tetap menampilkan pesan perpisahan sebagai fallback.
function ExitScreen({ onBack }) {
  useEffect(() => {
    const timer = window.setTimeout(() => window.close(), 300)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <ScreenShell title="Sampai jumpa!" icon="🚪" onBack={onBack} backLabel="Kembali ke lobby">
      <p className="text-base">
        Terima kasih sudah bermain Ular Tangga. Kamu bisa menutup tab ini, atau kembali ke lobby untuk main lagi.
      </p>
    </ScreenShell>
  )
}

export default ExitScreen
