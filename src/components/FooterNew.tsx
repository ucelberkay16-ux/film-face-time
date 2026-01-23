import { Video, Twitter, Instagram, Youtube, Github, Mail, Heart, Film } from "lucide-react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Ürün: [
    { label: "Özellikler", href: "/#features" },
    { label: "Fiyatlandırma", href: "/#pricing" },
    { label: "Nasıl Çalışır", href: "/#how-it-works" },
  ],
  Şirket: [
    { label: "Hakkımızda", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Kariyer", href: "#" },
  ],
  Destek: [
    { label: "Yardım Merkezi", href: "#" },
    { label: "İletişim", href: "#" },
    { label: "SSS", href: "/#faq" },
  ],
  Yasal: [
    { label: "Gizlilik Politikası", href: "/privacy" },
    { label: "Kullanım Koşulları", href: "/terms" },
    { label: "KVKK", href: "/privacy" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Github, href: "#", label: "GitHub" },
];

const FooterNew = () => {
  return (
    <footer className="relative pt-20 pb-8 border-t border-border/50 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/30 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-shadow">
                <Film className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">Miber</span>
                <span className="text-[10px] text-muted-foreground -mt-0.5">Film Köşesi</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
              Birlikte izle, birlikte yaşa. Sosyal film izleme deneyiminin yeni adresi.
            </p>
            
            {/* Social links */}
            <div className="flex gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-card/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 h-px bg-primary group-hover:w-2 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground block">Yeniliklerden haberdar ol</span>
              <span className="text-xs text-muted-foreground">Spam göndermiyoruz, söz!</span>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="E-posta adresin"
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              Abone Ol
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Miber Film Köşesi. Tüm hakları saklıdır.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              Türkiye'de{' '}
              <Heart className="w-3 h-3 text-primary fill-primary" />{' '}
              ile yapıldı
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
