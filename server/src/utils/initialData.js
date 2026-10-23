/**
 * Initial Seed Data for TripEasy
 * 10 Curated Attractions across Gampaha District, Sri Lanka
 * Sourced from Project Proposal and SRS requirements
 */

const initialCategories = [
  {
    _id: '662650000000000000000001',
    name: 'Religious',
    slug: 'religious',
    icon: '🕌',
    color: '#7c3aed',
    description: 'Temples, churches, and sacred shrines',
  },
  {
    _id: '662650000000000000000002',
    name: 'Nature',
    slug: 'nature',
    icon: '🌿',
    color: '#355637',
    description: 'Parks, beaches, and botanical gardens',
  },
  {
    _id: '662650000000000000000003',
    name: 'Hiking',
    slug: 'hiking',
    icon: '⛰️',
    color: '#b45309',
    description: 'Scenic peaks and forest walking trails',
  },
  {
    _id: '662650000000000000000004',
    name: 'Heritage',
    slug: 'heritage',
    icon: '🏛️',
    color: '#be123c',
    description: 'Ancient rock cave monasteries and historic ruins',
  },
  {
    _id: '662650000000000000000005',
    name: 'Sightseeing',
    slug: 'sightseeing',
    icon: '🎡',
    color: '#0f766e',
    description: 'Colonial waterways and cultural theme parks',
  },
  {
    _id: '662650000000000000000006',
    name: 'Restaurants',
    slug: 'restaurants',
    icon: '🍽️',
    color: '#c2410c',
    description: 'Family dining and authentic local cuisines',
  },
];

const initialAttractions = [
  {
    _id: '662651000000000000000001',
    name: 'National Basilica of Our Lady of Lanka, Tewatta',
    slug: 'national-basilica-of-our-lady-of-lanka-tewatta',
    category: '662650000000000000000001',
    description:
      'A prominent Catholic pilgrimage shrine featuring a vast indoor sanctuary, stunning stained glass windows, and tranquil gardens. One of the most significant Catholic shrines in Sri Lanka, attracting thousands of pilgrims annually.',
    images: [
      { filename: 'thewaththa.jpg', url: '/images/thewaththa.jpg', caption: 'Tewatta Basilica exterior' },
      { filename: 'thewaththa church.jpg', url: '/images/thewaththa church.jpg', caption: 'Tewatta Basilica main entrance' },
    ],
    location: {
      type: 'Point',
      coordinates: [79.9872, 7.0018], // [lng, lat]
      address: 'Tewatta, Ragama, Sri Lanka',
    },
    openingHours: {
      weekdays: '5:00 AM – 6:30 PM',
      weekends: '5:00 AM – 6:30 PM',
      notes: 'Open daily including public holidays',
    },
    entranceFee: { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
    travelInfo: { distanceFromRagama: 2.5, estimatedTravelTime: 8, estimatedVisitDuration: 60 },
    travelTips: [
      'Dress modestly – cover shoulders and knees',
      'Best visited during the Feast of Our Lady (July)',
      'Ample parking available on site',
      'Photography permitted outside the shrine',
    ],
    facilities: ['Parking', 'Restrooms', 'Souvenir shops', 'Gardens'],
    isActive: true,
  },
  {
    _id: '662651000000000000000002',
    name: 'Kelaniya Raja Maha Viharaya',
    slug: 'kelaniya-raja-maha-viharaya',
    category: '662650000000000000000001',
    description:
      'A historic Buddhist temple situated along the Kelani River, celebrated for its magnificent stupa and renowned Solias Mendis wall murals depicting the life of the Buddha. Considered one of the most sacred Buddhist temples in Sri Lanka.',
    images: [
      { filename: 'kelani 1.jpg', url: '/images/kelani 1.jpg', caption: 'Kelaniya Temple main stupa' },
      { filename: 'kelani 2.jpg', url: '/images/kelani 2.jpg', caption: 'Temple gardens' },
      { filename: 'kelani 3.jpg', url: '/images/kelani 3.jpg', caption: 'Interior murals' },
    ],
    location: {
      type: 'Point',
      coordinates: [79.9219, 6.9544],
      address: 'Kelaniya, Sri Lanka',
    },
    openingHours: {
      weekdays: '5:30 AM – 8:00 PM',
      weekends: '5:30 AM – 8:00 PM',
      notes: 'Open daily',
    },
    entranceFee: { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
    travelInfo: { distanceFromRagama: 10, estimatedTravelTime: 25, estimatedVisitDuration: 90 },
    travelTips: [
      'Remove shoes before entering the temple premises',
      'Dress in white or light-coloured clothing',
      'Visit during Duruthu Perahera festival (January) for a spectacular experience',
      'Best time is early morning to avoid crowds',
    ],
    facilities: ['Parking', 'Restrooms', 'Meditation hall', 'Museum'],
    isActive: true,
  },
  {
    _id: '662651000000000000000003',
    name: 'Uswetakeiyawa Beach',
    slug: 'uswetakeiyawa-beach',
    category: '662650000000000000000002',
    description:
      'A serene coastal beach area near Kandana/Wattala, perfect for ocean breezes, sunset walks, and quiet relaxation. The beach offers stunning views of the Indian Ocean and is popular among locals for evening picnics.',
    images: [
      { filename: 'uswatakeiyawa 1.jpg', url: '/images/uswatakeiyawa 1.jpg', caption: 'Uswetakeiyawa Beach shoreline' },
      { filename: 'uswatakeiyawa 2.jpg', url: '/images/uswatakeiyawa 2.jpg', caption: 'Sunset at the beach' },
    ],
    location: {
      type: 'Point',
      coordinates: [79.8912, 7.0534],
      address: 'Uswetakeiyawa, Kandana, Sri Lanka',
    },
    openingHours: {
      weekdays: 'Open 24 hours',
      weekends: 'Open 24 hours',
      notes: 'Best visited at sunrise or sunset',
    },
    entranceFee: { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
    travelInfo: { distanceFromRagama: 11, estimatedTravelTime: 30, estimatedVisitDuration: 60 },
    travelTips: [
      'Best visited at sunset for spectacular views',
      'Bring water and snacks – limited facilities nearby',
      'Swimming is not recommended due to strong currents',
      'Great spot for photography especially at golden hour',
    ],
    facilities: ['Parking (limited)', 'Seaside benches'],
    isActive: true,
  },
  {
    _id: '662651000000000000000004',
    name: 'Gampaha Botanical Garden (Henarathgoda)',
    slug: 'gampaha-botanical-garden-henarathgoda',
    category: '662650000000000000000002',
    description:
      "A historic botanical garden featuring Asia's first planted rubber tree, imported in 1876. Offers shaded walking paths through diverse plant collections, a scenic lake with boat rides, and tranquil picnic areas. An essential landmark of Sri Lanka's agricultural heritage.",
    images: [
      { filename: 'botnical1.jpg', url: '/images/botnical1.jpg', caption: 'Botanical garden pathways' },
      { filename: 'gampaha-henarathgoda-botanical-garden.jpg', url: '/images/gampaha-henarathgoda-botanical-garden.jpg', caption: 'Garden entrance' },
      { filename: 'Henarathgoda_Botanical_Garden.jpg', url: '/images/Henarathgoda_Botanical_Garden.jpg', caption: 'Historic rubber tree' },
    ],
    location: {
      type: 'Point',
      coordinates: [80.0044, 7.0849],
      address: 'Henarathgoda, Gampaha, Sri Lanka',
    },
    openingHours: {
      weekdays: '7:30 AM – 6:00 PM',
      weekends: '7:30 AM – 6:00 PM',
      notes: 'Open daily including public holidays',
    },
    entranceFee: { isFree: false, localAdult: 60, localChild: 30, foreignAdult: 1500, foreignChild: 750 },
    travelInfo: { distanceFromRagama: 18, estimatedTravelTime: 40, estimatedVisitDuration: 120 },
    travelTips: [
      'Wear comfortable walking shoes',
      'Bring a hat and sunscreen for open areas',
      'Boat rides are available at the lake for an extra fee',
      'Ideal for family picnics – bring food and drinks',
    ],
    facilities: ['Parking', 'Restrooms', 'Cafeteria', 'Picnic areas', 'Boat rides'],
    isActive: true,
  },
  {
    _id: '662651000000000000000005',
    name: 'Maligatenna Raja Maha Viharaya',
    slug: 'maligatenna-raja-maha-viharaya',
    category: '662650000000000000000003',
    description:
      "An ancient temple situated on Gampaha's highest peak, offering breathtaking 360-degree summit views of the surrounding landscape. The journey involves climbing rock-carved stairs past impressive granite outcrops. A perfect blend of spiritual and adventure experiences.",
    images: [
      { filename: 'maligathenna.jpg', url: '/images/maligathenna.jpg', caption: 'Maligatenna temple summit' },
      { filename: 'maligathenna1.jpg', url: '/images/maligathenna1.jpg', caption: 'Panoramic views from the peak' },
    ],
    location: {
      type: 'Point',
      coordinates: [80.0421, 7.1124],
      address: 'Maligatenna, Gampaha, Sri Lanka',
    },
    openingHours: {
      weekdays: '6:00 AM – 8:00 PM',
      weekends: '6:00 AM – 8:00 PM',
      notes: 'Best hiked in the early morning',
    },
    entranceFee: { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
    travelInfo: { distanceFromRagama: 23, estimatedTravelTime: 50, estimatedVisitDuration: 120 },
    travelTips: [
      'Wear sturdy footwear – stairs can be steep and slippery when wet',
      'Carry water for the climb',
      'Best visited in the early morning for cool temperatures and clear views',
      'Dress modestly as it is an active temple',
    ],
    facilities: ['Parking (limited)', 'Rock stairs', 'Viewpoint'],
    isActive: true,
  },
  {
    _id: '662651000000000000000006',
    name: 'Pilikuttuwa Raja Maha Viharaya',
    slug: 'pilikuttuwa-raja-maha-viharaya',
    category: '662650000000000000000003',
    description:
      'A remarkable forest cave complex offering shaded nature walks through dense forest canopy and access to over 90 natural rock caves. The site features ancient cave paintings and inscriptions, making it one of the most archaeologically significant sites in the Western Province.',
    images: [
      { filename: 'pilikaththuva viharaya.jpg', url: '/images/pilikaththuva viharaya.jpg', caption: 'Cave temple entrance' },
      { filename: 'pilikaththuva viharaya1.jpg', url: '/images/pilikaththuva viharaya1.jpg', caption: 'Rock cave interior' },
    ],
    location: {
      type: 'Point',
      coordinates: [80.0076, 7.0978],
      address: 'Pilikuttuwa, Gampaha, Sri Lanka',
    },
    openingHours: { weekdays: '6:00 AM – 6:00 PM', weekends: '6:00 AM – 6:00 PM' },
    entranceFee: { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
    travelInfo: { distanceFromRagama: 18, estimatedTravelTime: 40, estimatedVisitDuration: 90 },
    travelTips: [
      'Bring a torch/flashlight for exploring caves',
      'Watch out for monkeys – keep food secured',
      'The forest path can be muddy after rain',
      'Respect the temple environment – no loud noise',
    ],
    facilities: ['Parking', 'Forest trail', 'Historic caves'],
    isActive: true,
  },
  {
    _id: '662651000000000000000007',
    name: 'Vaarana Rajamaha Viharaya',
    slug: 'vaarana-rajamaha-viharaya',
    category: '662650000000000000000004',
    description:
      'An ancient rock cave temple dating back to the era of King Devanampiyatissa (3rd century BC). The site is split across three distinct hill levels, each featuring old frescoes, stone inscriptions, and Buddhist relics. A site of immense historical and cultural significance.',
    images: [
      { filename: 'vaarana.jpg', url: '/images/vaarana.jpg', caption: 'Vaarana rock cave temple' },
      { filename: 'meda-maluwa-temple-of-the-varana-monastery-900_orig.jpg', url: '/images/meda-maluwa-temple-of-the-varana-monastery-900_orig.jpg', caption: 'Meda Maluwa of Varana Monastery' },
    ],
    location: {
      type: 'Point',
      coordinates: [80.0287, 7.1245],
      address: 'Vaarana, Gampaha, Sri Lanka',
    },
    openingHours: { weekdays: '6:00 AM – 8:00 PM', weekends: '6:00 AM – 8:00 PM' },
    entranceFee: { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
    travelInfo: { distanceFromRagama: 21, estimatedTravelTime: 45, estimatedVisitDuration: 90 },
    travelTips: [
      'Visit all three hill levels for the complete experience',
      'The oldest frescoes are on the top level',
      'Wear comfortable shoes for the uneven terrain',
      'An early morning visit avoids the midday heat',
    ],
    facilities: ['Parking (limited)', 'Hilltop sanctuary'],
    isActive: true,
  },
  {
    _id: '662651000000000000000008',
    name: 'Kiththa Restaurant',
    slug: 'kiththa-restaurant',
    category: '662650000000000000000006',
    description:
      'A high-demand family and group dining destination serving over 100 dishes spanning Sri Lankan, Chinese, Thai, and Western cuisines. Features an air-conditioned banquet hall, a lush outdoor garden, and live music on weekends. A perfect dining stop during your Gampaha day tour.',
    images: [
      { filename: 'kiththa restaurant.jpg', url: '/images/kiththa restaurant.jpg', caption: 'Kiththa Restaurant exterior' },
      { filename: 'kiththa restaurant1.jpg', url: '/images/kiththa restaurant1.jpg', caption: 'Dining hall' },
      { filename: 'kiththa restaurant2.jpg', url: '/images/kiththa restaurant2.jpg', caption: 'Outdoor garden dining area' },
    ],
    location: {
      type: 'Point',
      coordinates: [79.9987, 7.0154],
      address: 'Ragama, Gampaha, Sri Lanka',
    },
    openingHours: {
      weekdays: '11:00 AM – 11:00 PM',
      weekends: '11:00 AM – 11:00 PM',
      notes: 'Live music on weekends',
    },
    entranceFee: { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
    travelInfo: { distanceFromRagama: 1.8, estimatedTravelTime: 5, estimatedVisitDuration: 90 },
    travelTips: [
      'Reservations recommended for weekends',
      'Try the Sri Lankan rice and curry buffet',
      'Group dining packages available – call ahead',
      'Vegan and vegetarian options available',
    ],
    facilities: ['Parking', 'AC hall', 'Outdoor garden', 'Live music (weekends)', 'Restrooms'],
    contactInfo: { phone: '+94 11 295 8899' },
    isActive: true,
  },
  {
    _id: '662651000000000000000009',
    name: 'Dutch Canal (Hamilton Canal)',
    slug: 'dutch-canal-hamilton-canal',
    category: '662650000000000000000005',
    description:
      "A historic waterway constructed during the colonial Dutch era in the 18th century, stretching near Hendala and connecting the region's waterways. Offers scenic local boat rides, opportunities to observe traditional fishing communities, and a unique perspective on Sri Lanka's colonial maritime heritage.",
    images: [
      { filename: 'hamilton.jpg', url: '/images/hamilton.jpg', caption: 'Hamilton Canal scenic view' },
      { filename: 'hamilton1.jpg', url: '/images/hamilton1.jpg', caption: 'Boat ride on the canal' },
    ],
    location: {
      type: 'Point',
      coordinates: [79.9156, 7.0341],
      address: 'Hendala, Wattala, Sri Lanka',
    },
    openingHours: {
      weekdays: 'Open 24 hours',
      weekends: 'Open 24 hours',
      notes: 'Boat rides typically available 7:00 AM – 6:00 PM',
    },
    entranceFee: { isFree: true, localAdult: 0, localChild: 0, foreignAdult: 0, foreignChild: 0 },
    travelInfo: { distanceFromRagama: 8, estimatedTravelTime: 20, estimatedVisitDuration: 60 },
    travelTips: [
      'Hire a local boat for a memorable canal experience',
      'Best time is early morning for calm water and birdwatching',
      'Bring insect repellent for the waterside areas',
      'Respect local fishing communities along the canal',
    ],
    facilities: ['Boat rentals (nearby)', 'Canal bank walkway'],
    isActive: true,
  },
  {
    _id: '662651000000000000000010',
    name: 'Guruge Nature Park',
    slug: 'guruge-nature-park',
    category: '662650000000000000000005',
    description:
      'A theme park showcasing traditional Sri Lankan cultural heritage through an ancient village replica, a regional museum, and family-friendly rides. The park preserves and displays traditional crafts, cooking methods, and rural lifestyles, offering an immersive cultural experience for all ages.',
    images: [
      { filename: 'guruge nature park.jpg', url: '/images/guruge nature park.jpg', caption: 'Guruge Nature Park entrance' },
      { filename: 'guruge nature park1.jpg', url: '/images/guruge nature park1.jpg', caption: 'Cultural village replica' },
    ],
    location: {
      type: 'Point',
      coordinates: [79.9743, 7.0223],
      address: 'Wattala, Gampaha, Sri Lanka',
    },
    openingHours: {
      weekdays: '8:30 AM – 6:00 PM',
      weekends: '8:30 AM – 6:00 PM',
      notes: 'Closed on Mondays',
    },
    entranceFee: { isFree: false, localAdult: 250, localChild: 150, foreignAdult: 1000, foreignChild: 500 },
    travelInfo: { distanceFromRagama: 7, estimatedTravelTime: 18, estimatedVisitDuration: 120 },
    travelTips: [
      'Great for families with children',
      'Traditional food tastings available on weekends',
      'Photography is encouraged throughout the park',
      'Allow at least 2 hours to fully explore the park',
    ],
    facilities: ['Parking', 'Restrooms', 'Cafeteria', 'Gift shop', 'Picnic area'],
    isActive: true,
  },
];

const initialAdmin = {
  _id: '662652000000000000000001',
  username: 'admin',
  password: 'Admin@2024',
  email: 'admin@tripeasy.lk',
  role: 'superadmin',
};

module.exports = {
  initialCategories,
  initialAttractions,
  initialAdmin,
};
