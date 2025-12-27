export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

export const newsData: NewsItem[] = [
  {
    id: '1',
    slug: 'descubrimiento-ruinas-antiguas',
    title: '¡DESCUBRIMIENTO IMPACTANTE!',
    excerpt: 'Exploradores hallan ruinas Pre-Colapso en el Sector 7.',
    content: `
      <p><strong>SECTOR 7 - BORDE EXTERIOR</strong></p>
      <p>Una expedición minera rutinaria se ha convertido en el hallazgo arqueológico del siglo. El equipo de perforación "Deep Core Alpha" tropezó con una estructura metálica de origen desconocido enterrada bajo kilómetros de hielo en la luna de Erebos.</p>
      <p>"Nunca habíamos visto nada igual", declaró la Comandante Riker. "Los símbolos brillan cuando nos acercamos. Es tecnología viva."</p>
      <p>Las corporaciones ya están movilizando sus flotas privadas para asegurar el área. Se espera que estalle un conflicto armado si la Federación no interviene pronto. Los analistas predicen que este descubrimiento podría alterar el equilibrio de poder en todo el sistema.</p>
      <p>¿Qué secretos esconden estas ruinas? ¿Son la clave para la energía infinita o una advertencia de nuestros antepasados? Manténganse sintonizados.</p>
    `,
    image: 'https://placehold.co/600x400/1a1a1a/ffff00/png?text=RUINAS+HALLADAS',
    date: '12 OCT 2145',
    author: 'J. Jameson',
    category: 'XENARQUEOLOGÍA'
  },
  {
    id: '2',
    slug: 'caida-precio-samium',
    title: 'COLAPSO DEL MERCADO',
    excerpt: 'El valor del Samium se desploma tras el escándalo de CorpX.',
    content: `
      <p><strong>BOLSA GALÁCTICA - CENTRAL</strong></p>
      <p>El pánico se apoderó de los inversores esta mañana cuando se filtró información sobre el fraude masivo de reservas perpetrado por CorpX. Millones de créditos se evaporaron en segundos.</p>
      <p>El Samium, el combustible vital para los motores FTL, ha perdido un 30% de su valor. "Es una carnicería", comentó un bróker desde la estación orbital. "Si esto sigue así, muchas colonias quedarán aisladas sin combustible asequible."</p>
    `,
    image: 'https://placehold.co/600x400/3d0000/ff3333/png?text=CRISIS+MERCADO',
    date: '10 OCT 2145',
    author: 'Crypto Analyst',
    category: 'ECONOMÍA'
  },
  {
    id: '3',
    slug: 'nueva-flota-pirata',
    title: 'AMENAZA EN LA RUTA 66',
    excerpt: 'Una nueva flota pirata asalta cargueros sin piedad.',
    content: `
      <p>Se recomienda precaución extrema a todos los transportistas. La banda conocida como "Los Hijos del Vacío" ha sido avistada con fragatas de grado militar.</p>
    `,
    image: 'https://placehold.co/600x400/00003d/00f3ff/png?text=ALERTA+PIRATA',
    date: '08 OCT 2145',
    author: 'SecForce',
    category: 'SEGURIDAD'
  },
    {
    id: '4',
    slug: 'festival-de-las-luces',
    title: 'FESTIVAL DE LUCES EN NEO-TOKYO',
    excerpt: 'La capital celebra 100 años de la fundación con un espectáculo orbital.',
    content: `
      <p>Miles de naves formaron hologramas en la órbita baja, celebrando el centenario de la colonia más próspera del sector.</p>
    `,
    image: 'https://placehold.co/600x400/2a2a2a/ffffff/png?text=FESTIVAL',
    date: '05 OCT 2145',
    author: 'Art & Culture',
    category: 'SOCIEDAD'
  }
];
