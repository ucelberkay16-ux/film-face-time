import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto max-w-4xl">
        <div className="relative bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={declineCookies}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 pr-8 md:pr-0">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Çerez Kullanımı
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deneyiminizi iyileştirmek için çerezler kullanıyoruz. Sitemizi kullanarak{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Gizlilik Politikamızı
                </Link>{' '}
                kabul etmiş olursunuz.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={declineCookies}
                className="flex-1 md:flex-none"
              >
                Reddet
              </Button>
              <Button
                onClick={acceptCookies}
                className="flex-1 md:flex-none bg-primary hover:bg-primary/90"
              >
                Kabul Et
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
