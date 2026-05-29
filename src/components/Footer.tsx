import { useApp } from '../contexts/AppContext';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="py-10" style={{ background: 'var(--c-bg)', borderTop: '1px solid var(--c-t05)' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black" style={{ border: '1px solid var(--c-t10)', background: 'var(--c-t05)', color: 'var(--c-text)' }}>G</div>
          <span className="text-xs" style={{ color: 'var(--c-t30)' }}>Guilherme E. Schlickmann</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--c-t20)' }}>
          {new Date().getFullYear()} — {t('footer.builtWith')}
        </span>
        <div className="flex gap-4">
          {[['GitHub','https://github.com/Espaniiol'],['LinkedIn','https://linkedin.com/in/gulherme-espaniol'],['WhatsApp','https://wa.me/554699380542'],['Email','mailto:Guilhermeespaniol@gmail.com']].map(([l,h]) => (
            <a key={l} href={h} target="_blank" rel="noreferrer" className="text-xs transition-colors hover:text-white" style={{ color: 'var(--c-t25)' }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
