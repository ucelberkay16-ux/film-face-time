import { Video, Twitter, Instagram, Youtube, Github, Mail } from "lucide-react";

const FOOTER_LINKS = {
  Ürün: [
    { label: "Özellikler", href: "#" },
    { label: "Fiyatlandırma", href: "#" },
    { label: "İndir", href: "#" },
  ],
  Şirket: [
    { label: "Hakkımızda", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Kariyer", href: "#" },
  ],
  Destek: [
    { label: "Yardım Merkezi", href: "#" },
    { label: "İletişim", href: "#" },
    { label: "SSS", href: "#" },
  ],
  Yasal: [
    { label: "Gizlilik Politikası", href: "#" },
    { label: "Kullanım Şartları", href: "#" },
    { label: "KVKK", href: "#" },
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
    <footer className="relative pt-20 pb-8 border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Video className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Miber</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Birlikte izle, birlikte yaşa.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
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
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-border">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Yeniliklerden haberdar ol
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="E-posta adresin"
              className="px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Abone Ol
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Miber Film Köşesi. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Türkiye'de 💜 ile yapıldı
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
