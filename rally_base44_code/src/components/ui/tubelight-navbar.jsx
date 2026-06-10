import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Tubelight navbar — a glass pill with an animated "lamp" glow under the
// active tab. Adapted from the shadcn/21st reference: next/link -> react-router
// Link, active state derived from the current route, gold glow for a premium feel.
//
// items: [{ name, url, icon }]
export function NavBar({ items, className }) {
  const { pathname } = useLocation();

  const isActive = (url) =>
    url === '/' ? pathname === '/' : pathname.startsWith(url);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-4 w-[calc(100%-1.5rem)] max-w-[440px]',
        className
      )}
    >
      <div className="glass-dark flex items-center justify-between gap-1 rounded-full px-2 py-1.5 shadow-luxe">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);

          return (
            <Link
              key={item.name}
              to={item.url}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-2 transition-colors',
                active ? 'text-gold' : 'text-white/55 hover:text-white/80'
              )}
            >
              <Icon size={21} strokeWidth={active ? 1.9 : 1.5} className="relative z-10" />
              <span className="relative z-10 text-[10px] font-bold tracking-tight">
                {item.name}
              </span>

              {active && (
                <motion.div
                  layoutId="rally-lamp"
                  className="absolute inset-0 -z-0 rounded-full bg-gold/10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                >
                  {/* the tubelight glow */}
                  <div className="absolute -top-1.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-b-full bg-gold">
                    <div className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-gold/30 blur-md" />
                    <div className="absolute -top-1 h-6 w-8 rounded-full bg-gold/20 blur-md" />
                    <div className="absolute left-2 top-0 h-4 w-4 rounded-full bg-gold/20 blur-sm" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default NavBar;
