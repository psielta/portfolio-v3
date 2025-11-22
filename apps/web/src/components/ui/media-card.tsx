'use client';

import { motion } from 'framer-motion';
import { Film, Tv, Headphones, Calendar, Star, Play } from 'lucide-react';

interface MediaCardProps {
  title: string;
  description: string;
  type: 'movie' | 'series' | 'podcast';
  rating?: number;
  year?: string;
  href: string;
  thumbnail?: string;
  index?: number;
  event?: string;
  cta?: string;
}

export function MediaCard({
  title,
  description,
  type,
  rating,
  year,
  href,
  thumbnail,
  index = 0,
  event,
  cta = 'Assistir',
}: MediaCardProps) {
  const typeIcons = {
    movie: <Film className="w-5 h-5" />,
    series: <Tv className="w-5 h-5" />,
    podcast: <Headphones className="w-5 h-5" />,
  };

  const typeColors = {
    movie: 'from-red-500 to-pink-600',
    series: 'from-blue-500 to-cyan-600',
    podcast: 'from-purple-500 to-indigo-600',
  };

  const typeLabels = {
    movie: 'Filme',
    series: 'Série',
    podcast: 'Podcast',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all">
          {thumbnail && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              {/* Play button overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </motion.div>
            </div>
          )}

          <div className="p-6">
            {/* Header with type badge */}
            <div className="flex items-start justify-between mb-3">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${typeColors[type]} text-white text-xs font-semibold`}>
                {typeIcons[type]}
                {typeLabels[type]}
              </div>

              {rating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
              {title}
            </h3>

            {/* Event/Date */}
            {event && (
              <div className="flex items-center gap-2 text-white/50 text-sm mb-3">
                <Calendar className="w-4 h-4" />
                {event}
              </div>
            )}

            {/* Description */}
            <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                {cta} →
              </span>

              {year && (
                <span className="text-white/40 text-xs">
                  {year}
                </span>
              )}
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}