import ScreenShell from '../components/screens/ScreenShell.jsx'

const RULES = [
  'Kamu bermain melawan tiga bot: Rizky, Bagas, dan Davin. Semua mulai dari kotak 1.',
  'Saat giliranmu, tekan tombol dadu untuk melempar. Pionmu maju sesuai angka dadu.',
  'Berhenti di awal tangga? Kamu naik ke kotak yang lebih tinggi.',
  'Berhenti di kepala ular? Kamu turun ke kotak yang lebih rendah.',
  'Dapat angka 6? Kamu mendapat satu lemparan ekstra.',
  'Pemain pertama yang mencapai kotak 100 adalah pemenangnya.',
]

function HowToPlayScreen({ onBack }) {
  return (
    <ScreenShell title="How to Play" icon="❓" onBack={onBack}>
      <ol className="grid list-decimal gap-2 pl-5 text-base leading-relaxed">
        {RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
    </ScreenShell>
  )
}

export default HowToPlayScreen
