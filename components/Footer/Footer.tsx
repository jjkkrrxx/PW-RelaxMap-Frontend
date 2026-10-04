import Link from 'next/link';
import { Icon } from '@/components/Icon/Icon';
import css from './Footer.module.css';

const socialLinks = [
  { href: 'https://www.facebook.com/', icon: 'icon-facebook', label: 'Facebook' },
  { href: 'https://www.instagram.com/', icon: 'icon-instagram', label: 'Instagram' },
  { href: 'https://x.com/', icon: 'icon-x', label: 'X' },
  { href: 'https://www.youtube.com/', icon: 'icon-youtube', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.content}>
          <div className={css.brand}>
            <Link href="/" className={css.logo} aria-label="Relax Map — головна">
              <Icon name="icon-map_search" size={24} className={css.icon} />
              <span>Relax Map</span>
            </Link>
          </div>

          <ul className={css.socialLinks}>
            {socialLinks.map(({ href, icon, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={css.socialLink}
                  aria-label={label}
                >
                  <Icon name={icon} size={32} className={css.socialIcon} />
                </a>
              </li>
            ))}
          </ul>

          <nav className={css.nav} aria-label="Навігація в підвалі сайту">
            <ul className={css.navLinks}>
              <li>
                <Link href="/" className={css.navLink}>
                  Головна
                </Link>
              </li>
              <li>
                <Link href="/locations" className={css.navLink}>
                  Місця відпочинку
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={css.credits}>
          <p className={css.copyright}>
            © {new Date().getFullYear()} Природні Мандри. Усі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}
