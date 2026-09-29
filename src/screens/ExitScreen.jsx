import ScreenShell from '../components/screens/ScreenShell.jsx'

function ExitScreen({ onBack }) {
  return (
    <ScreenShell title="Sampai jumpa!" icon="🚪" onBack={onBack} backLabel="Kembali ke lobby">
      <div className="grid gap-3 text-base">
        <p>Terima kasih sudah bermain Ular Tangga.</p>
        <p>Aplikasi web tidak dapat menutup tab ini secara otomatis. Tutup tab melalui browser, atau kembali ke lobby untuk bermain lagi.</p>
      </div>
    </ScreenShell>
  )
}

export default ExitScreen
