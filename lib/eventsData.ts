export type EventType = "festival" | "national" | "cultural" | "society";

export interface SocietyEvent {
  id: number;
  name: string;
  date: string;
  type: EventType;
  description: string;
  location: string;
  time: string;
  custom?: boolean;
}

export const BASE_EVENTS: SocietyEvent[] = [
  { id: 1,  name: "New Year's Day",                      date: "2026-01-01", type: "national",  description: "Welcome 2026 with society celebrations.", location: "Society Lawn", time: "12:00 AM" },
  { id: 2,  name: "Lohri",                               date: "2026-01-13", type: "festival",  description: "Harvest festival with bonfire, songs and rewri.", location: "Society Lawn", time: "7:00 PM" },
  { id: 3,  name: "Makar Sankranti",                     date: "2026-01-14", type: "festival",  description: "Kite flying festival marking the sun's northward journey.", location: "Society Terrace", time: "10:00 AM" },
  { id: 4,  name: "Vasant Panchami",                     date: "2026-01-23", type: "festival",  description: "Saraswati Puja - festival of knowledge and spring.", location: "Clubhouse", time: "9:00 AM" },
  { id: 5,  name: "Republic Day",                        date: "2026-01-26", type: "national",  description: "Flag hoisting and patriotic program for all residents.", location: "Society Lawn", time: "8:00 AM" },
  { id: 6,  name: "New Year Society Meeting",            date: "2026-01-28", type: "society",   description: "Annual planning and review meeting for 2026.", location: "Community Hall", time: "6:00 PM" },
  { id: 7,  name: "Maha Shivratri",                      date: "2026-02-15", type: "festival",  description: "Night-long celebration in honour of Lord Shiva.", location: "Clubhouse", time: "8:00 PM" },
  { id: 8,  name: "Chhatrapati Shivaji Maharaj Jayanti", date: "2026-02-19", type: "national",  description: "Birth anniversary of the great Maratha king.", location: "Community Hall", time: "9:00 AM" },
  { id: 9,  name: "Holika Dahan",                        date: "2026-03-03", type: "festival",  description: "Bonfire night symbolising victory of good over evil.", location: "Society Lawn", time: "8:00 PM" },
  { id: 10, name: "Holi",                                date: "2026-03-04", type: "festival",  description: "Festival of colours - community celebration with gulal.", location: "Society Lawn", time: "10:00 AM" },
  { id: 11, name: "Gudi Padwa / Ugadi",                  date: "2026-03-19", type: "festival",  description: "Marathi and Telugu New Year - new beginnings.", location: "Clubhouse", time: "9:00 AM" },
  { id: 12, name: "Chaitra Navratri Begins",             date: "2026-03-19", type: "festival",  description: "Nine nights of Goddess Durga worship begins.", location: "Clubhouse", time: "7:00 PM" },
  { id: 13, name: "Ram Navami",                          date: "2026-03-26", type: "festival",  description: "Birth anniversary of Lord Ram - bhajan and puja.", location: "Clubhouse", time: "10:00 AM" },
  { id: 14, name: "Hanuman Jayanti",                     date: "2026-04-02", type: "festival",  description: "Birth anniversary of Lord Hanuman - Sundarkand path.", location: "Clubhouse", time: "8:00 AM" },
  { id: 15, name: "Ambedkar Jayanti",                    date: "2026-04-14", type: "national",  description: "Birth anniversary of Dr. B.R. Ambedkar.", location: "Community Hall", time: "9:00 AM" },
  { id: 16, name: "Society Cleanliness Drive",           date: "2026-04-19", type: "society",   description: "Society-wide cleaning and beautification drive.", location: "All Areas", time: "7:00 AM" },
  { id: 17, name: "Maharashtra Day",                     date: "2026-05-01", type: "national",  description: "Maharashtra state formation day - flag hoisting.", location: "Society Lawn", time: "8:00 AM" },
  { id: 18, name: "Buddha Purnima",                      date: "2026-05-01", type: "festival",  description: "Birth anniversary of Gautam Buddha.", location: "Clubhouse", time: "9:00 AM" },
  { id: 19, name: "Summer Sports Tournament",            date: "2026-05-17", type: "society",   description: "Cricket, badminton and fun games for all age groups.", location: "Sports Ground", time: "5:00 PM" },
  { id: 20, name: "International Yoga Day",              date: "2026-06-21", type: "cultural",  description: "Community yoga session for all residents.", location: "Society Lawn", time: "6:30 AM" },
  { id: 21, name: "Monsoon Preparation Meeting",         date: "2026-06-28", type: "society",   description: "Drainage cleaning and waterproofing planning.", location: "Community Hall", time: "6:00 PM" },
  { id: 22, name: "Fire Safety Drill",                   date: "2026-07-15", type: "society",   description: "Mandatory fire safety drill for all residents.", location: "All Wings", time: "11:00 AM" },
  { id: 23, name: "Guru Purnima",                        date: "2026-07-29", type: "festival",  description: "Day to honour teachers and spiritual gurus.", location: "Clubhouse", time: "9:00 AM" },
  { id: 24, name: "Independence Day",                    date: "2026-08-15", type: "national",  description: "Flag hoisting and patriotic program for all residents.", location: "Society Lawn", time: "8:00 AM" },
  { id: 25, name: "Raksha Bandhan",                      date: "2026-08-28", type: "festival",  description: "Festival celebrating the bond between brothers and sisters.", location: "Clubhouse", time: "10:00 AM" },
  { id: 26, name: "Janmashtami",                         date: "2026-09-04", type: "festival",  description: "Birth of Lord Krishna - dahi handi and bhajan.", location: "Society Lawn", time: "8:00 PM" },
  { id: 27, name: "Teachers Day",                        date: "2026-09-05", type: "national",  description: "Honouring teachers on Dr. Radhakrishnan's birthday.", location: "Community Hall", time: "10:00 AM" },
  { id: 28, name: "Ganesh Chaturthi",                    date: "2026-09-14", type: "festival",  description: "Ganesh idol installation - 10-day community celebration.", location: "Clubhouse", time: "10:00 AM" },
  { id: 29, name: "Ganesh Visarjan",                     date: "2026-09-25", type: "festival",  description: "Anant Chaturdashi - farewell procession for Ganpati Bappa.", location: "Society Gate", time: "6:00 PM" },
  { id: 30, name: "Cultural Night",                      date: "2026-09-27", type: "cultural",  description: "Music, dance and cultural performances by residents.", location: "Community Hall", time: "7:00 PM" },
  { id: 31, name: "Gandhi Jayanti",                      date: "2026-10-02", type: "national",  description: "Birth anniversary of Mahatma Gandhi.", location: "Community Hall", time: "9:00 AM" },
  { id: 32, name: "Navratri Begins",                     date: "2026-10-11", type: "festival",  description: "Nine nights of Garba and Goddess Durga worship.", location: "Society Lawn", time: "7:00 PM" },
  { id: 33, name: "Navratri Garba Night",                date: "2026-10-17", type: "cultural",  description: "Grand Garba and Dandiya night for all residents.", location: "Society Lawn", time: "7:30 PM" },
  { id: 34, name: "Dussehra / Vijayadashami",            date: "2026-10-20", type: "festival",  description: "Victory of good over evil - Ravan dahan celebration.", location: "Society Lawn", time: "6:00 PM" },
  { id: 35, name: "Dhanteras",                           date: "2026-11-06", type: "festival",  description: "Auspicious day for buying gold and new items.", location: "Clubhouse", time: "6:00 PM" },
  { id: 36, name: "Diwali",                              date: "2026-11-08", type: "festival",  description: "Festival of lights - society decoration and fireworks.", location: "All Wings", time: "6:00 PM" },
  { id: 37, name: "Govardhan Puja",                      date: "2026-11-10", type: "festival",  description: "Annakut celebration - Gujarati New Year.", location: "Clubhouse", time: "9:00 AM" },
  { id: 38, name: "Bhau Bij / Bhaiya Dooj",              date: "2026-11-11", type: "festival",  description: "Brother-sister bond celebration.", location: "Clubhouse", time: "10:00 AM" },
  { id: 39, name: "Children's Day",                      date: "2026-11-14", type: "national",  description: "Fun activities and games for children of the society.", location: "Clubhouse", time: "10:00 AM" },
  { id: 40, name: "Guru Nanak Jayanti",                  date: "2026-11-24", type: "festival",  description: "Birth anniversary of Guru Nanak Dev Ji.", location: "Community Hall", time: "9:00 AM" },
  { id: 41, name: "Maintenance Review Meeting",          date: "2026-11-25", type: "society",   description: "Quarterly maintenance review and planning.", location: "Community Hall", time: "6:00 PM" },
  { id: 42, name: "Annual Function",                     date: "2026-12-12", type: "society",   description: "Cultural program, talent show and prize distribution.", location: "Community Hall", time: "5:00 PM" },
  { id: 43, name: "Christmas",                           date: "2026-12-25", type: "festival",  description: "Christmas celebration with carols and cake.", location: "Clubhouse", time: "6:00 PM" },
  { id: 44, name: "Year-End Review Meeting",             date: "2026-12-27", type: "society",   description: "Annual review and planning for 2027.", location: "Community Hall", time: "6:00 PM" },
  { id: 45, name: "New Year's Eve",                      date: "2026-12-31", type: "cultural",  description: "Countdown party and farewell to 2026.", location: "Society Lawn", time: "9:00 PM" },
];
