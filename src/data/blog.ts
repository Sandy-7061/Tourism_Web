import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-001', title: '10 Must-Visit Hidden Gems in Rajasthan', slug: 'hidden-gems-rajasthan',
    excerpt: 'Beyond Jaipur and Udaipur, Rajasthan hides extraordinary treasures — from the blue city of Bundi to the abandoned ghost town of Kuldhara.',
    content: `Rajasthan is much more than the Golden Triangle. While millions flock to Jaipur, Udaipur, and Jaisalmer, the state is dotted with extraordinary destinations that most travelers never discover.

## 1. Bundi — The Forgotten Blue City
Bundi's indigo-washed old city predates Jodhpur's fame. The Taragarh Fort, Bundi Palace, and the famous step wells (baolis) create an atmospheric medieval time capsule.

## 2. Chittorgarh — The Fortress of Sacrifice
India's largest fort complex tells the tragic story of Rajput resistance and the legendary jauhar (mass self-immolation). The Vijay Stambha tower is an architectural masterpiece.

## 3. Shekhawati — The Open-Air Art Gallery
The trading towns of Mandawa, Nawalgarh, and Fatehpur are covered in extraordinary painted havelis — India's most concentrated collection of frescoes.`,
    author: { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', bio: 'Travel writer and photographer with 10 years of experience across India.' },
    category: 'Destinations', tags: ['Rajasthan', 'Hidden Gems', 'Heritage', 'Off-beat'],
    thumbnail: 'https://images.unsplash.com/photo-1477587458883-47145ed68580?w=800&q=80',
    publishedAt: '2024-01-15', readTime: 8, featured: true,
  },
  {
    id: 'blog-002', title: 'Kerala Houseboat Experience: Everything You Need to Know', slug: 'kerala-houseboat-guide',
    excerpt: 'From choosing the right houseboat to what to eat on board — the complete guide to Kerala\'s iconic backwater experience.',
    content: `The Kerala houseboat experience is unlike anything else in India. Drifting through mirror-calm backwaters on a traditional kettuvallam (rice boat) converted into a luxury floating home is pure magic.

## Choosing Your Houseboat
Houseboats range from basic 1-bedroom to 5-bedroom luxury vessels. For couples, a 1-bedroom deluxe AC houseboat with meals included is ideal (₹8,000–₹15,000/night).

## Best Season
October to March is ideal — the monsoon makes waterways choppy. November and December are peak months.

## What's Included
Premium houseboats include all meals (often Kerala seafood), a private deck, AC bedrooms, and a crew of 3-4 including a cook.`,
    author: { name: 'Arjun Nair', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', bio: 'Kerala-based travel blogger and Ayurveda enthusiast.' },
    category: 'Travel Tips', tags: ['Kerala', 'Houseboat', 'Backwaters', 'Guide'],
    thumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    publishedAt: '2024-01-22', readTime: 10, featured: true,
  },
  {
    id: 'blog-003', title: 'The Perfect 10-Day Kashmir Itinerary', slug: 'kashmir-10-day-itinerary',
    excerpt: 'Plan the perfect Kashmir holiday with this detailed 10-day itinerary covering Srinagar, Gulmarg, Pahalgam, and Sonamarg.',
    content: `Kashmir rightfully deserves its "Paradise on Earth" title. This 10-day itinerary takes you through the best of what this Himalayan jewel offers.

## Days 1-3: Srinagar
Start with a shikara ride on Dal Lake at dawn when the floating market comes alive. Stay in a traditional houseboat with its carved walnut wood interiors and Kashmiri carpets.

## Days 4-5: Gulmarg
Drive 56 km to Gulmarg (Meadow of Flowers) and take Asia's highest cable car — the Gulmarg Gondola — to Kongdori at 13,400 feet.`,
    author: { name: 'Zara Khan', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', bio: 'Adventure traveler and mountain photography enthusiast.' },
    category: 'Itineraries', tags: ['Kashmir', 'Itinerary', 'Mountains', 'Dal Lake'],
    thumbnail: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80',
    publishedAt: '2024-02-01', readTime: 12, featured: true,
  },
  {
    id: 'blog-004', title: 'Goa on a Budget: Travel for ₹2000/Day', slug: 'goa-budget-travel',
    excerpt: 'Beaches, parties, and great food — you don\'t need to spend a fortune in Goa. Here\'s how to enjoy everything on ₹2000 a day.',
    content: `Goa has a reputation for being expensive, but with the right planning, you can enjoy everything this beautiful state offers on a shoestring budget.

## Accommodation
Skip the beach resorts and look for guesthouses in Calangute, Baga, or Anjuna. You'll find clean AC rooms for ₹500–₹800/night.

## Food
Eat where the locals eat — small beach shacks away from the tourist strip serve fresh fish for ₹150–₹250. The famous Goa beach shacks markup prices by 200%.`,
    author: { name: 'Rahul Gupta', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', bio: 'Backpacker and budget travel expert.' },
    category: 'Budget Travel', tags: ['Goa', 'Budget', 'Backpacking', 'Beaches'],
    thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    publishedAt: '2024-02-10', readTime: 7, featured: false,
  },
  {
    id: 'blog-005', title: 'Leh Ladakh Bike Trip: The Ultimate Guide', slug: 'leh-ladakh-bike-guide',
    excerpt: 'Everything about planning a Royal Enfield ride to Leh Ladakh — from the best routes and acclimatization to permits and bike rentals.',
    content: `The Leh Ladakh motorcycle expedition is India's most iconic road trip. Here's everything you need to plan the ride of your life.

## Route Options
**Manali-Leh Highway** (490 km): Opens June-October. Passes through Rohtang La, Baralacha La, Nakee La, and Tanglang La.
**Srinagar-Leh Highway** (432 km): Opens April-November. More gradual altitude gain — easier for acclimatization.

## Acclimatization is Critical
Acute Mountain Sickness (AMS) is a serious risk above 10,000 feet. Spend 2 days in Leh before venturing to high passes.`,
    author: { name: 'Vikram Singh', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', bio: 'Motorcycle enthusiast who has ridden 50,000+ km across India.' },
    category: 'Adventure', tags: ['Ladakh', 'Bike Trip', 'Royal Enfield', 'Mountains'],
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    publishedAt: '2024-02-18', readTime: 15, featured: false,
  },
  {
    id: 'blog-006', title: 'India\'s Most Instagrammable Destinations 2024', slug: 'most-instagrammable-india',
    excerpt: 'From the golden dunes of Jaisalmer to the flower gardens of Kashmir — the most photogenic places in India for your feed.',
    content: `India is a paradise for photographers and Instagram enthusiasts. Here are the locations guaranteed to make your followers double-tap.

## 1. Dal Lake at Sunrise — Srinagar
The mirror-calm water reflecting snow-capped peaks is what dreams are made of. Get there at 5:30 AM before wind disturbs the reflection.

## 2. Jaisalmer Fort at Golden Hour
The sandstone fort literally glows gold at sunset. Position yourself at Patwon ki Haveli rooftop for the best angle.

## 3. Hawa Mahal — The Honeycomb Palace
Jaipur's most photographed monument looks stunning in early morning soft light. Shoot from the street opposite for the full facade.`,
    author: { name: 'Deepika Joshi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', bio: 'Travel photographer and content creator with 200K+ Instagram followers.' },
    category: 'Photography', tags: ['Photography', 'Instagram', 'India', 'Best Places'],
    thumbnail: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    publishedAt: '2024-03-01', readTime: 9, featured: false,
  },
  {
    id: 'blog-007', title: 'Best Time to Visit Each Indian Destination', slug: 'best-time-india-travel',
    excerpt: 'India\'s diverse geography means the best time to visit varies wildly. Use this guide to plan your trips season by season.',
    content: `India's climate is enormously diverse — from the tropical beaches of Goa to the frozen peaks of Ladakh. Planning around seasons is crucial.

## Winter (October – February): Best Overall
The most popular travel season. Most of India — Rajasthan, Kerala, Goa, and the South — is at its best. Cold nights in Rajasthan add character.

## Summer (March – June): Hill Stations Shine  
When the plains bake, Shimla, Manali, Ooty, Darjeeling, and Mussoorie offer cool relief. Best time for Kashmir's meadows.

## Monsoon (July – September): Underrated
Kerala's backwaters are lush and uncrowded. Rajasthan's colours are vibrant. Ladakh gets very little rain (rain shadow zone).`,
    author: { name: 'Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', bio: 'India travel expert and author of \'The India Traveler\'s Handbook\'.' },
    category: 'Travel Tips', tags: ['Travel Tips', 'Seasons', 'Planning', 'India'],
    thumbnail: 'https://images.unsplash.com/photo-1477587458883-47145ed68580?w=800&q=80',
    publishedAt: '2024-03-10', readTime: 11, featured: false,
  },
  {
    id: 'blog-008', title: 'Ayurveda Retreats in Kerala: A Complete Guide', slug: 'ayurveda-kerala-guide',
    excerpt: 'Kerala is the global capital of authentic Ayurveda. Here\'s how to choose the right retreat, what to expect, and the best wellness resorts.',
    content: `Kerala is the heartland of Ayurveda — the 5,000-year-old science of life. While many destinations offer Ayurvedic massage, Kerala's certified practitioners use authentic techniques passed down through generations.

## What is Authentic Ayurveda?
Genuine Ayurveda involves a consultation with a qualified Ayurvedic doctor (Vaidya) who prescribes treatments based on your dosha (constitution). A standard treatment programme runs 7-21 days.

## Best Ayurveda Resorts
**Somatheeram Ayurveda Village** — First eco-resort in the world. Award-winning authentic programmes.
**Kairali Ayurvedic Health Village** — 50 acres of healing gardens in Palakkad.`,
    author: { name: 'Dr. Meera Pillai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', bio: 'Ayurvedic practitioner and wellness travel writer based in Trivandrum.' },
    category: 'Wellness', tags: ['Kerala', 'Ayurveda', 'Wellness', 'Retreat'],
    thumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    publishedAt: '2024-03-18', readTime: 13, featured: false,
  },
  {
    id: 'blog-009', title: 'India\'s Best Wildlife Safaris: A Field Guide', slug: 'india-wildlife-safaris',
    excerpt: 'India has 50+ tiger reserves and countless national parks. Here\'s your guide to spotting tigers, elephants, and rhinoceroses on Indian safari.',
    content: `India is one of the world's great wildlife destinations, home to tigers, elephants, rhinoceroses, leopards, and over 1,300 species of birds.

## Best Tiger Destinations
**Bandhavgarh** (MP): Highest tiger density in India. Morning Zone B and C drives have excellent sighting rates.
**Ranthambore** (Rajasthan): Famous for diurnal tigers — great for photography. Book 3-4 months ahead.
**Corbett** (Uttarakhand): India's oldest park. The Dhikala zone offers incredible biodiversity.

## Safari Types
**Jeep safari**: 6-seater open jeeps with a naturalist — the gold standard.
**Canter safari**: 20-seater bus — cheaper but noisier and less intimate.`,
    author: { name: 'Raghav Menon', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', bio: 'Wildlife photographer and naturalist guide with 15 years in Indian jungles.' },
    category: 'Wildlife', tags: ['Wildlife', 'Tigers', 'Safari', 'National Parks'],
    thumbnail: 'https://images.unsplash.com/photo-1535083783855-ded51a685010?w=800&q=80',
    publishedAt: '2024-03-25', readTime: 14, featured: false,
  },
  {
    id: 'blog-010', title: 'Street Food Tour of India: 30 Dishes to Try', slug: 'india-street-food-guide',
    excerpt: 'From Mumbai\'s vada pav to Kolkata\'s kathi roll and Delhi\'s chaat — India\'s street food is a world unto itself.',
    content: `India's street food scene is staggering in its diversity and depth. Each city, each state, even each neighbourhood has its own iconic dishes.

## The North India Circuit
**Delhi**: Chole bhature at Sita Ram, Old Delhi. Parathe at Paranthe Wali Gali in Chandni Chowk.
**Agra**: Petha (white pumpkin candy), bedai with aloo sabzi.
**Lucknow**: Tunday kebab, basket chaat, kulfi faluda.

## Mumbai's Street Food Galaxy
The vada pav is Mumbai's soul — spiced potato dumpling in a bread roll. Bhel puri at Juhu Beach. Pav bhaji at Sardar's in Tardeo.`,
    author: { name: 'Chef Sandeep Rao', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', bio: 'Food writer and culinary traveler who has eaten at 500+ street food stalls.' },
    category: 'Food & Culture', tags: ['Food', 'Street Food', 'Culture', 'Indian Cuisine'],
    thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    publishedAt: '2024-04-01', readTime: 10, featured: false,
  },
];

export default blogPosts;
