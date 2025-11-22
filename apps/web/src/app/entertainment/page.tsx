'use client';

import { motion } from 'framer-motion';
import { Film, Tv, Headphones, Sparkles, Play, Star } from 'lucide-react';
import { MediaCard } from '@/components/ui/media-card';

const movies = [
  {
    title: 'Furiosa: Uma Saga Mad Max',
    description: 'Eu sou muito fã da saga Mad Max. Esta versão se passa em um mundo pós-apocalíptico onde os recursos necessários à vida se tornaram quase escassos. A trama se baseia na luta de uma garota que foi raptada e teve sua mãe morta, em sua jornada para voltar para casa.',
    event: 'Data de lançamento: 23 de maio de 2024',
    href: 'https://www.youtube.com/watch?v=GZ01fSgExeU',
    type: 'movie' as const,
    rating: 5,
    year: '2024',
    cta: 'Assistir trailer',
  },
  {
    title: 'O Patriota',
    description: 'O Patriota retrata a luta pela independência dos EUA. Mel Gibson é o protagonista Benjamin Martin, um veterano de guerra que renunciou às armas e decidiu viver em paz com sua família. Ele porém não vê outra saída a não ser pegar em armas novamente quando os ingleses trazem a Guerra da Independência ao seu quintal.',
    event: 'Data de lançamento: 27 de junho de 2000',
    href: 'https://www.youtube.com/watch?v=OciuqVWLDWg',
    type: 'movie' as const,
    rating: 5,
    year: '2000',
    cta: 'Assistir trailer',
  },
  {
    title: 'Interestelar',
    description: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço, em uma tentativa de garantir a sobrevivência da humanidade. Filme de Christopher Nolan com conceitos de física teórica e viagem no tempo.',
    event: 'Data de lançamento: 6 de novembro de 2014',
    href: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    type: 'movie' as const,
    rating: 5,
    year: '2014',
    cta: 'Assistir trailer',
  },
];

const series = [
  {
    title: 'Downton Abbey',
    description: 'Downton Abbey retrata a elite britânica durante o início do século XX. Nessa época o mundo passava por uma revolução tecnológica e essas famílias ricas teriam que mudar seu estilo de vida e procurar novas formas de gerar riqueza.',
    event: 'Episódio final: 25 de dezembro de 2015',
    href: 'https://www.netflix.com/br/title/70213223',
    type: 'series' as const,
    rating: 5,
    year: '2010-2015',
    cta: 'Assistir no Netflix',
  },
  {
    title: 'Ozark',
    description: 'Ozark retrata a vida de um consultor financeiro de meia idade que luta para garantir a segurança de seus filhos e esposa. O mesmo acaba se envolvendo com um cartel de drogas mexicano e precisa fazer coisas inimagináveis.',
    event: 'Episódio final: 29 de abril de 2022',
    href: 'https://www.netflix.com/br/title/80117552',
    type: 'series' as const,
    rating: 5,
    year: '2017-2022',
    cta: 'Assistir no Netflix',
  },
  {
    title: 'Dark',
    description: 'Dark é uma série alemã cujo principal tema é viagem no tempo. A série se passa em uma pequena cidade e se inicia com o sumiço de duas crianças, criando um lapso temporal complexo e fascinante.',
    event: 'Episódio final: 27 de junho de 2020',
    href: 'https://www.netflix.com/br/title/80100172',
    type: 'series' as const,
    rating: 5,
    year: '2017-2020',
    cta: 'Assistir no Netflix',
  },
  {
    title: 'Breaking Bad',
    description: 'Um professor de química do ensino médio diagnosticado com câncer de pulmão terminal se volta para a fabricação e venda de metanfetamina para garantir o futuro financeiro de sua família.',
    event: 'Episódio final: 29 de setembro de 2013',
    href: 'https://www.netflix.com/br/title/70143836',
    type: 'series' as const,
    rating: 5,
    year: '2008-2013',
    cta: 'Assistir no Netflix',
  },
];

const podcasts = [
  {
    title: 'Marcelo Gleiser - Flow Podcast',
    description: 'Marcelo Gleiser é um dos maiores físicos brasileiros, pesquisador e professor da Faculdade de Dartmouth, EUA. Nesse podcast ele fala sobre a existência de vida extraterrestre, explicando todas as probabilidades com seu vasto conhecimento.',
    event: 'Transmitido ao vivo em 15 de setembro de 2023',
    href: 'https://www.youtube.com/watch?v=VGvLZl7DXsU',
    type: 'podcast' as const,
    rating: 5,
    year: '2023',
    cta: 'Assistir no YouTube',
  },
  {
    title: 'Miguel Nicolelis - Ciência Sem Fim',
    description: 'Miguel Nicolelis é o maior neurocientista brasileiro e cientista brasileiro vivo com maior influência mundial. Foi capaz de fazer um tetraplégico andar na Copa de 2014. Nesse podcast ele fala sobre sua vida, pesquisas e jornada científica.',
    event: 'Transmitido ao vivo em 6 de setembro de 2024',
    href: 'https://www.youtube.com/watch?v=C-_fNNUnIGk',
    type: 'podcast' as const,
    rating: 5,
    year: '2024',
    cta: 'Assistir no YouTube',
  },
  {
    title: 'Lex Fridman Podcast',
    description: 'Conversas profundas sobre ciência, tecnologia, história, filosofia e a natureza da inteligência, consciência, amor e poder. Com convidados como Elon Musk, Mark Zuckerberg e Linus Torvalds.',
    event: 'Episódios semanais',
    href: 'https://www.youtube.com/@lexfridman',
    type: 'podcast' as const,
    rating: 5,
    year: 'Ongoing',
    cta: 'Assistir no YouTube',
  },
];

const mediaCategories = [
  {
    title: 'Filmes',
    icon: <Film className="w-6 h-6" />,
    color: 'from-red-500 to-pink-600',
    items: movies,
  },
  {
    title: 'Séries',
    icon: <Tv className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600',
    items: series,
  },
  {
    title: 'Podcasts',
    icon: <Headphones className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-600',
    items: podcasts,
  },
];

export default function EntertainmentPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Entretenimento
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Filmes, séries e podcasts que recomendo. Tenho um gosto eclético,
            desde séries históricas como Downton Abbey até thrillers como Ozark
          </p>
        </motion.div>

        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Minhas Recomendações</h2>
          </div>
          <div className="space-y-3 text-white/80">
            <p>
              O entretenimento é uma parte importante do equilíbrio entre vida e trabalho.
              Estas são minhas recomendações pessoais de conteúdos que me inspiram,
              educam ou simplesmente proporcionam momentos de lazer de qualidade.
            </p>
            <p>
              Em relação aos estilos musicais, gosto muito de sertanejo e pop-rock,
              especialmente artistas como Imagine Dragons, OneRepublic e Zé Neto & Cristiano.
            </p>
          </div>

          {/* Music Preferences */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Play className="w-5 h-5 text-pink-400" />
              Artistas Favoritos
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Imagine Dragons', 'OneRepublic', 'Zé Neto & Cristiano', 'Coldplay', 'Maroon 5', 'The Weeknd'].map(artist => (
                <span
                  key={artist}
                  className="px-3 py-1 bg-pink-500/10 text-pink-400 rounded-full text-sm border border-pink-500/20"
                >
                  {artist}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Media Categories */}
        <div className="space-y-12">
          {mediaCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-lg bg-gradient-to-r ${category.color}`}
                >
                  {category.icon}
                </motion.div>
                <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, index) => (
                  <MediaCard
                    key={item.title}
                    {...item}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            Menções Especiais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-3">Documentários</h3>
              <ul className="space-y-2">
                {['The Social Dilemma', 'AlphaGo', 'Free Solo'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Animes</h3>
              <ul className="space-y-2">
                {['Death Note', 'Attack on Titan', 'Steins;Gate'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Livros Tech</h3>
              <ul className="space-y-2">
                {['Clean Code', 'The Pragmatic Programmer', 'Design Patterns'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              🎬 Sempre aberto a novas recomendações! Entre em contato se tiver sugestões de conteúdo
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}